from app.models.evaluation import EvaluationRecord
from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.evaluation import EvaluationRequest,EvaluationResponse
from app.services.evaluation_service import process_and_save_evaluation

router=APIRouter(prefix="/evaluations", tags=["evaluations"])

@router.post("/", response_model=EvaluationResponse)
async def evaluate_profile(payload: EvaluationRequest, db: AsyncSession=Depends(get_db)):
    record=await process_and_save_evaluation(db,payload)
    return record

@router.get("/history",response_model=List[EvaluationResponse])
async def get_evaluation_history(db:AsyncSession=Depends(get_db)):
    from sqlalchemy import select
    result=await db.execute(select(EvaluationRecord).order_by(EvaluationRecord.created_at.desc()))
    return result.scalars().all()