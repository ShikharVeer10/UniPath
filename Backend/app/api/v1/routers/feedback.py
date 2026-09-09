from fastapi import APIRouter, HTTPException
from pydantic import BaseModel,Field
from openai import OpenAI

from app.services.feedback_prompt import generate_application_feedback_prompt

router=APIRouter(prefix="/feedback", tags=["AI Feedback Agent"])

client=OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

class FeedBackRequest(BaseModel):
    candidate_name:str
    target_university:str
    target_program:str
    cgpa:float=Field(...,ge=0.0,le=10.0)
    gre_score:int=Field(...,ge=260,le=340)
    resume_summary:str
    sop_summary:str

class ResponseFeedBack(BaseModel):
    comprehensive_feedback:str

@router.post("/analyze", response_model=ResponseFeedBack)
async def generate_feedback(payload:FeedBackRequest):
    system_prompt=generate_application_feedback_prompt(
        candidate_name=payload.candidate_name,
        target_university=payload.target_university,
        target_program=payload.target_program,
        cgpa=payload.cgpa,
        gre_score=payload.gre_score,
        resume_summary=payload.resume_summary,
        sop_summary=payload.sop_summary
    )

    try:
        response=client.chat.completions.create(
            model="llama3.1",
            messages=[
                {"role":"system","content":system_prompt},
                {"role":"user","content":"Please generate any comprehensive application feedback and project roadmap"}
            ],
            temperature=0.3
        )

        feedback_text=response.choices[0].message.content
        return ResponseFeedBack(comprehensive_feedback=feedback_text)

    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Failed to generate application feedback agent response: {str(e)}")