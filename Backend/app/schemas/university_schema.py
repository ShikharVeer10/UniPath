import uuid
from datetime import datetime
from pydantic import BaseModel

class UniversityBase(BaseModel): # Defines the baseline and institutional datatypes
    name:str
    country:str
    ranking:int | None=None
    tuition:float| None=None

class UniversityCreate(BaseModel): #When someone wants to register a university
    pass

class UniversityResponse(BaseModel): #Serialize University Database rows into JSON responses
    id:uuid.UUID
    created_at:datetime
    updated_at:datetime

    model_config={"from_attributes": True}

class HistoricalProfileBase(BaseModel):
    program_name:str
    cgpa:float
    gre_score:int | None=None
    Toefl_Score:int | None=None
    IELTS_score:int | None=None
    research_papers:int=0
    admitted:bool

class HistoricalProfileCreate(HistoricalProfileBase):
    university_id:uuid.UUID

class HistoricalProfileResponse(HistoricalProfileBase):
    id:uuid.UUID
    university_id:uuid.UUID
    created_at:datetime
    updated_at:datetime

    model_config={"from_attributes": True}