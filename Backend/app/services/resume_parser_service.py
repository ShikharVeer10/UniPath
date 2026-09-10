import io
import re
from pypdf import PdfReader
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from app.core.config import settings

class ParsedResumeData(BaseModel):
    target_program: str = Field(default="Computer Science", description="Inferred target master's program based on education and skills")
    target_country: str = Field(default="United States", description="Preferred country if mentioned, otherwise United States")
    cgpa: float = Field(default=8.0, description="Undergraduate CGPA normalized on a 10.0 scale (e.g. 3.6/4.0 -> 9.0, 82% -> 8.2)")
    gre_score: int | None = Field(default=None, description="GRE total score out of 340 if mentioned")
    toefl_score: int | None = Field(default=None, description="TOEFL (out of 120) or IELTS equivalent if mentioned")
    research_papers: int = Field(default=0, description="Number of published research papers, preprints, or publications")
    work_experience_months: int = Field(default=0, description="Total months of relevant full-time or internship experience")
    detected_strengths: list[str] = Field(default_factory=list, description="Constructive strengths extracted from resume (e.g. internships, tech stack, papers)")
    detected_challenges: list[str] = Field(default_factory=list, description="Constructive weaknesses and gap areas extracted from resume")

resume_agent = Agent(
    model=OpenAIChatModel(
        "qwen2.5",
        provider=OpenAIProvider(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama"
        ),
    ),
    output_type=ParsedResumeData,
    system_prompt=(
        "You are an expert academic admissions evaluator. Your task is to analyze the applicant's resume PDF text. "
        "Extract structured metrics: target_program, target_country, CGPA (normalized 0-10), GRE score, TOEFL score, "
        "research_papers count, and work_experience_months. In addition, extract a list of detected_strengths (e.g. '3 internships at tech companies', "
        "'Published peer-reviewed paper in IEEE/Springer', 'Strong system programming in Rust/C++') and detected_challenges "
        "(e.g. 'Absence of GRE score for top quantitative programs', 'Zero peer-reviewed publications', 'No deployed live production systems')."
    )
)

class ResumeParserService:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            return text.strip()
        except Exception as exc:
            raise ValueError(f"Failed to read PDF document: {exc}")

    def _heuristic_fallback_parse(self, text: str) -> ParsedResumeData:
        lower = text.lower()

        cgpa = 8.0
        gpa_match = re.search(r'(?:gpa|cgpa)\s*(?:is|:)?\s*([0-9]+(?:\.[0-9]+)?)', lower)
        if gpa_match:
            val = float(gpa_match.group(1))
            if val <= 4.0:
                cgpa = round((val / 4.0) * 10.0, 2)
            elif val <= 10.0:
                cgpa = val

        gre = None
        gre_match = re.search(r'gre\s*(?:score|total)?\s*(?:is|:)?\s*([23][0-9]{2})', lower)
        if gre_match:
            gre = int(gre_match.group(1))
        toefl = None
        toefl_match = re.search(r'toefl\s*(?:score|total)?\s*(?:is|:)?\s*([0-9]{2,3})', lower)
        if toefl_match:
            toefl = int(toefl_match.group(1))
        research_count = 0
        research_titles = []
        if "publication" in lower or "ieee" in lower or "springer" in lower or "arxiv" in lower or "acm" in lower:
            matches = re.findall(r'(?:paper|publication|conference|journal|ieee|springer|arxiv|acm)', lower)
            research_count = min(4, len(matches))
            research_titles.append("Demonstrated academic research and preprint/conference activity.")
        program = "Computer Science"
        if "data science" in lower:
            program = "Data Science"
        elif "artificial intelligence" in lower or "machine learning" in lower:
            program = "Artificial Intelligence"
        elif "robotics" in lower:
            program = "Robotics"
        elif "electrical" in lower:
            program = "Electrical Engineering"
        elif "cybersecurity" in lower:
            program = "Cybersecurity"
        internship_matches = len(re.findall(r'(?:intern|internship)', lower))
        software_eng_matches = len(re.findall(r'(?:software engineer|developer|engineer|fullstack|backend|frontend)', lower))

        months = 0
        if internship_matches > 0:
            months += internship_matches * 6
        if software_eng_matches > 0 and months == 0:
            months = 12

        strengths = []
        challenges = []

        if internship_matches >= 3:
            strengths.append(f"{internship_matches} practical internships demonstrating verified industry and engineering experience.")
        elif internship_matches > 0:
            strengths.append(f"{internship_matches} relevant internship experience in software development.")
        elif months >= 12:
            strengths.append(f"{months} months of professional engineering experience.")

        if research_count > 0:
            strengths.append(f"Authored/co-authored research papers with academic exposure ({research_count} publications/preprints detected).")

        if cgpa >= 8.5:
            strengths.append(f"Strong undergraduate academic performance ({cgpa}/10.0 CGPA).")
        skills_found = []
        for s in ["python", "pytorch", "react", "next.js", "docker", "kubernetes", "c++", "golang", "aws", "postgresql"]:
            if s in lower:
                skills_found.append(s.capitalize())
        if skills_found:
            strengths.append(f"Core technical stack proficiencies: {', '.join(skills_found[:5])}.")
        if research_count == 0:
            challenges.append("No peer-reviewed publications or preprints detected; limits competitiveness for research-centric MS/PhD programs.")
        if not gre:
            challenges.append("No official GRE scores recorded; critical for top-30 US programs requiring quantitative percentiles.")
        if cgpa < 8.0:
            challenges.append(f"Undergraduate CGPA ({cgpa}/10.0) is below the median admit threshold for Top-50 global institutions.")
        if months < 6 and internship_matches == 0:
            challenges.append("Limited formal internship or production engineering experience identified.")

        if not strengths:
            strengths.append("Foundational coursework completed in undergraduate engineering.")
        if not challenges:
            challenges.append("Profile is well-rounded; priority should be placed on SOP alignment and strong faculty recommendation letters.")

        return ParsedResumeData(
            target_program=program,
            target_country="United States",
            cgpa=cgpa,
            gre_score=gre,
            toefl_score=toefl,
            research_papers=research_count,
            work_experience_months=months,
            detected_strengths=strengths,
            detected_challenges=challenges,
        )

    async def parse_resume(self, pdf_bytes: bytes) -> ParsedResumeData:
        raw_text = self.extract_text_from_pdf(pdf_bytes)
        if not raw_text:
            raise ValueError("The uploaded PDF does not contain extractable text.")

        snippet = raw_text[:4000]

        try:
            result = await resume_agent.run(f"Extract profile data from this resume text:\n\n{snippet}")
            data = result.data
            if not data.detected_strengths or not data.detected_challenges:
                fallback = self._heuristic_fallback_parse(snippet)
                if not data.detected_strengths:
                    data.detected_strengths = fallback.detected_strengths
                if not data.detected_challenges:
                    data.detected_challenges = fallback.detected_challenges
            return data
        except Exception:
            return self._heuristic_fallback_parse(snippet)

resume_parser_service = ResumeParserService()
