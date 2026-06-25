from app.db.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func


class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(Integer, primary_key=True)
    gpa = Column(Float)
    gre = Column(Integer)
    toefl=Column(Integer)

    preferred_country=Column(String)
    Budget=Column(Integer)

    user=relationship("User")