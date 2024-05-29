from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from .course_recommendation import course_recommender
from fastapi.middleware.cors import CORSMiddleware

from . import crud, schemas
from .database import SessionLocal, engine

app = FastAPI()
# Set up CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependecy
def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

@app.get('/users/') # response_model=schemas.User)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get('/user/name/{username}')
def read_user_by_name(username: str, db: Session = Depends(get_db)):
    return crud.get_user_by_name(db, username)

@app.get('/user/id/{user_id}')
def read_user(user_id: str, detail: bool = False, db: Session = Depends(get_db)):
    return crud.get_user(db, user_id, detail)

@app.get('/course/id/{course_id}')
def read_course(course_id: str, detail: bool = False, db: Session = Depends(get_db)):
    return crud.get_course(db, course_id, detail)

@app.get('/course/popular/')
def read_popular_courses(top_k: int = 5, db: Session = Depends(get_db)):
    return crud.get_popular_courses(db, top_k)    

@app.get('/user/id/{user_id}/best_match_courses')
def read_best_courses_for_user(user_id: str, model_type: str = 'kgat', db: Session = Depends(get_db)):
    courses_mat = course_recommender.recommend([user_id], model_type)

    for i in range(len(courses_mat)):
        for j in range(len(courses_mat[i])):
            course_id = courses_mat[i][j]
            courses_mat[i][j] = crud.get_course(db, course_id, detail=False)
    
    return courses_mat