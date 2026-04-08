from pydantic import BaseModel,EmailStr,Field
from typing import Optional

class UniversityBase(BaseModel):
    name:str=Field(...,min_length=2,max_length=100)
    country:Optional[str]=None
    min_gpa:float=Field(...,ge=0.0,le=10.0)
    avg_gre:int=Field(...,ge=260,le=340)
    avg_toefl:int=Field(...,ge=0,le=120)
    course:str=Field
    tuition_fee:int=Field(...,ge=0,le=1000000)
    ranking:int=Field(...,int=1,le=1200)

class UniversityUpdate(BaseModel):
    country:Optional[str]=None
    min_gpa:float=Field(...,ge=0.0,le=10.0)
    avg_gre:int=Field(...,ge=260,le=340)
    avg_toefl:int=Field(...,ge=0,le=120)
    course:str=Field
    tuition_fee:int=Field(...,ge=0,le=100000)

class UniversityResponse(BaseModel):
    id:int=Field()

class UniversityCreate(BaseModel):
    name:str
    country:str
    min_gpa:float
    avg_gre:int
    avg_toefl:int
    course:str
    tuition_fee:float
    ranking:int



