from sqlalchemy.orm import Session
from sqlalchemy import func, text
from . import models, schemas

def get_user(db: Session, user_id: str, detail: bool):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    res = {
        'id': user.id,
        'name': user.name,
        'gender': user.gender,
        'year_of_birth': user.year_of_birth,
        'school': user.school
    }
    if detail:
        res['courses'] = []
        for user_course in user.user_courses_collection:
            course = user_course.courses

            course_res = {
                'id': course.id,
                'name': course.name
            }

            course_res['enroll_time'] = user_course.enroll_time
            course_res['schools'] = []

            for school in course.schools_collection:
                course_res['schools'].append(school.name)

            res['courses'].append(course_res)
        res['n_courses'] = len(res['courses'])
    
    return res

def get_user_by_name(db: Session, username: str):
    return db.query(models.User).filter(models.User.name == username).all()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

def get_course(db: Session, course_id: str, detail: bool):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    course_res = {
        'id': course.id,
        'name': course.name
    }

    course_res['schools'] = []
    for school in course.schools_collection:
        course_res['schools'].append(school.name)

    if detail:
        course_res['prerequisites'] = course.prerequisites
        course_res['about'] = course.about
        course_res['n_teachers'] = len(course.teachers_collection)
        course_res['n_fields'] = len(course.fields_collection)
        course_res['n_users'] = len(course.user_courses_collection)
        course_res['n_videos'] = len(course.videos_collection)
        course_res['n_exercises'] = len(course.exercises_collection)

        course_res['teachers'] = [
            {
                'id': teacher.id,
                'name': teacher.name
            }
            for teacher in course.teachers_collection
        ]
        course_res['fields'] = [
            {
                'id': field.id,
                'name': field.name
            }
            for field in course.fields_collection
        ]

        course_res['videos'] = [
            {
                'id': video.id,
                'title': video.title,
                'chapter': video.chapter
            }
            for video in course.videos_collection
        ]
        course_res['exercises'] = [
            {
                'id': ex.id,
                'title': ex.title,
                'chapter': ex.chapter
            }
            for ex in course.exercises_collection
        ]
        
    return course_res

def get_popular_courses(db: Session, top_k = 5):
    cnt_res = db.query(models.UserCourse.course_id, func.count('*').label('count')) \
            .group_by(models.UserCourse.course_id).order_by(text('count desc')).limit(top_k).all()
    
    res = []
    for course_id, cnt in cnt_res:
        course_res = get_course(db, course_id, False)
        course_res['n_users'] = cnt
        res.append(course_res)

    return res