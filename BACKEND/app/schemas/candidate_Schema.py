
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CandidateCreate(BaseModel):
    """Fields required when creating a new candidate."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_text: Optional[str] = None


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    resume_text: Optional[str] = None


class CandidateOut(BaseModel):
    """Fields returned when sending candidate data back to client."""
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    resume_text: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
