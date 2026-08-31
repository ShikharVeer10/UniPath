from sqlalchemy.ext.asyncio import AsyncSession
from app.models.evaluation import EvaluationRecord
from app.schemas.evaluation import EvaluationRequest
from app.schemas.output_schema import StudentEvaluationInput
from app.services.profile_matcher_service import profile_matcher_service

async def process_and_save_evaluation(db: AsyncSession, payload: EvaluationRequest) -> EvaluationRecord:
    # Convert to the input format expected by profile_matcher_service
    student_data = StudentEvaluationInput(
        target_country=payload.target_country,
        target_program=payload.target_program,
        cgpa=payload.cgpa,
        gre_score=payload.gre_score,
        toefl_score=payload.toefl_score,
        research_papers=payload.research_papers,
        work_experience_months=payload.work_experience_months,
    )

    # Get real evaluation from the AI profile matcher (with fallback)
    result = await profile_matcher_service.evaluate_student_profile(db, student_data)

    db_record = EvaluationRecord(
        target_country=payload.target_country,
        target_program=payload.target_program,
        cgpa=payload.cgpa,
        gre_score=payload.gre_score,
        toefl_score=payload.toefl_score,
        research_papers=payload.research_papers,
        work_experience_months=payload.work_experience_months,
        profile_summary=result.profile_summary,
        key_strengths=result.key_strengths,
        areas_for_improvement=result.areas_for_improvement,
        recommendations=[rec.model_dump() for rec in result.recommendations],
    )

    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)
    return db_record
