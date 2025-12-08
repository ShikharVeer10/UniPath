from sqlalchemy import Column,Integer,String,Boolean,DateTime,func,Text
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True,nullable=False)
    password_hash=Column(String,nullable=False)
    role=Column(String,default="user",nullable=False)
    is_active=Column(Boolean,default=True,nullable=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now(),nullable=False)


class Candidate(Base):
    #Stores candidate data
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)

    resume_text = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )