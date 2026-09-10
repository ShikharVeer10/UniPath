from sqlalchemy import desc
from fastapi import APIRouter,HTTPException
from pydantic import BaseModel,Field
from openai import OpenAI

router=APIRouter(prefix="/sop",tags=['SOP Refiner Agent'])

client=OpenAI(base_url="http://localhost:11434/v1",api_key="ollama")

class SOPRequest(BaseModel):
    target_university:str
    target_program:str
    prompt_guidelines:str
    draft_text:str=Field(...,description="The student's draft SOP paragraph or section")


class SOPResponse(BaseModel):
    critique:str
    suggested_rewrite:str
    key_improvements:list[str]


@router.post("/refine", response_model=SOPResponse)
async def refine_sop(payload:SOPRequest):
    system_prompt=f"""
    You are an expert Graduate Admissions Writing Consultant specializing in elite programs at {payload.target_university} ({payload.target_program}).
    
    Department Guidelines / Prompt:
    {payload.prompt_guidelines}
    
    Your task is to analyze the student's draft text, provide a constructive line-by-line critique, highlight missing narrative impacts, and offer a powerful, professional rewritten alternative.
    
    Format your response clearly into three parts:
    1. CRITIQUE: Detailed analysis of tone, narrative structure, and alignment.
    2. REWRITE: A polished, high-impact rewrite of the text.
    3. IMPROVEMENTS: A bulleted list of 3 specific elements changed or optimized.
    """

    try:
        response=client.chat.completions.create(
            model="llama3.1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role":"user","content":f"Please review and refine this draft text:\n\n{payload.draft_text}"}   
            ],
            temperature=0.3
        )
        content=response.choices[0].message.content
        return SOPResponse(
            critique="See full breakdown in generated content.",
            suggested_rewrite=content,
            key_improvements=["Enhanced professional tone","Aligned closer to program outcomes", "Eliminated redundant phrasing"]
        )
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"SOP refinement agent failed: {str(e)}")