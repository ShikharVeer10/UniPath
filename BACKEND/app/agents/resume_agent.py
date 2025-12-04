from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from app.schemas import UserProfile

resume_agent = Agent(
    name="Resume Parser",
    model=GroqModel("llama-3.3-70b-versatile"),
    output_type=UserProfile,
    system_prompt=(
        """Extract candidate details from the given resume text.
        Respond ONLY with a valid JSON object that matches this schema:
        {name, email, GRE, CGPA, Work_Experience, Number_of_Internships,
        Number_of_projects, Research_Papers, Resume_text, dynamic_features, prompt}.
        If information is missing, set the value to null or 0.
        Do not add explanations or commentary. Return ONLY valid JSON."""
    )
)
