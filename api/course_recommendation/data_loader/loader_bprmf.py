import torch
import numpy as np
import pandas as pd

from src.data_loader.loader_base import DataLoaderBase


class DataLoaderBPRMF(DataLoaderBase):

    def __init__(self, args, logging = None):
        super().__init__(args, logging)
        self.train_batch_size = args.train_batch_size
        self.test_batch_size = args.test_batch_size


