from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = automap_base()

# engine, suppose it has two tables 'user' and 'address' set up
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/mooccubex")

# reflect the tables
Base.prepare(autoload_with=engine)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)