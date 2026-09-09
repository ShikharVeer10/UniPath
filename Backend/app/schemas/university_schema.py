import uuid
from datetime import datetime
from pydantic import BaseModel

class UniversityBase(BaseModel): # Defines the baseline and institutional datatypes
    name:str
    country:str
    ranking:int | None=None
    tuition:float| None=None

class UniversityCreate(UniversityBase):
    pass

class UniversityResponse(UniversityBase):
    id:uuid.UUID
    created_at:datetime
    updated_at:datetime

    model_config={"from_attributes": True}

class HistoricalProfileBase(BaseModel):
    program_name:str
    cgpa:float
    gre_score:int | None=None
    toefl_score:int | None=None
    ielts_score:int | None=None
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

class ProgramApplicantStats(BaseModel):
    program_name: str
    total_applicants: int
    admitted_count: int
    acceptance_rate: float
    international_students_count: int
    avg_cgpa: float
    avg_gre: float | None = None

class UniversityProgramStatsResponse(BaseModel):
    university_id: uuid.UUID
    university_name: str
    programs: list[ProgramApplicantStats]

class AcceptancePredictionRequest(BaseModel):
    program_name: str
    cgpa: float
    gre_score: int | None = None
    toefl_score: int | None = None
    research_papers: int = 0
    work_experience_months: int = 0

class AcceptancePredictionResponse(BaseModel):
    university_id: uuid.UUID
    university_name: str
    program_name: str
    category: str
    acceptance_probability: float
    rationale: str
    historical_matches_analyzed: int