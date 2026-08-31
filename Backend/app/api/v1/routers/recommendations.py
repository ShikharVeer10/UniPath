from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.output_schema import StudentEvaluationInput, ProfileEvaluationResult
from app.services.profile_matcher_service import profile_matcher_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.post("/evaluate", response_model=ProfileEvaluationResult)
async def evaluate_profile(student_data: StudentEvaluationInput, db: AsyncSession = Depends(get_db)):
    result = await profile_matcher_service.evaluate_student_profile(db, student_data)
    return result