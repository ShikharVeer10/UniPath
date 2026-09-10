from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.services.interview_service import interview_service

router = APIRouter(prefix="/interviews", tags=["AI Mock Interview"])

class TranscriptMessage(BaseModel):
    role: str
    content: str

class InterviewEvaluationRequest(BaseModel):
    target_university: str
    target_program: str
    transcript: list[TranscriptMessage]

class InterviewEvaluationResponse(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    technical_depth_feedback: str
    articulation_feedback: str
    actionable_improvements: list[str]

@router.post("/evaluate", response_model=InterviewEvaluationResponse)
async def evaluate_interview_session(payload: InterviewEvaluationRequest):
    result = await interview_service.evaluate_interview_session(
        target_university=payload.target_university,
        target_program=payload.target_program,
        transcript=[m.model_dump() for m in payload.transcript],
    )
    return InterviewEvaluationResponse(**result)