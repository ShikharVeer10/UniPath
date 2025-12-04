from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from app.schemas import PredictionResult

prediction_agent = Agent(
    name="Admission Predictor",
    model=GroqModel("llama-3.3-70b-versatile"),
    output_type=PredictionResult,
    system_prompt=(
        """Given a user's profile, predict the probability of admission.
        Respond ONLY with JSON matching this schema:
        {school_name, probability, missing_skills, missing_projects,
        missing_research_papers, prompt}.
        Each key must be present. Use 0, [] or null where appropriate.
        Do not add explanations. Return ONLY valid JSON."""
    )
)
