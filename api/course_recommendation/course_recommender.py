import os
import sys
import random
from time import time
import polars as pl

import pandas as pd
from tqdm import tqdm
import torch.nn as nn
import torch.optim as optim
import numpy as np

import torch
from .models.BPRMF import BPRMF
from .models.KGAT import KGAT
from .models.NFM import NFM

from .utils.model_helper import *

import dotsi

# Get user, course mapping, train_user_dict (DataLoader)
def get_mapping(user_path, course_path, kg_path):
    users = pl.read_csv(user_path, separator=' ')
    courses = pl.read_csv(course_path, separator=' ')
    user_org2int = dict(zip(users['org_id'], users['remap_id']))
    user_int2org = users['org_id'].to_list()
    course_org2int = dict(zip(courses['org_id'], courses['remap_id']))
    course_int2org = courses['org_id'].to_list()

    # Read kg data
    kg_data = pd.read_csv(kg_path, sep=' ', names=['h', 'r', 't'], engine='python')
    kg_data = kg_data.drop_duplicates()
    
    # add inverse kg data
    n_relations = max(kg_data['r']) + 1
    inverse_kg_data = kg_data.copy()
    inverse_kg_data = inverse_kg_data.rename({'h': 't', 't': 'h'}, axis='columns')
    inverse_kg_data['r'] += n_relations
    kg_data = pd.concat([kg_data, inverse_kg_data], axis=0, ignore_index=True, sort=False)

    # re-map user id
    kg_data['r'] += 2
    n_relations = max(kg_data['r']) + 1
    n_entities = max(max(kg_data['h']), max(kg_data['t'])) + 1

    return (user_org2int, user_int2org, course_org2int, course_int2org, 
            users.shape[0], courses.shape[0], n_relations, n_entities)

def load_user_dict(user_path):
    user_dict = {}

    with open(user_path, 'r', encoding='utf-8') as rf:
        for line in rf.readlines():
            line = list(map(int, line.strip().split()))
            user, courses = line[0], line[1:]
            user_dict[user] = courses
    
    return user_dict

user_org2int, user_int2org, course_org2int, course_int2org, n_users, n_courses, n_relations, n_entities = get_mapping(
    'api/course_recommendation/datasets/mooccubex/user_list.txt',
    'api/course_recommendation/datasets/mooccubex/item_list.txt',
    'api/course_recommendation/datasets/mooccubex/kg_final.txt'
)

train_user_dict = load_user_dict('api/course_recommendation/datasets/mooccubex/train.txt')

# Init model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_bprmf(pretrained, n_users, n_courses, device='cpu'):
    params = dotsi.Dict({
        'use_pretrain': 0,
        'embed_dim': 64,
        'l2loss_lambda': 1e-5,
        'lr': 0.0001
    })

    model = BPRMF(params, n_users, n_courses)
    model = load_model(model, pretrained)
    model.to(device)

    return model

def load_kgat(pretrained, n_users, n_entities, n_relations, device='cpu'):
    params = dotsi.Dict({
        'use_pretrain': 2,
        'embed_dim': 64,
        'relation_dim': 64,
        'laplacian_type': 'random-walk',
        'aggregation_type': 'bi-interaction',
        'conv_dim_list': '[64, 32, 16]',
        'mess_dropout': '[0.1, 0.1, 0.1]',
        'kg_l2loss_lambda': 1e-5,
        'cf_l2loss_lambda': 1e-5,
        'lr': 0.0001,
    })

    model = KGAT(params, n_users, n_entities, n_relations)
    model = load_model(model, pretrained)
    model.to(device)

    return model

def load_fm(pretrained, n_users, n_courses, n_entities, device='cpu'):
    params = dotsi.Dict({
        'model_type': 'fm',
        'use_pretrain': 2,
        'embed_dim': 64,
        'hidden_dim_list': '[64, 32, 16]',
        'mess_dropout': '[0.1, 0.1, 0.1]',
        'l2loss_lambda': 1e-5,
        'lr': 0.0001,
    })

    model = NFM(params, n_users, n_courses, n_entities)
    model = load_model(model, pretrained)
    model.to(device)

    return model

kgat = load_bprmf(
    'api/course_recommendation/pretrained_models/BPRMF_epoch40.pth',
    n_users, n_courses, device)

bprmf = load_kgat(
    'api/course_recommendation/pretrained_models/KGAT_epoch45.pth', 
    n_users, n_entities, n_relations, device)

# Recommend
def recommend(user_ids: list, model_type: str = 'kgat', top_k: int = 5, batch_size: int =200):
    # Convert org id to int
    user_ids = [user_org2int[user_id] for user_id in user_ids]

    # Predict cf_scores
    user_ids_batches = [user_ids[i: i + batch_size] for i in range(0, len(user_ids), batch_size)]
    user_ids_batches = [torch.LongTensor(d) for d in user_ids_batches]

    course_ids = torch.arange(n_courses, dtype=torch.long).to(device)

    cf_scores = []

    with tqdm(total=len(user_ids_batches), desc='Recommending Iteration') as pbar:
        for batch_user_ids in user_ids_batches:
            batch_user_ids = batch_user_ids.to(device)

            with torch.no_grad():
                if model_type == 'bprmf':
                    batch_scores = bprmf(batch_user_ids, course_ids, mode='predict')       # (n_batch_users, n_items)
                elif model_type == 'kgat':
                    batch_scores = kgat(batch_user_ids, course_ids, is_train=False)
                else:
                    raise 'model type invalid'
            batch_scores = batch_scores.cpu()
            cf_scores.append(batch_scores.numpy())
            pbar.update(1)

    cf_scores = np.concatenate(cf_scores, axis=0)
    
    # Ranking and recommend top k
    for idx, user_id in enumerate(user_ids):
        cf_scores[idx, train_user_dict[user_id]] = -np.inf
    
    top_courses_mat = np.argsort(-cf_scores)[:, :top_k]
    cvt_top_courses_mat = [list(map(lambda x: course_int2org[x], row)) for row in top_courses_mat]

    return cvt_top_courses_mat