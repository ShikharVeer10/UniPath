from typing import Literal 
from pydantic import BaseModel,Field

class StudentEvaluationInput(BaseModel):
    target_country:str=Field(...,description="Destination Country")
    target_program:str=Field(...,description="Target Program")
    cgpa:float=Field(...,ge=0.0,le=10.0,description="GPA on a 10.0 scale")
    gre_score:int | None=Field(None,ge=260,le=340,description="GRE Score")
    toefl_score: int | None = Field(None, ge=0, le=120, description="TOEFL/IELTS equivalent")
    research_papers: int = Field(0, ge=0, description="Number of published research papers")
    work_experience_months: int = Field(0, ge=0, description="Work/Internship experience in months")

class CategorizedUniversity(BaseModel):
    university_name: str
    category: Literal["Ambitious", "Target", "Safe"]
    acceptance_probability: float = Field(..., ge=0.0, le=1.0)
    rationale: str

class ProfileEvaluationResult(BaseModel):
    profile_summary: str
    key_strengths: list[str]
    areas_for_improvement: list[str]
    recommendations: list[CategorizedUniversity]