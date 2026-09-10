from fastapi import APIRouter
from pydantic import BaseModel
from app.services.interview_service import interview_service

router = APIRouter(prefix="/interviews", tags=["AI Mock Interview"])

class InterviewInitRequest(BaseModel):
    candidate_name: str
    major: str
    target_university: str
    resume_summary: str
    sop_summary: str

class InterviewMessageRequest(BaseModel):
    session_id: str
    chat_history: list[dict]  

class InterviewResponse(BaseModel):
    interviewer_message: str

@router.post("/start", response_model=InterviewResponse)
async def start_interview(payload: InterviewInitRequest):
    message = await interview_service.start_interview_session(
        candidate_name=payload.candidate_name,
        major=payload.major,
        target_university=payload.target_university,
        resume_summary=payload.resume_summary,
        sop_summary=payload.sop_summary,
    )
    return InterviewResponse(interviewer_message=message)

@router.post("/message", response_model=InterviewResponse)
async def continue_interview(payload: InterviewMessageRequest):
    message = await interview_service.process_candidate_response(
        session_id=payload.session_id,
        chat_history=payload.chat_history,
    )
    return InterviewResponse(interviewer_message=message)

class InterviewScheduleRequest(BaseModel):
    recipient_email: str
    candidate_name: str
    target_university: str
    target_program: str
    scheduled_time: str
    client_base_url: str = "http://localhost:3000"

class InterviewScheduleResponse(BaseModel):
    meeting_id: str
    call_url: str
    scheduled_time: str
    recipient_email: str
    status: str
    email_dispatched: bool

@router.post("/schedule", response_model=InterviewScheduleResponse)
async def schedule_interview(payload: InterviewScheduleRequest):
    result = await interview_service.schedule_interview_call(
        recipient_email=payload.recipient_email,
        candidate_name=payload.candidate_name,
        target_university=payload.target_university,
        target_program=payload.target_program,
        scheduled_time=payload.scheduled_time,
        client_base_url=payload.client_base_url,
    )
    return InterviewScheduleResponse(**result)