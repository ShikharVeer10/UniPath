from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email:EmailStr
    password:str
    role:Optional[str]="user"

#Fields allowed to be updated
class UserUpdate(BaseModel):
    role:Optional[str]=None
    is_active:Optional[bool]=None

class UserOut(BaseModel):
    id:int
    email:EmailStr
    role:str
    is_active:bool
    created_at:datetime

    class Config:
        from_attributes=True