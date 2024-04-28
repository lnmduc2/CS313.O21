import pandas as pd

def extract_course_info(api_response, user_ids):
    df_course = pd.read_csv('src\\datasets\\course_info_trans.csv')
    
    # course_ids = api_response[0]

    courses_for_user = {}
    
    for i, course_ids in enumerate(api_response):
        courses_info = []    
        for course_id in course_ids:
            course_info = df_course[df_course['id'] == course_id]   
            
            if not course_info.empty:
                info_dict = {
                    'id': course_id,
                    'name': course_info.iloc[0]['name_trans'],
                    'about': course_info.iloc[0]['about_trans']
                }
                courses_info.append(info_dict)
            else:
                courses_info.append({'id': course_id, 'name': None, 'about': None})
        
        courses_for_user[user_ids[i]] = courses_info
    
    return courses_for_user
    
