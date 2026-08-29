import datetime
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from sqlmodel import SQLModel, Field
from typing import Optional, List, Dict, Any

class EvaluationRecord(SQLModel, table=True):
    __tablename__ = "evaluation_records"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    target_country: str = Field(nullable=False)
    target_program: str = Field(nullable=False)
    cgpa: float = Field(nullable=False)
    gre_score: Optional[int] = Field(default=None)
    toefl_score: Optional[int] = Field(default=None)
    research_papers: int = Field(default=0)
    work_experience_months: int = Field(default=0)
    profile_summary: str = Field(nullable=False)
    key_strengths: List[str] = Field(sa_column=Column(JSON, nullable=False))
    areas_for_improvement: List[str] = Field(sa_column=Column(JSON, nullable=False))
    recommendations: List[Dict[str, Any]] = Field(sa_column=Column(JSON, nullable=False))
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)