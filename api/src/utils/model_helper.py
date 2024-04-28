import os
from collections import OrderedDict

from src.data_loader.loader_bprmf import DataLoaderBPRMF
from src.utils.log_helper import *
from src.model.BPRMF import BPRMF

import torch


def early_stopping(recall_list, stopping_steps):
    best_recall = max(recall_list)
    best_step = recall_list.index(best_recall)
    if len(recall_list) - best_step - 1 >= stopping_steps:
        should_stop = True
    else:
        should_stop = False
    return best_recall, should_stop


def save_model(model, model_dir, current_epoch, last_best_epoch=None):
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    model_state_file = os.path.join(model_dir, 'model_epoch{}.pth'.format(current_epoch))
    torch.save({'model_state_dict': model.state_dict(), 'epoch': current_epoch}, model_state_file)

    if last_best_epoch is not None and current_epoch != last_best_epoch:
        old_model_state_file = os.path.join(model_dir, 'model_epoch{}.pth'.format(last_best_epoch))
        if os.path.exists(old_model_state_file):
            os.system('rm {}'.format(old_model_state_file))


def load_model(model, model_path):
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    return model

def model_load_for_web(args):
    # GPU / CPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # load data
    data = DataLoaderBPRMF(args, logging)
    
    model = BPRMF(args, data.n_users, data.n_items)
    model = load_model(model, args.pretrain_model_path)
    model.to(device)
    print("model loaded", model)
    return model, data, device


