from pydantic import BaseModel,EmailStr

class SignUpIn(BaseModel):
    email:EmailStr
    password:str

class LogIn(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str="bearer"

class TokenData(BaseModel):
    sub:str | None=None


class UserOut(BaseModel):
    #User data returned after registration or login
    id:int
    email:EmailStr
    role:str
    is_active:bool

    class Config:
        orm_mode=True