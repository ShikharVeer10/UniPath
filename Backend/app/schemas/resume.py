from sqlalchemy import desc
from typing import Optional
from pydantic import BaseModel,Field

class ParsedResumeProfile(BaseModel):
    cgpa:Optional[float]=Field(None,description="Extracted CGPA or GPA scaled to 10 or 4")
    gre_score:Optional[int]=Field(None,description="Total GRE Score, typically ranging from 260 to 340")
    toefl_score:Optional[int]=Field(None,description="Total TOEFL Score, typically out of 120")
    target_school:Optional[str]=Field(None,description="Intended major or graduate program field")
    research_papers:Optional[int]=Field(0,description="Count of published research papers")
    work_experience_months:Optional[int]=Field(0,description="Total full-time work experience in months")

    