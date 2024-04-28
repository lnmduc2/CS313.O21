import os
import sys
import random
from time import time

import pandas as pd
from tqdm import tqdm
import torch.nn as nn
import torch.optim as optim

from src.data_loader.loader_bprmf import DataLoaderBPRMF
from src.model.BPRMF import BPRMF
from src.parser.parser_bprmf import *
from src.utils.log_helper import *
from src.utils.metrics import *
from src.utils.model_helper import *
from src.utils.extract_course import extract_course
from src.utils.extract_course_info import extract_course_info


class BPRMFPipeline:

    def __call__(self, args, user_ids, model, data, device):
        # predict
        Ks = eval(args.Ks)
        
        cf_scores = self.evaluate(model, data, Ks, device, user_ids)
        
        # Kiểm tra user có đăng kí khóa học chưa, nếu rồi thì gán khóa học đó là -999 (tránh khuyến nghị các khóa học đã học rồi)
        user_course_dict = np.load("src\\datasets\\user_enroll_course.npy", allow_pickle=True).item()
        
        for i in range(0, len(user_ids)):
            for course_ids in user_course_dict[user_ids[i]]:
                cf_scores[i, course_ids] = -np.inf
        
        top_5_values_per_row = []
        top_5_indices_per_row = []
        
        for cf_score in cf_scores:
            indices_descending = np.argsort(-cf_score)
            
            top_5_values = cf_score[indices_descending[:5]]
            top_5_indices = np.array(indices_descending[:5])
            
            top_5_values_per_row.append(top_5_values)
            top_5_indices_per_row.append(top_5_indices)
        
        top_5_courses = extract_course(top_5_indices_per_row)
        top_5_courses = extract_course_info(top_5_courses, user_ids)
        return top_5_courses
    
    def evaluate(self, model, dataloader, Ks, device, user_ids):
        test_batch_size = dataloader.test_batch_size
    
        model.eval()
    
        user_ids_batches = [user_ids[i: i + test_batch_size] for i in range(0, len(user_ids), test_batch_size)]
        user_ids_batches = [torch.LongTensor(d) for d in user_ids_batches]
        
        n_items = dataloader.n_items
        item_ids = torch.arange(n_items, dtype=torch.long).to(device)
    
        cf_scores = []
    
        with tqdm(total=len(user_ids_batches), desc='Evaluating Iteration') as pbar:
            for batch_user_ids in user_ids_batches:
                batch_user_ids = batch_user_ids.to(device)
    
                with torch.no_grad():
                    batch_scores = model(batch_user_ids, item_ids, is_train=False)       # (n_batch_users, n_items)
    
                batch_scores = batch_scores.cpu()
                cf_scores.append(batch_scores.numpy())
                pbar.update(1)
    
        cf_scores = np.concatenate(cf_scores, axis=0)
        return cf_scores

if __name__ == '__main__':
    args = parse_bprmf_args()
    
    args.data_dir = "src\\datasets"
    args.data_name = "mooccube"
    args.use_pretrain = 2
    args.Ks = '[1, 5, 10]'
    args.pretrain_model_path = 'src\\pretrained_model\\model_epoch40 (2).pth'
    
    print(args)
    user_ids = np.array([0, 7, 8, 105], dtype=np.int16)
    
    pipeline = BPRMFPipeline()
    top_5_courses, user_ids = pipeline(args, user_ids)
    print(top_5_courses)
        
        