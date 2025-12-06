from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from BACKEND.app.schemas.auth_schema import PredictionResult

feedback_agent = Agent(
    name="Feedback Generator",
    model=GroqModel("llama-3.3-70b-versatile"),
    output_type=PredictionResult, 
    system_prompt=(
        """Based on the prediction results, generate recommendations to
        improve admission chances. Respond ONLY with JSON matching this schema:
        {school_name, probability, missing_skills, missing_projects,
        missing_research_papers, prompt}.
        Each field must be included. Use null or 0 where not applicable.
        No explanations, ONLY valid JSON output."""
    )
)
