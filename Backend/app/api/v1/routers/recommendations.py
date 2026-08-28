from fastapi import APIRouter,Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import async_session
from app.schemas.output_schema import StudentEvaluationInput, ProfileEvaluationResult
from app.services.profile_matcher_service import profile_matcher_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

async def get_db():
    async with async_session() as session:
        yield session

@router.post("/evaluate", response_model=ProfileEvaluationResult)
async def evaluate_profile(student_data:StudentEvaluationInput,db:AsyncSession=Depends(get_db)):
    result=await profile_matcher_service.evaluate_student_profile(db,student_data)
    return result