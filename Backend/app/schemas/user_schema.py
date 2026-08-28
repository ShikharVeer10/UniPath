import uuid
from datetime import datetime
from pydantic import BaseModel,EmailStr

class UserBase(BaseModel):
    email:str
    full_name:str | None=None

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password:str

    model_config = {"extra": "forbid"}

class UserResponse(BaseModel):
    id:uuid.UUID
    is_active:bool
    created_at:datetime
    updated_at:datetime

    model_config={"from_attributes": True}

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"

class TokenPayload(BaseModel):
    sub:str | None=None
    
