from app.db.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Float

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True)
    gpa = Column(Float)
    gre = Column(Integer)
    toefl=Column(Integer)

    preferred_country=Column(String)
    Budget=Column(Integer)

    user=relationship("User")