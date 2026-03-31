from typing import Optional
from pydantic import BaseModel,Field

class PredictionRequest(BaseModel):
    gpa:float=Field(..., ge=0.0,le=10.0)
    gre:int=Field(...,ge=260,le=340)
    toefl:int=Field(...,ge=0,le=120)

class PredictionResponse(BaseModel):
    university:str
    Category:str #Safe/Target/Dream
    score:float #Calculated score/probability

