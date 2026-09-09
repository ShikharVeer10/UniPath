import logging
from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from app.db.database import get_db
from app.models.rag_documentmodel import UniversityDocument
from app.core.config import settings
from app.services.university_criteria import UNIVERSITY_CRITERIA_REGISTRY

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/advisor", tags=["RAG Advisor"])

class ChatQueryReqest(BaseModel):
    query_text: str
    user_cgpa: float = Field(default=8.0, ge=0.0, le=10.0)
    user_gre: float | None = Field(default=None, ge=260, le=340)
    target_program: str = Field(default="Computer Science")
    university_name: str | None = Field(default=None)

class ChatResponse(BaseModel):
    answer: str
    retrieved_context: list[str]

chat_advisor_agent = Agent(
    model=OpenAIChatModel(
        "qwen2.5",
        provider=OpenAIProvider(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama"
        ),
    ),
    system_prompt=(
        "You are an elite graduate admissions consultant and career strategist. "
        "You give candid, realistic, actionable advice to prospective Master's and PhD students. "
        "Explain minimum CGPA standards, GRE requirements, prerequisite courses, and specific steps to build "
        "a competitive application (projects, research preprints, LORs, SOP focus). Be direct, honest, and encouraging."
    )
)

def _generate_rule_based_response(query: str, cgpa: float, gre: float | None, program: str, uni: str | None) -> str:
    lower_query = query.lower()
    gre_text = f"{gre}" if gre else "not submitted / waived"

    # Specific university guidance
    matched_key = None
    if uni:
        matched_key = next((k for k in UNIVERSITY_CRITERIA_REGISTRY if k in uni.lower()), None)
    if not matched_key:
        matched_key = next((k for k in UNIVERSITY_CRITERIA_REGISTRY if k in lower_query), None)

    if matched_key:
        c = UNIVERSITY_CRITERIA_REGISTRY[matched_key]
        return (
            f"Here are the specific admissions expectations and strategy for **{matched_key.title()}** ({program}):\n\n"
            f"• **Academic Threshold**: Benchmark CGPA is **{c['min_cgpa']}**. Your current CGPA of {cgpa}/10.0 "
            f"{'is competitive' if cgpa >= 8.5 else 'needs supporting strengths (such as high-level projects or post-grad certificates)'}.\n"
            f"• **Testing Expectation**: {c['gre']}. Your GRE: {gre_text}.\n"
            f"• **Language Requirement**: {c['english']}.\n"
            f"• **Essential Prerequisites**: {c['prerequisites']}.\n"
            f"• **Committee Focus**: {c['focus_areas']}\n\n"
            f"💡 **Strategic Recommendation**: {c['tailored_advice']}"
        )

    # General queries: how to improve resume / acceptance
    if "improve" in lower_query or "chance" in lower_query or "resume" in lower_query:
        points = []
        if cgpa < 8.2:
            points.append("1. **Remediate GPA Impact**: Enroll in verified graduate-level coursework (e.g. edX MicroMasters in Algorithms/ML) and highlight top grades.")
        if not gre or gre < 320:
            points.append("2. **Target a 320+ GRE (Quant >= 165)**: A high quantitative score reassures committees of your mathematical rigor.")
        points.append("3. **Production-Grade Project Depth**: Rather than standard class assignments, build 2 deployed systems on GitHub with automated unit tests, Docker packaging, and live demo links.")
        points.append("4. **Academic Research Preprints**: Co-author a technical survey or empirical benchmark and publish it to arXiv.org or student IEEE workshops.")
        points.append("5. **Hyper-Tailored Statement of Purpose**: Directly reference 2 specific research labs and active papers at your target universities.")

        return (
            f"Based on your profile ({cgpa}/10.0 CGPA, GRE: {gre_text}) for **{program}**, here is your priority roadmap to maximize admission probabilities:\n\n"
            + "\n".join(points)
        )

    # Default advisor response
    return (
        f"Evaluating your standing for **{program}** with **{cgpa}/10.0 CGPA** and GRE **{gre_text}**:\n\n"
        f"Top-tier graduate committees evaluate four pillars:\n"
        f"1. **Quantitative & Academic Foundation**: Minimum 8.0/10.0 CGPA for competitive Top-100 consideration.\n"
        f"2. **Technical Mastery**: Verifiable GitHub repositories demonstrating distributed systems, machine learning pipelines, or software engineering.\n"
        f"3. **Research Capability**: Publications, workshop papers, or technical reports on arXiv.\n"
        f"4. **Faculty Fit**: Letters of Recommendation from professors who can speak specifically to your analytical autonomy.\n\n"
        f"Feel free to ask about specific universities (e.g. Stanford, MIT, CMU, Georgia Tech, Northeastern, ASU) or how to address specific gaps in your background!"
    )

@router.post("/chat", response_model=ChatResponse)
async def advisor_chat(payload: ChatQueryReqest, db: AsyncSession = Depends(get_db)):
    context_texts = []
    try:
        query_embedding = [0.0] * 1536
        statement = select(UniversityDocument).order_by(UniversityDocument.embedding.cosine_distance(query_embedding)).limit(2)
        result = await db.execute(statement)
        docs = result.scalars().all()
        context_texts = [doc.chunk_text for doc in docs if doc.chunk_text]
    except Exception:
        context_texts = []

    # Attempt AI response, gracefully falling back to rule-based admissions intelligence
    prompt = f"""
    Student Profile:
    - CGPA: {payload.user_cgpa}/10.0
    - GRE: {payload.user_gre if payload.user_gre else 'Not submitted'}
    - Target Program: {payload.target_program}
    - Target University: {payload.university_name or 'Not specified'}

    Student Question: {payload.query_text}
    """

    try:
        agent_result = await chat_advisor_agent.run(prompt)
        answer = agent_result.data
    except Exception as exc:
        logger.info(f"Ollama agent unavailable ({exc}), utilizing expert admissions intelligence engine.")
        answer = _generate_rule_based_response(
            query=payload.query_text,
            cgpa=payload.user_cgpa,
            gre=payload.user_gre,
            program=payload.target_program,
            uni=payload.university_name,
        )

    return ChatResponse(answer=answer, retrieved_context=context_texts)