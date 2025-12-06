from pydantic_ai import Agent
from pydantic_ai.models.groq import GroqModel
from BACKEND.app.schemas.auth_schema import UserProfile

profile_agent = Agent(
    name="Profile Normalizer",
    model=GroqModel("llama-3.3-70b-versatile"),
    output_type=UserProfile,
    system_prompt=(
        """Normalize and enrich the user profile by filling in missing details
        and structuring dynamic features such as skills, education, and experience.
        Respond ONLY with a JSON object that matches this schema:
        {name, email, GRE, CGPA, Work_Experience, Number_of_Internships,
        Number_of_projects, Research_Papers, Resume_text, dynamic_features, prompt}.
        Use null or 0 where information is missing. No extra text, ONLY valid JSON."""
    )
)
 