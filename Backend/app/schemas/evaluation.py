from pydantic import BaseModel, ConfigDict
from typing import List,Dict,Any,Optional
import datetime

class EvaluationRequest(BaseModel):
    target_country: str
    target_program: str
    cgpa: float
    gre_score: Optional[int] = None
    toefl_score: Optional[int] = None
    research_papers: int = 0
    work_experience_months: int = 0
    detected_strengths: List[str] = []
    detected_challenges: List[str] = []

class EvaluationResponse(EvaluationRequest):
    id:int
    profile_summary:str
    key_strengths:List[str]
    areas_for_improvement:List[str]
    recommendations:List[Dict[str,Any]]
    created_at:datetime.datetime

    model_config = ConfigDict(from_attributes=True)
