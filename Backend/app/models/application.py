from app.utils.terms import calculate_target_term
from sqlmodel import SQLModel,Field,Relationship
from typing import Optional
from datetime import datetime

class ApplicationTracker(SQLModel,table=True):
    __tablename__="application_trackers"

    id:Optional[int]=Field(default=None,primary_key=True)
    user_identifier:str=Field(index=True)
    university_id:int=Field(foreign_key="universities.id")
    status:str=Field(default="Shortlisted")
    target_term:str=Field(default_factory=calculate_target_term)
    deadline:Optional[str]=Field(default=None)
    notes:Optional[str]=Field(default=None)
    created_at:datetime=Field(default_factory=datetime.utcnow)