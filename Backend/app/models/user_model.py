from sqlmodel import Field
from app.models.base_model import TimeStampedModel

class User(TimeStampedModel, table=True):
    __tablename__="users"
    email:str=Field(unique=True,index=True,nullable=False)
    hashed_password:str=Field(nullable=False)
    full_name:str | None=Field(default=None)
    is_active:bool=Field(default=True)