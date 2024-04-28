import pandas as pd

def extract_course(remap_list):
    df = pd.read_csv('src\\datasets\\database\\item_list.txt', sep=' ')
    
    org_ids = []
    for i in range(len(remap_list)):
        # print(f"f{i} -------- ", remap_list[i])
        org_ids.append(df[df['remap_id'].isin(remap_list[i])]['org_id'].to_list())
    return org_ids
