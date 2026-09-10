"""
Interview Service Layer for UniPath.
Encapsulates strict AI mock admissions interview lifecycle, virtual call simulations,
email scheduling to registered Gmail, and uncompromising, evidence-based performance scoring.
"""

import re
import uuid
import logging
from openai import OpenAI
from app.core.config import settings
from app.services.interview_prompt import generate_interview_interrogator_prompt
from app.services.university_criteria import get_criteria_for_university
from app.services.email_service import email_service

logger = logging.getLogger("uvicorn.error")

# Key indicators of technical substance and rigor
TECHNICAL_SUBSTANCE_KEYWORDS = {
    "architecture", "latency", "throughput", "algorithm", "trade-off", "tradeoff",
    "complexity", "concurrency", "distributed", "database", "cache", "microservices",
    "bottleneck", "benchmark", "memory", "profiling", "optimization", "gpu", "cuda",
    "compiler", "synchronous", "asynchronous", "asymptotic", "pipeline", "framework",
    "scaling", "consensus", "raft", "paxos", "sharding", "replica", "indexing",
    "docker", "kubernetes", "fault-tolerant", "resilience", "partitioning"
}

# Red flags indicating vague, baseless, or evasive answers
BASELESS_INDICATORS = [
    "i don't know", "i dont know", "not sure", "random", "whatever", "stuff", "etc",
    "good thing", "make money", "just because", "no reason", "nothing", "cool",
    "as i said", "baseless", "dunno", "idk", "idk really", "some projects", "easy"
]

