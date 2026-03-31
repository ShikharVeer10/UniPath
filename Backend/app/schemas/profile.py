from pydantic import BaseModel,EmailStr,Field
from typing import Optional

class ProfileBase(BaseModel):
    name:str=Field(...,min_length=2,max_length=100)
    email:EmailStr #Once signed up with an email cannot change it back
    gpa:float=Field(...,ge=0.0,le=10.0)
    gre:int=Field(...,ge=260,le=340)
    toefl:int=Field(...,ge=0,le=120)
    work_experience:Optional[int]=Field(default=0,ge=0)
    preferred_country:Optional[str]=None
    preferred_course:Optional[str]=None

class ProfileCreate(ProfileBase):
    pass

class UpdateProfile(BaseModel):
    name:Optional[str]=None
    gpa:Optional[float]=Field(...,ge=0.0,le=10.0)
    gre:Optional[int]=Field(...,ge=260,le=340)
    toefl:Optional[int]=Field(...,ge=0,le=120)
    work_experience:Optional[int]=None
    preffered_country:Optional[str]=None
    preferred_course:Optional[str]=None

class ProfileSchema(ProfileBase):
    id:int

    class Config:
        from_attributes=True

    
