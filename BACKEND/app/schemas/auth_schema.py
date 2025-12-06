from pydantic import BaseModel,EmailStr,Field
from typing import Optional

class UserCreate(BaseModel):
    email:EmailStr
    password:str=Field(...,min_length=6)
    name:Optional[str]=None

class UserOut(BaseModel):
    id:int
    email:EmailStr
    name:Optional[str]=None

#Pydantic reads data from SQLAlchemy model
class Config:
    om=rm_mode=True

class TokenResponse(BaseModel):
    access_token:str #Used for authentic actions
    refresh_token:str #Used to get new access tokens
    token_type:str="bearer" #"bearer" used for standard types of APIs


class RefreshRequest(BaseModel):
    refresh_token:str #refresh token exchanges for a new access token
