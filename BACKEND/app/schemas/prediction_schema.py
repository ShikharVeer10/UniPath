from pydantic import BaseModel,Field
from typing import Optional,Dict,Any # # Dict/Any used for raw LLM JSON output

class ApplicantCreate(BaseModel):
    name:str=Field(...,example="John")
    cgpa:float=Field(...,ge=0.0,le=10.0) #CGPA to be between 0 to 10
    test_score:Optional[float]=Field(None,ge=0.0)
    target_college:Optional[str]=None #College they want to apply to
    major:Optional[str]=None #Major they intend to pursue
    resume_text:Optional[str]=None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Alice",
                "cgpa": 9.1,
                "test_score": 320,
                "target_college": "MIT",
                "major": "Computer Science",
                "resume_text": "2 NLP projects + internship experience"
            }
        }


class PredictionCreate(BaseModel):
    """Schema for creating a prediction/application record"""
    user_id: Optional[int] = None
    name: str
    cgpa: float
    test_score: Optional[float] = None
    target_college: Optional[str] = None
    major: Optional[str] = None
    resume_text: Optional[str] = None
    admission_chance: float
    reasoning: str


class PredictionResponse(BaseModel):
    admission_chance: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    raw_prediction: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True


class ApplicationOut(BaseModel):
    id: int
    name: str
    cgpa: float
    test_score: Optional[float] = None
    target_college: Optional[str] = None
    major: Optional[str] = None
    admission_chance: Optional[float] = None
    reasoning: Optional[str] = None
    created_at: Optional[str] = None  

    class Config:
        from_attributes = True
