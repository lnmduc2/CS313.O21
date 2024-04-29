from .database import Base, engine
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table
from sqlalchemy.orm import relationship

User = Base.classes.users
Course = Base.classes.courses
Video = Base.classes.videos
Exercise = Base.classes.exercises
Field = Base.classes.fields
Concept = Base.classes.concepts
Teacher = Base.classes.teachers
School = Base.classes.schools

UserCourse = Base.classes.user_courses
# CourseField = Base.classes.course_fields
# CourseConcept = Base.classes.course_concepts
# CourseTeacher = Base.classes.course_teachers
# CourseSchool = Base.classes.course_schools