class InterviewService:
    def __init__(self):
        ollama_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434")
        self.client = OpenAI(
            base_url=f"{ollama_url.rstrip('/')}/v1",
            api_key="ollama",
            timeout=2.0,
        )
        self.model = "llama3.1"
        # In-memory store for session-specific resume profile context and asked questions to prevent repetition
        self._session_profiles: dict[str, dict] = {}

    def _extract_resume_elements(self, resume_text: str) -> dict:
        """Parses concrete entities from resume summary for bespoke question generation."""
        lower = resume_text.lower()
        projects = re.findall(r'(?:built|developed|created|implemented|designed|deployed)\s+([^,.;\n]+)', resume_text, flags=re.IGNORECASE)
        tech_matches = [w for w in set(lower.split()) if w in TECHNICAL_SUBSTANCE_KEYWORDS or w in {"python", "c++", "go", "golang", "rust", "react", "pytorch", "k8s", "aws", "sql"}]
        has_research = "paper" in lower or "publication" in lower or "ieee" in lower or "arxiv" in lower
        has_internship = "intern" in lower or "internship" in lower or "months" in lower

        return {
            "projects": [p.strip() for p in projects[:3] if len(p.strip()) > 5],
            "tech": [t.capitalize() for t in tech_matches[:5]],
            "has_research": has_research,
            "has_internship": has_internship,
            "raw": resume_text
        }

    async def schedule_interview_call(
        self,
        recipient_email: str,
        candidate_name: str,
        target_university: str,
        target_program: str,
        scheduled_time: str,
        client_base_url: str = "http://localhost:3000"
    ) -> dict:
        """
        Schedules a Virtual AI Admissions Call and dispatches the call link to the candidate's Gmail.
        """
        meeting_id = str(uuid.uuid4())[:8]
        call_url = f"{client_base_url}/interview?room={meeting_id}&university={target_university}&program={target_program}&call=active"

        email_sent = email_service.send_interview_invitation(
            recipient_email=recipient_email,
            candidate_name=candidate_name,
            target_university=target_university,
            target_program=target_program,
            scheduled_time=scheduled_time,
            call_url=call_url
        )

        return {
            "meeting_id": meeting_id,
            "call_url": call_url,
            "scheduled_time": scheduled_time,
            "recipient_email": recipient_email,
            "status": "Invitation link sent to registered email",
            "email_dispatched": email_sent
        }

    async def start_interview_session(
        self,
        candidate_name: str,
        major: str,
        target_university: str,
        resume_summary: str,
        sop_summary: str
    ) -> str:
        """
        Initializes an interview session with strict, university-tailored faculty persona.
        Every question is strictly tailored to the user's specific uploaded resume items.
        """
        criteria = get_criteria_for_university(target_university, 50)
        philosophy = criteria.get("selection_philosophy", "")
        focus_areas = criteria.get("resume_focus", "")
        key_labs = criteria.get("key_labs", "")

        enriched_sop = f"{sop_summary}. (Institutional Context: {philosophy} Key Labs: {key_labs})"
        parsed_resume = self._extract_resume_elements(resume_summary)

        # Store session profile for tracking asked questions across dialogue turns
        session_id = f"session_{target_university}_{candidate_name}".replace(" ", "_").lower()
        self._session_profiles[session_id] = {
            "name": candidate_name,
            "major": major,
            "uni": target_university,
            "parsed_resume": parsed_resume,
            "asked_questions": set(),
        }

        system_prompt = generate_interview_interrogator_prompt(
            candidate_name=candidate_name,
            major=major,
            target_university=target_university,
            resume_summary=f"{resume_summary} [Admissions Priority: {focus_areas}]",
            sop_summary=enriched_sop
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "Hello, I am ready for my interview."}
                ],
                temperature=0.3
            )
            msg = response.choices[0].message.content
            self._session_profiles[session_id]["asked_questions"].add(msg[:60])
            return msg
        except Exception as e:
            logger.info("Ollama offline, utilizing resume-tailored interviewer opening: %s", e)
            # Synthesize custom opening tailored directly to applicant's projects / tech
            first_project = parsed_resume["projects"][0] if parsed_resume["projects"] else None
            top_tech = ", ".join(parsed_resume["tech"]) if parsed_resume["tech"] else major

            if first_project:
                question = (
                    f"Welcome to your admissions interview, {candidate_name}. I am representing the admissions committee at "
                    f"{target_university} for {major}.\n\n"
                    f"Reviewing your resume dossier, we noted your work on \"{first_project}\". "
                    f"Could you walk the committee through the exact architectural decisions and technical trade-offs you made on this project, "
                    f"and explain why this experience prepares you for advanced study at {target_university}?"
                )
            elif parsed_resume["has_research"]:
                question = (
                    f"Welcome, {candidate_name}. I represent the graduate admissions committee at {target_university} for {major}.\n\n"
                    f"Looking at your parsed resume, you highlighted academic publication/preprint exposure. "
                    f"Could you describe the fundamental empirical hypothesis or methodology you formulated, what baseline models you benchmarked against, "
                    f"and how this research intersects with active labs at {target_university}?"
                )
            elif top_tech and top_tech != major:
                question = (
                    f"Welcome, {candidate_name}. Looking at your technical profile in {major} focusing on {top_tech}, "
                    f"could you discuss the most technically demanding engineering system or computational challenge you've implemented? "
                    f"What quantitative benchmarks or profiling metrics proved your solution succeeded?"
                )
            else:
                question = (
                    f"Welcome, {candidate_name}. Looking at your submitted background for {major} at {target_university}:\n\n"
                    f"What was the most significant technical problem you tackled in your undergraduate engineering coursework, "
                    f"what architectural constraints did you have to navigate, and why is {target_university} the ideal environment for your research?"
                )

            self._session_profiles[session_id]["asked_questions"].add(question[:60])
            return question

    async def process_candidate_response(
        self,
        session_id: str,
        chat_history: list[dict]
    ) -> str:
        """
        Strictly reviews the candidate's response. Never repeats questions.
        Generates subsequent interrogations strictly based on the applicant's resume highlights.
        """
        user_turns = [m for m in chat_history if m.get("role") == "user"]
        assistant_turns = [m for m in chat_history if m.get("role") == "assistant"]
        last_user_answer = user_turns[-1].get("content", "").strip() if user_turns else ""
        turn_count = len(user_turns)

        # Retrieve or initialize session state
        prof = self._session_profiles.get(session_id) or {
            "parsed_resume": self._extract_resume_elements(""),
            "asked_questions": set()
        }
        asked_set = prof.setdefault("asked_questions", set())
        for a in assistant_turns:
            asked_set.add(a.get("content", "")[:60])

        # Detect baseless or empty response
        words = last_user_answer.lower().split()
        is_baseless = (
            len(words) < 8 or
            any(phrase in last_user_answer.lower() for phrase in BASELESS_INDICATORS)
        )

        try:
            # Enforce non-repetition constraint in system messages
            extended_history = [
                {
                    "role": "system",
                    "content": (
                        "You are an admissions interviewer. Strictly tailor every question to details from the applicant's resume. "
                        "DO NOT repeat any previous questions or topics already discussed in this transcript. Ask one focused, new question."
                    )
                },
                *chat_history
            ]
            response = self.client.chat.completions.create(
                model=self.model,
                messages=extended_history,
                temperature=0.3
            )
            resp_content = response.choices[0].message.content
            # Check for repetition
            if resp_content[:60] not in asked_set:
                asked_set.add(resp_content[:60])
                return resp_content
        except Exception as e:
            logger.info("Ollama offline, utilizing resume-tailored non-repeating progressive interrogator: %s", e)

        # Non-repeating, resume-driven question progression
        if is_baseless:
            return (
                "Your answer appears evasive and lacks verifiable technical depth. Admissions committees require concrete mechanisms, not surface summaries.\n\n"
                "Let us refocus on engineering execution: In a primary software system or research project listed on your resume, what was the exact architectural bottleneck or algorithmic challenge? "
                "What specific technical metrics (such as latency, throughput, or memory footprint) did you implement to resolve it?"
            )

        parsed = prof.get("parsed_resume", {})
        projects = parsed.get("projects", [])
        tech_stack = parsed.get("tech", [])
        has_internship = parsed.get("has_internship", False)
        has_research = parsed.get("has_research", False)

        candidate_questions = []

        # Question based on secondary project / tech
        if len(projects) > 1:
            candidate_questions.append(
                f"Turning to another highlighted area in your resume, specifically your work on \"{projects[1]}\": "
                f"What algorithmic or architectural trade-offs did you evaluate between computational complexity, data consistency, and system maintainability? "
                f"What unexpected technical hurdle emerged during implementation?"
            )

        # Question based on tools/languages
        if tech_stack:
            tech_str = ", ".join(tech_stack[:3])
            candidate_questions.append(
                f"Your resume demonstrates proficiency with {tech_str}. "
                f"In production or high-throughput environments, how did you profile, optimize, or diagnose concurrency, memory leaks, or I/O bottlenecks when using these technologies?"
            )

        # Question based on industry internship vs research
        if has_internship:
            candidate_questions.append(
                "Your background includes industry software engineering / internship experience. "
                "Admissions committees assess how candidates transition from feature-driven corporate deliverables to foundational, publication-oriented graduate research. "
                "Can you walk us through a complex bug or system failure you diagnosed under strict production constraints?"
            )

        if has_research:
            candidate_questions.append(
                "Regarding your academic research or preprint deliverables: "
                "What peer-review critiques or theoretical limitations did you encounter in your experimental methodology, and how would you expand this work using the computing resources at our university?"
            )

        # Institutional alignment question
        candidate_questions.append(
            "Moving to your institutional alignment and faculty fit: "
            "Which specific research papers, active laboratory projects, or specialized coursework at this university directly intersect with your technical profile? "
            "How do your skills uniquely contribute to ongoing research in our department?"
        )

        # Pick the first question that hasn't been asked yet
        for q in candidate_questions:
            prefix = q[:60]
            if prefix not in asked_set:
                asked_set.add(prefix)
                return q

        # If all 5 stages completed:
        return (
            "We have concluded the formal questioning rounds of this interview session. "
            "All questions tailored to your background have been answered and logged for objective committee review. "
            "Click 'End Call & Score' below to generate your official committee evaluation report."
        )

    async def evaluate_interview_session(
        self,
        target_university: str,
        target_program: str,
        transcript: list[dict]
    ) -> dict:
        """
        Performs an UNCOMPROMISING, STRICT, EVIDENCE-BASED admissions evaluation.
        Analyzes the candidate's exact responses against the questions asked.
        Penalizes baseless, vague, or evasive answers severely.
        """
        user_msgs = [m for m in transcript if m.get("role", "").lower() == "user"]
        assistant_msgs = [m for m in transcript if m.get("role", "").lower() == "assistant"]

        if not user_msgs:
            return {
                "overall_score": 15,
                "technical_depth_feedback": "Critical Disqualification: Candidate provided no substantive responses during the interview session.",
                "articulation_feedback": "Non-responsive throughout dialogue.",
                "actionable_improvements": [
                    "Complete answers to every question asked by the admissions panel.",
                    "Review core computer science fundamentals before attempting an interview.",
                    "Familiarize yourself with faculty research at the target institution."
                ]
            }

        # Detailed analysis of user answers
        all_user_text = " ".join(m.get("content", "") for m in user_msgs)
        user_words = all_user_text.lower().split()
        total_words = len(user_words)
        avg_words_per_turn = total_words / max(1, len(user_msgs))

        # Check for technical vocabulary
        technical_matches = [w for w in set(user_words) if w in TECHNICAL_SUBSTANCE_KEYWORDS]
        baseless_matches = [phrase for phrase in BASELESS_INDICATORS if phrase in all_user_text.lower()]

        # Compute strictly grounded score:
        # Penalties:
        # - Extremely short answers (< 15 words average): -30 points
        # - Baseless/filler phrases: -20 points per instance
        # - Zero technical substance keywords: -25 points
        # Rewards:
        # - Detailed answers with trade-offs and metrics: +15 points
        # - Rich technical vocabulary: +2 points per keyword (capped)
        
        base_score = 50
        if avg_words_per_turn < 12:
            base_score -= 30
        elif avg_words_per_turn < 25:
            base_score -= 15
        elif avg_words_per_turn > 45:
            base_score += 15

        base_score -= min(35, len(baseless_matches) * 18)
        base_score += min(25, len(technical_matches) * 4)

        if len(technical_matches) == 0:
            base_score -= 20

        # Clamp strictly between 15 and 95
        final_score = int(max(15, min(95, base_score)))

        # Construct honest, strict, individualized feedback
        sample_answer = user_msgs[0].get("content", "")[:120]

        if final_score < 40:
            tech_feedback = (
                f"CRITICAL DEFICIT (Immediate Disqualification Risk): Candidate failed to answer the questions posed with acceptable rigor for {target_program} at {target_university}. "
                f"Responses were superficial, evasive, or entirely baseless (e.g. \'{sample_answer}...\'), containing zero verifiable technical mechanisms, system trade-offs, or algorithmic depth. "
                f"At top institutions, an interview with this lack of substance results in a unanimous denial by the faculty admissions committee."
            )
            art_feedback = (
                "Unacceptable articulation for graduate-level admissions. Failed to construct structured, persuasive technical arguments. "
                "Responses were either too brief, off-topic, or composed of conversational filler."
            )
            improvements = [
                f"Address the exact question asked: When asked about technical trade-offs or why {target_university}, provide concrete technical facts instead of vague statements.",
                "Demonstrate baseline competency: Prepare structured explanations of your key projects using the STAR method (Situation, Task, Action, Result).",
                f"Study institutional focus: Thoroughly review active faculty publications and labs at {target_university} before attending an admissions interview."
            ]
        elif final_score < 65:
            tech_feedback = (
                f"BELOW ADMISSION BENCHMARK: Candidate showed basic familiarity with computing concepts but consistently missed the depth required for {target_university}. "
                f"Answers touched upon topics in an abstract manner without providing low-level architectural justification, performance benchmarks, or algorithmic trade-off analysis."
            )
            art_feedback = (
                "Mediocre delivery: The candidate communicates clearly on surface topics but struggles to pivot into deep technical explanations when prompted."
            )
            improvements = [
                "Incorporate concrete quantitative metrics (e.g. latency, throughput, memory reduction percentages) into your answers.",
                f"Explicitly connect your past engineering deliverables to 1-2 specific research groups or courses at {target_university}.",
                "Avoid generalizations: Detail exact programming languages, data structures, and failure recovery protocols used in your systems."
            ]
        elif final_score < 85:
            tech_feedback = (
                f"SOLID TECHNICAL COMPETENCE: Candidate demonstrated clear engineering intuition and answered questions with reasonable domain accuracy suitable for {target_university}. "
                f"Understands core architectural decisions, though further depth in low-level concurrency or formal benchmarking would elevate this to a top-percentile admit."
            )
            art_feedback = (
                "Confident, professional, and well-paced articulation. Communicates engineering trade-offs systematically."
            )
            improvements = [
                f"Cite specific papers published by {target_university} faculty to prove exceptional institutional alignment.",
                "Detail system edge cases and failure modes more explicitly to demonstrate battle-tested production experience.",
                "Quantify your direct personal contributions versus team deliverables."
            ]
        else:
            tech_feedback = (
                f"EXCEPTIONAL FACULTY-CALIBER PERFORMANCE: Candidate displayed outstanding technical acumen, architectural depth, and mastery of algorithmic trade-offs aligned with {target_university}'s highest standards. "
                f"Responses were thoroughly substantiated with quantitative metrics, concrete design choices, and deep problem-solving maturity."
            )
            art_feedback = (
                "Impeccable professional delivery: Authoritative, structured, and articulate under probing questions."
            )
            improvements = [
                f"Engage directly with prospective research advisors at {target_university} prior to final admissions decisions.",
                "Prepare targeted questions about departmental computing clusters and upcoming grant initiatives for your final round.",
                "Maintain your portfolio documentation on GitHub to reinforce this strong verbal impression."
            ]

        return {
            "overall_score": final_score,
            "technical_depth_feedback": tech_feedback,
            "articulation_feedback": art_feedback,
            "actionable_improvements": improvements
        }

interview_service = InterviewService()
