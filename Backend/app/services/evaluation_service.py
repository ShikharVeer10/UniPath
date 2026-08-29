from sqlalchemy.ext.asyncio import AsyncSession
from app.models.evaluation import EvaluationRecord
from app.schemas.evaluation import EvaluationRequest

async def process_and_save_evaluation(db:AsyncSession,payload:EvaluationRequest)-> EvaluationRecord:
    summary=f"Strong candidate profile targeting {payload.target_program} in {payload.target_country} with a CGPA of {payload.cgpa}."
    strengths=["Solid academic foundation", "Relevant technical background"]
    improvements=["Add more research publications", "Boost standardized test scores"]
    recommendations=[{"university": "Target University A", "fit": "High"}]

    db_record=EvaluationRecord(
        target_country=payload.target_country,
        target_program=payload.target_program,
        cgpa=payload.cgpa,
        gre_score=payload.gre_score,
        toefl_score=payload.toefl_score,
        research_papers=payload.research_papers,
        work_experience_months=payload.work_experience_months,
        profile_summary=summary,
        key_strengths=strengths,
        areas_for_improvement=improvements,
        recommendations=recommendations,
    )

    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)
    return db_record
