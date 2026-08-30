from pydantic import BaseModel,EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email:EmailStr
    password:str
    full_name:str

class UserResponse(BaseModel):
    id:str
    email:str
    full_name:str

    class config:
        from_attributes=True

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    email:Optional[str]=None