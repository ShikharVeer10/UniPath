from pathlib import Path
from pydantic_ai import Agent
from pydantic_ai.exceptions import ModelAPIError
from app.core.config import settings
from app.schemas.output_schema import (
    CategorizedUniversity,
    ProfileEvaluationResult,
    StudentEvaluationInput,
)
from app.crud.university_crud import university_crud
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "evaluation_prompt.md"

def load_system_prompt()->str:
    if PROMPT_PATH.exists():
        return PROMPT_PATH.read_text(encoding="utf-8")
    return "You are an expert graduate admissions evaluator."

evaluator_agent = Agent(
    model=OpenAIChatModel(
        "qwen2.5",
        provider=OpenAIProvider(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama"  
        ),
    ),
    output_type=ProfileEvaluationResult,
    system_prompt=load_system_prompt()
)
class ProfileMatcherService:
    @staticmethod
    def _clamp_probability(value: float) -> float:
        return max(0.05, min(0.95, value))

    @staticmethod
    def _category_from_probability(probability: float) -> str:
        if probability >= 0.65:
            return "Safe"
        if probability >= 0.4:
            return "Target"
        return "Ambitious"

    def _build_fallback_result(
        self,
        student_data: StudentEvaluationInput,
        ranked_universities: list,
    ) -> ProfileEvaluationResult:
        gre_component = (
            (student_data.gre_score - 260) / 80 if student_data.gre_score is not None else 0.5
        )
        toefl_component = (
            student_data.toefl_score / 120 if student_data.toefl_score is not None else 0.5
        )
        research_component = min(student_data.research_papers, 3) / 3

        base_score = (
            (student_data.cgpa / 10) * 0.5
            + gre_component * 0.3
            + toefl_component * 0.15
            + research_component * 0.05
        )

        recommendations: list[CategorizedUniversity] = []
        for university in ranked_universities:
            rank = university.ranking if university.ranking is not None else 400
            rank_penalty = min(max(rank, 1), 500) / 1000
            probability = self._clamp_probability(base_score - rank_penalty + 0.25)
            category = self._category_from_probability(probability)
            recommendations.append(
                CategorizedUniversity(
                    university_name=university.name,
                    category=category,
                    acceptance_probability=round(probability, 2),
                    rationale=(
                        f"Estimated using your scores and {university.name}'s ranking profile "
                        "because AI model inference is unavailable."
                    ),
                )
            )

        if not recommendations:
            recommendations.append(
                CategorizedUniversity(
                    university_name="No universities found in database",
                    category="Ambitious",
                    acceptance_probability=0.1,
                    rationale=(
                        "No university records exist for your selected filters. "
                        "Add universities to improve recommendation quality."
                    ),
                )
            )

        return ProfileEvaluationResult(
            profile_summary=(
                "Generated using deterministic scoring because AI model inference failed "
                "or is not available in the current environment."
            ),
            key_strengths=[
                "Profile parsed successfully",
                "Score normalization completed across CGPA, GRE, TOEFL, and research",
            ],
            areas_for_improvement=[
                "Configure a working AI model endpoint for richer narrative recommendations",
                "Expand university dataset for more accurate matching",
            ],
            recommendations=recommendations,
        )

    async def evaluate_student_profile(self,db:AsyncSession,student_data:StudentEvaluationInput)->ProfileEvaluationResult:
        universities=await university_crud.get_multi(db,limit=50)
        country_filtered = [
            u for u in universities if u.country.lower() == student_data.target_country.lower()
        ]
        ranked_universities = sorted(
            country_filtered or universities,
            key=lambda u: u.ranking if u.ranking is not None else 9999,
        )[:8]

        uni_context=[
            f"- {u.name} ({u.country}), Ranking: {u.ranking}"
            for u in ranked_universities
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

        try:
            result=await evaluator_agent.run(user_prompt)
            return result.data
        except ModelAPIError:
            return self._build_fallback_result(student_data, ranked_universities)

profile_matcher_service=ProfileMatcherService()
