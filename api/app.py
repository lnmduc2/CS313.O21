import numpy as np
from src.parser.parser_bprmf import *

from fastapi import FastAPI
from BPRMF_pipeline import BPRMFPipeline
from src.parser.parser_bprmf import *
from src.utils.model_helper import model_load_for_web
import uvicorn

app = FastAPI()

# Loading data, model and device
args = parse_bprmf_args()
args.data_dir = "src\\datasets"
args.data_name = "mooccube"
args.use_pretrain = 2
args.Ks = '[1, 5, 10]'
args.pretrain_model_path = 'src\\pretrained_model\\model_epoch40 (2).pth'
model, data, device = model_load_for_web(args)
# Loading data, model and device
    
@app.post("/predict/")
async def predict():
    pipeline = BPRMFPipeline()
    
    # Nhập user id
    user_ids = np.array([44, 55, 66, 77], dtype=float)
    
    top_5_courses = pipeline(args, user_ids, model, data, device)
  
    return top_5_courses
    
if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
