from pathlib import Path
from pydantic_ai import Agent
from pydantic_ai.models.ollama import OllamaModel
from pydantic_ai.providers.ollama import OllamaProvider
from app.core.config import settings
from app.schemas.output_schema import StudentEvaluationInput,ProfileEvaluationResult
from app.crud.university_crud import university_crud
from sqlalchemy.ext.asyncio import AsyncSession

PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "evaluation_prompt.md"

def load_system_prompt()->str:
    if PROMPT_PATH.exists():
        return PROMPT_PATH.read_text(encoding="utf-8")
    return "You are an expert graduate admissions evaluator."

evaluator_agent = Agent(
    model=OllamaModel(
        "llama3",
        provider=OllamaProvider(base_url=settings.OLLAMA_BASE_URL),
    ),
    output_type=ProfileEvaluationResult,
    system_prompt=load_system_prompt()
)
class ProfileMatcherService:
    async def evaluate_student_profile(self,db:AsyncSession,student_data:StudentEvaluationInput)->ProfileEvaluationResult:
        universities=await university_crud.get_multi(db,limit=50)
        uni_context=[
            f"- {u.name} ({u.country}), Ranking: {u.ranking}"
            for u in universities
        ]
        context_str = "\n".join(uni_context) if uni_context else "No local university data available."

        user_prompt=f"""
        Applicant Profile:
        - Target Country: {student_data.target_country}
        - Target Program: {student_data.target_program}
        - CGPA: {student_data.cgpa}/10.0
        - GRE: {student_data.gre_score or 'N/A'}
        - TOEFL: {student_data.toefl_score or 'N/A'}
        - Research Papers: {student_data.research_papers}
        - Work Experience: {student_data.work_experience_months} months

        Available Universities in System:
        {context_str}

        Evaluate this profile and return categorized recommendations.
        """

        result=await evaluator_agent.run(user_prompt)
        return result.data

profile_matcher_service=ProfileMatcherService()
