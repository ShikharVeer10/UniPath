from app.db.base import Base
from sqlalchemy import Column,Integer,String,Float

class university(Base):
    id=Column(Integer,primary_key=True,index=True)
    Country=Column(String)
    Min_gpa=Column(Float)
    Avg_GRE=Column(Integer)
    Avg_Toefl=Column(Integer)
    Avg_IELTS=Column(Float)
    Course=Column(String)
    Tuition_Fee=Column(Integer)
    Ranking=Column(Integer)