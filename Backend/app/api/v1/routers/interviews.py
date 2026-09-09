from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

from app.services.interview_prompt import generate_interview_interrogator_prompt

router = APIRouter(prefix="/interviews", tags=["AI Mock Interview"])

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

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
    system_prompt = generate_interview_interrogator_prompt(
        candidate_name=payload.candidate_name,
        major=payload.major,
        target_university=payload.target_university,
        resume_summary=payload.resume_summary,
        sop_summary=payload.sop_summary
    )

    try:
        response = client.chat.completions.create(
            model="llama3.1", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Hello, I am ready for my interview."}
            ],
            temperature=0.4
        )
        
        message_content = response.choices[0].message.content
        return InterviewResponse(interviewer_message=message_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start local interview agent: {str(e)}")

@router.post("/message", response_model=InterviewResponse)
async def continue_interview(payload: InterviewMessageRequest):
    try:
        response = client.chat.completions.create(
            model="llama3.1",
            messages=payload.chat_history,
            temperature=0.4
        )
        
        message_content = response.choices[0].message.content
        return InterviewResponse(interviewer_message=message_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process interview response: {str(e)}")