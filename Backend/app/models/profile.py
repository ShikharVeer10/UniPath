from app.db.base import Base
from sqlalchemy import Column, Integer, Float

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True)
    gpa = Column(Float)
    gre = Column(Integer)