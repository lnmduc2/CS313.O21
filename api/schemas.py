from pydantic import BaseModel
from pydantic.utils import GetterDict
from typing import Annotated, List, Any
from datetime import date, datetime, time, timedelta

## ============= Base =================
class UserBase(BaseModel):
    id: str
    name: str | None
    gender: int | None
    school: str | None
    year_of_birth: int | None

    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    id: str
    name: str | None
    about: str | None
    prerequisites: str | None
    
    class Config:
        orm_mode = True

class VideoBase(BaseModel):
    id: str
    title: str | None
    chapter: str | None

    class Config:
        orm_mode = True

class ExerciseBase(BaseModel):
    id: str
    title: str | None
    chapter: str | None

    class Config:
        orm_mode = True

class FieldBase(BaseModel):
    id: str
    name: str | None

    class Config:
        orm_mode = True

class ConceptBase(BaseModel):
    id: str
    name: str | None

    class Config:
        orm_mode = True

class TeacherBase(BaseModel):
    id: str
    name: str | None
    name_en: str | None
    about: str | None
    job_title: str | None
    org_name: str | None

    class Config:
        orm_mode = True

class SchoolBase(BaseModel):
    id: str | None
    name: str | None
    name_en: str | None
    sign: str | None
    about: str | None
    motto: str | None

    class Config:
        orm_mode = True

## ============= GetterDict
class CourseUserGetter(GetterDict):
    def get(self, key: str, default: Any = None) -> Any:
        if key in {'id', 'name', 'gender', 'school', 'year_of_birth'}:
            return getattr(self._obj.user, key)
        else:
            return super(CourseUserGetter, self).get(key, default)

class CourseUser(UserBase):
    enroll_time: datetime | None

    class Config:
        orm_mode = True
        getter_dict = CourseUserGetter

class UserCourseGetter(GetterDict):
    def get(self, key: str, default: Any = None) -> Any:
        if key in {'id', 'name', 'about', 'prerequisites'}:
            return getattr(self._obj.course, key)
        else:
            return super(UserCourseGetter, self).get(key, default)
        
class UserCourse(BaseModel):
    course_id: str
    enroll_time: datetime | None

    class Config:
        orm_mode = True
        getter_dict = UserCourseGetter

## ============= Schema ================
class User(UserBase):
    user_courses_collection: List[UserCourse]

class Course(CourseBase):
    users: List[CourseUser]
    videos: List[VideoBase]
    exs: List[ExerciseBase]
    fields: List[FieldBase]
    concepts: List[ConceptBase]
    teachers: List[TeacherBase]
    schools: List[SchoolBase]

class Video(VideoBase):
    course_id: str | None

class Exercise(ExerciseBase):
    course_id: str | None

class Field(FieldBase):
    courses: List[CourseBase]

class Concept(ConceptBase):
    courses: List[CourseBase]

class Teacher(TeacherBase):
    courses: List[CourseBase]

class School(SchoolBase):
    courses: List[CourseBase]