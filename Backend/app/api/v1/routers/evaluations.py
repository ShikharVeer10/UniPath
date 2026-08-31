from app.models.evaluation import EvaluationRecord
from app.models.user_model import User
from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.api.v1.routers.auth import get_current_user
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
from app.services.evaluation_service import process_and_save_evaluation

router = APIRouter(prefix="/evaluations", tags=["evaluations"])

@router.post("/", response_model=EvaluationResponse)
async def evaluate_profile(payload: EvaluationRequest, db: AsyncSession = Depends(get_db)):
    record = await process_and_save_evaluation(db, payload)
    return record

@router.get("/history", response_model=List[EvaluationResponse])
async def get_evaluation_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(EvaluationRecord)
        .order_by(EvaluationRecord.created_at.desc())
    )
    return result.scalars().all()