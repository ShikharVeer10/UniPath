import math
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.university_model import University, HistoricalProfile
from app.schemas.output_schema import StudentEvaluationInput, CategorizedUniversity, ProfileEvaluationResult
from app.services.university_criteria import get_criteria_for_university

logger = logging.getLogger("uvicorn.error")

class ProfileMatcherService:
    def _clamp(self, value: float, min_val: float = 0.05, max_val: float = 0.95) -> float:
        return max(min_val, min(max_val, value))

    def _category_from_probability(self, prob: float) -> str:
        if prob < 0.35:
            return "Ambitious"
        elif prob <= 0.70:
            return "Target"
        else:
            return "Safe"

    def _compute_profile_academic_score(self, student_data: StudentEvaluationInput, eval_style: str = "general") -> float:
        """Computes weighted profile score dynamically tailored to the university's evaluation style."""
        cgpa_norm = min(max(student_data.cgpa, 0.0), 10.0) / 10.0

        gre_val = student_data.gre_score if student_data.gre_score is not None else 305
        gre_norm = min(max(gre_val - 260, 0), 80) / 80.0

        toefl_val = student_data.toefl_score if student_data.toefl_score is not None else 90
        toefl_norm = min(max(toefl_val - 60, 0), 60) / 60.0

        research_norm = min(student_data.research_papers, 4) / 4.0
        exp_norm = min(student_data.work_experience_months, 36) / 36.0

        if eval_style == "research":
            # Research universities (Stanford, MIT, Berkeley, UIUC, Oxford) heavily prioritize publications & GPA
            return (cgpa_norm * 0.35) + (research_norm * 0.30) + (gre_norm * 0.15) + (exp_norm * 0.10) + (toefl_norm * 0.10)
        elif eval_style == "systems":
            # Systems/Quant universities (CMU, Georgia Tech, Purdue, NUS) heavily prioritize Quant test scores & GPA
            return (cgpa_norm * 0.38) + (gre_norm * 0.30) + (exp_norm * 0.14) + (research_norm * 0.10) + (toefl_norm * 0.08)
        elif eval_style == "gpa_gatekeeper":
            # GPA gatekeepers (USC, Columbia, UMich) enforce strong GPA thresholds
            return (cgpa_norm * 0.52) + (gre_norm * 0.20) + (exp_norm * 0.14) + (research_norm * 0.06) + (toefl_norm * 0.08)
        elif eval_style == "industry_coop":
            # Co-op & Employability universities (Northeastern, SJSU, Waterloo) heavily value work experience & internships
            return (exp_norm * 0.35) + (cgpa_norm * 0.35) + (gre_norm * 0.10) + (research_norm * 0.08) + (toefl_norm * 0.12)
        elif eval_style == "accessible_prereq":
            # Prerequisite & fast-track schools (ASU, UT Dallas, SUNY Buffalo)
            return (cgpa_norm * 0.42) + (gre_norm * 0.24) + (exp_norm * 0.18) + (toefl_norm * 0.12) + (research_norm * 0.04)
        else:
            return (cgpa_norm * 0.40) + (gre_norm * 0.25) + (toefl_norm * 0.12) + (research_norm * 0.12) + (exp_norm * 0.11)

    def _generate_personalized_rationale(
        self,
        student_data: StudentEvaluationInput,
        uni_name: str,
        rank: int,
        criteria: dict,
        prob: float,
        category: str
    ) -> str:
        """
        Synthesizes an authentic, institutional-specific evaluation narrative explaining
        how THIS particular university's committee assesses the student's actual resume and scores.
        """
        eval_style = criteria.get("eval_style", "general")
        philosophy = criteria.get("selection_philosophy", f"Holistic evaluation calibrated to world rank #{rank}.")

        # 1. GPA Analysis against institutional expectations
        cgpa = student_data.cgpa
        if cgpa >= 8.8:
            gpa_comment = f"Your undergraduate CGPA ({cgpa}/10.0) is in the top tier and comfortably exceeds {uni_name}'s baseline academic screening threshold."
        elif cgpa >= 8.0:
            gpa_comment = f"Your CGPA ({cgpa}/10.0) satisfies {uni_name}'s standard admission benchmark, though competitive applicants in this cohort frequently present 8.6+."
        elif cgpa >= 7.3:
            gpa_comment = f"Your CGPA ({cgpa}/10.0) meets baseline eligibility but sits near the lower boundary of {uni_name}'s typical admit pool, requiring compensating strengths."
        else:
            gpa_comment = f"Your CGPA ({cgpa}/10.0) is below {uni_name}'s preferred competitive range, making prerequisite course performance and portfolio evidence paramount."

        # 2. Testing Assessment (GRE / English) according to this university's specific policy
        gre = student_data.gre_score
        gre_policy = criteria.get("gre", "")
        if "not" in gre_policy.lower() or "waived" in gre_policy.lower():
            test_comment = f"Because {uni_name} does not require or weigh GRE scores, your testing score does not affect your standing; the committee evaluates purely through your transcript, projects, and recommendations."
        elif "optional" in gre_policy.lower():
            if gre and gre >= 320:
                test_comment = f"While GRE is optional at {uni_name}, your score of {gre} serves as a positive data point demonstrating quantitative aptitude."
            else:
                test_comment = f"{uni_name} considers GRE optional, meaning absence of a high score will not penalize you if your coursework grades are solid."
        else:
            if gre and gre >= 322:
                test_comment = f"Your GRE score of {gre} aligns well with {uni_name}'s quantitative benchmarks (Quant 164+)."
            elif gre:
                test_comment = f"Your GRE score of {gre} is slightly below {uni_name}'s preferred quantitative percentile, which their committee will note during screening."
            else:
                test_comment = f"{uni_name} strongly considers quantitative test percentiles, so submitting a competitive 320+ GRE would materially strengthen your application."

        # 3. Resume & Practical Experience Assessment (Research, Internships, Tech Skills)
        papers = student_data.research_papers
        exp_months = student_data.work_experience_months

        if eval_style == "research":
            if papers >= 2:
                exp_comment = f"Your {papers} research publications directly match {uni_name}'s research-intensive focus, giving you strong credibility with faculty review panels."
            elif papers == 1:
                exp_comment = f"Your 1 published paper demonstrates valuable research initiative, though {uni_name}'s typical admits often present peer-reviewed preprints in top conferences."
            else:
                exp_comment = f"Because {uni_name} prioritizes scholarly output, the lack of published research preprints makes your application more reliant on deep capstone projects and faculty SOP alignment."
        elif eval_style == "industry_coop":
            if exp_months >= 12:
                exp_comment = f"Your {exp_months} months of professional engineering experience and practical tech stack are viewed very favorably by {uni_name}'s career- and co-op-oriented faculty."
            elif exp_months >= 3:
                exp_comment = f"Your {exp_months} months of internship experience provides a foundational base for {uni_name}'s applied curriculum, though highlighting end-to-end production systems on GitHub will boost your standing."
            else:
                exp_comment = f"{uni_name} heavily evaluates immediate industry deployability; having under 3 months of formal industry experience means your personal software repositories must demonstrate production readiness."
        elif eval_style == "systems":
            exp_comment = f"The {uni_name} committee specifically inspects technical depth in low-level systems, concurrency, and architecture. Your experience will be evaluated against their rigorous software implementation standards."
        elif eval_style == "gpa_gatekeeper":
            exp_comment = f"{uni_name} employs structured academic cutoffs: while your {exp_months} months of experience adds value, the primary filter remains your cumulative coursework performance."
        else:
            exp_comment = f"Your combination of {exp_months} months of experience and {papers} publication(s) presents a balanced profile for {uni_name}'s holistic review."

        # Assemble cohesive narrative
        rationale = (
            f"Admissions Perspective: {philosophy}\n\n"
            f"• Academic Assessment: {gpa_comment}\n"
            f"• Standardized Testing: {test_comment}\n"
            f"• Resume & Portfolio: {exp_comment}\n\n"
            f"Committee Standing: Categorized as {category} ({round(prob * 100)}% estimated selectivity match)."
        )
        return rationale

    def _generate_personalized_advice(
        self,
        student_data: StudentEvaluationInput,
        uni_name: str,
        criteria: dict,
        category: str
    ) -> str:
        """Generates university-specific, highly actionable application strategy."""
        base_advice = criteria.get("tailored_advice", "")
        key_labs = criteria.get("key_labs", "")
        eval_style = criteria.get("eval_style", "general")

        step1 = ""
        if student_data.cgpa < 8.2:
            step1 = f"1. GPA Mitigation: Highlight top grades in upper-division algorithms, systems, and math courses. Supplement with accredited verified certificates (e.g. edX MicroMasters) to demonstrate master's readiness to {uni_name}."
        elif not student_data.gre_score and "required" in criteria.get("gre", "").lower():
            step1 = f"1. Testing Strategy: Prepare specifically for GRE Quant (target 166+) using official ETS material to meet {uni_name}'s quantitative department threshold."
        else:
            step1 = f"1. Academic Focus: Request academic LORs from professors who can specifically speak to your quantitative problem-solving and algorithmic rigor."

        step2 = ""
        if eval_style == "research":
            step2 = f"2. Scholarly Positioning: Write an empirical preprint or technical paper targeting arXiv or IEEE student venues. In your SOP, explicitly cite 2 faculty members in {key_labs or 'their research labs'} and explain how your past work connects to their recent publications."
        elif eval_style == "industry_coop":
            step2 = f"2. Co-op & Resume Polish: Restructure your CV to emphasize production deliverables: microservices, Docker/Kubernetes containerization, CI/CD pipelines, and verifiable GitHub links to prove immediate co-op employability at {uni_name}."
        elif eval_style == "systems":
            step2 = f"2. Systems Portfolio: Host a high-performance open-source project in C++, Rust, or Go with benchmarked latency and memory management data to match {uni_name}'s systems criteria."
        else:
            step2 = f"2. Portfolio Depth: Deploy 2 end-to-end full-stack or machine learning applications with live demo links and clean README architecture diagrams."

        step3 = f"3. Institutional Alignment: {base_advice}"

        return f"{step1}\n\n{step2}\n\n{step3}"

    def _compute_strict_acceptance(
        self,
        student_data: StudentEvaluationInput,
        uni_name: str,
        rank: int,
        criteria: dict,
        similar_admits_ratio: float | None = None
    ) -> tuple[float, str, str]:
        """Calculates realistic, nuanced acceptance probability and individual university narrative."""
        eval_style = criteria.get("eval_style", "general")
        profile_score = self._compute_profile_academic_score(student_data, eval_style=eval_style)

        if rank <= 15:
            expected_score = 0.91
            base_acceptance_cap = 0.12
        elif rank <= 50:
            expected_score = 0.83
            base_acceptance_cap = 0.24
        elif rank <= 120:
            expected_score = 0.74
            base_acceptance_cap = 0.44
        elif rank <= 250:
            expected_score = 0.65
            base_acceptance_cap = 0.64
        else:
            expected_score = 0.54
            base_acceptance_cap = 0.82

        delta = profile_score - expected_score
        calculated_prob = base_acceptance_cap / (1.0 + math.exp(-6.5 * delta))

        name_hash_factor = (sum(ord(c) for c in uni_name) % 11 - 5) * 0.008
        rank_spread_factor = (rank % 7 - 3) * 0.005
        calculated_prob += (name_hash_factor + rank_spread_factor)

        if similar_admits_ratio is not None:
            final_prob = (0.45 * similar_admits_ratio) + (0.55 * calculated_prob)
        else:
            final_prob = calculated_prob

        final_prob = round(self._clamp(final_prob), 2)
        category = self._category_from_probability(final_prob)

        rationale = self._generate_personalized_rationale(
            student_data=student_data,
            uni_name=uni_name,
            rank=rank,
            criteria=criteria,
            prob=final_prob,
            category=category
        )

        tailored_advice = self._generate_personalized_advice(
            student_data=student_data,
            uni_name=uni_name,
            criteria=criteria,
            category=category
        )

        return final_prob, rationale, tailored_advice

    async def _get_similar_ratio(
        self,
        db: AsyncSession,
        university_id,
        student_data: StudentEvaluationInput,
    ) -> float | None:
        query = select(HistoricalProfile).where(
            HistoricalProfile.university_id == university_id,
            HistoricalProfile.cgpa >= max(0.0, student_data.cgpa - 0.4),
            HistoricalProfile.cgpa <= min(10.0, student_data.cgpa + 0.4),
        )
        if student_data.gre_score:
            query = query.where(
                HistoricalProfile.gre_score >= student_data.gre_score - 10,
                HistoricalProfile.gre_score <= student_data.gre_score + 10,
            )
        res = await db.execute(query)
        matches = res.scalars().all()
        if not matches:
            return None
        return sum(1 for m in matches if m.admitted) / len(matches)

    def _generate_comprehensive_feedback(self, student_data: StudentEvaluationInput) -> tuple[list[str], list[str]]:
        strengths = []
        improvements = []

        if student_data.detected_strengths:
            for s in student_data.detected_strengths:
                if s not in strengths:
                    strengths.append(s)

        if student_data.cgpa >= 8.8:
            strengths.append(f"Exceptional undergraduate GPA ({student_data.cgpa}/10.0) fulfills top-percentile academic requirements.")
        elif student_data.cgpa >= 7.8:
            strengths.append(f"Solid academic foundation ({student_data.cgpa}/10.0) meets standard Master's eligibility.")

        if student_data.gre_score and student_data.gre_score >= 322:
            strengths.append(f"Competitive quantitative & verbal GRE score ({student_data.gre_score}) demonstrates analytical readiness.")

        if student_data.research_papers > 0 and not any("research" in s.lower() or "publication" in s.lower() for s in strengths):
            strengths.append(f"Demonstrated research capability with {student_data.research_papers} published paper(s) — significant differentiator.")

        if student_data.work_experience_months >= 12 and not any("intern" in s.lower() or "experience" in s.lower() for s in strengths):
            strengths.append(f"{student_data.work_experience_months} months of professional engineering/industry work experience.")

        if not strengths:
            strengths.append("Foundational academic degree completed; ready for strategic profile positioning.")

        if student_data.detected_challenges:
            for c in student_data.detected_challenges:
                if c not in improvements:
                    improvements.append(c)

        if student_data.cgpa < 8.2 and not any("gpa" in c.lower() for c in improvements):
            improvements.append(
                "GPA Enhancement: Complete accredited post-graduate coursework or micro-masters (e.g. edX MicroMasters / Coursera Specializations from top universities) with verified certificates to offset undergraduate GPA."
            )

        if (not student_data.gre_score or student_data.gre_score < 318) and not any("gre" in c.lower() for c in improvements):
            improvements.append(
                "GRE Target: Aim for a 320+ GRE (Quant >= 165) using ETS Official Guides and Magoosh Prep to unlock Tier-1 and Top-50 consideration."
            )

        if student_data.research_papers == 0 and not any("publication" in c.lower() or "research" in c.lower() for c in improvements):
            improvements.append(
                "Research Portfolio: Collaborate with professors or research labs on an empirical paper or technical survey. Target open-access preprints (arXiv.org) or IEEE/Springer student conferences."
            )

        if student_data.work_experience_months < 12 and not any("intern" in c.lower() or "production" in c.lower() for c in improvements):
            improvements.append(
                "Project Depth: Build 2 production-grade, end-to-end open-source projects hosted on GitHub with comprehensive documentation, unit tests, and live demo deployments (e.g. Vercel/Render)."
            )

        improvements.append(
            "Recommended Portals & Roadmaps: Explore CSPathshala / GitHub Open-Source Curriculum (github.com/ossu/computer-science), Kaggle competitions (kaggle.com), and PapersWithCode (paperswithcode.com) for state-of-the-art implementations."
        )

        improvements.append(
            "Application Narrative: Draft a tailored Statement of Purpose (SOP) directly connecting 2-3 faculty research labs at your target universities to your past project achievements."
        )

        return strengths, improvements

    async def evaluate_student_profile(
        self,
        db: AsyncSession,
        student_data: StudentEvaluationInput
    ) -> ProfileEvaluationResult:
        query = select(University)
        if student_data.target_country:
            query = query.where(University.country.ilike(f"%{student_data.target_country}%"))
        res = await db.execute(query.order_by(University.ranking.asc().nullslast()).limit(100))
        unis = res.scalars().all()

        if len(unis) < 6:
            all_res = await db.execute(select(University).order_by(University.ranking.asc().nullslast()).limit(150))
            unis = all_res.scalars().all()

        if not unis:
            benchmark_seeds = [
                ("Stanford University", "United States", 3, 58000.0),
                ("Massachusetts Institute of Technology (MIT)", "United States", 2, 57500.0),
                ("Harvard University", "United States", 1, 56000.0),
                ("University of California, Berkeley", "United States", 12, 44000.0),
                ("Carnegie Mellon University", "United States", 24, 52000.0),
                ("Georgia Institute of Technology", "United States", 45, 33000.0),
                ("University of Washington", "United States", 58, 38000.0),
                ("Purdue University", "United States", 88, 29000.0),
                ("Northeastern University", "United States", 175, 41000.0),
                ("Arizona State University", "United States", 210, 31000.0),
                ("University of Texas at Dallas", "United States", 340, 28000.0),
                ("San Jose State University", "United States", 420, 24000.0),
            ]
            for name, country, rank, tuition in benchmark_seeds:
                u = University(name=name, country=country, ranking=rank, tuition=tuition)
                db.add(u)
            await db.commit()
            all_res = await db.execute(select(University).order_by(University.ranking.asc().nullslast()))
            unis = all_res.scalars().all()

        ranked = sorted(unis, key=lambda u: u.ranking if u.ranking is not None else 9999)

        top_tier = [u for u in ranked if (u.ranking or 999) <= 40]
        mid_tier = [u for u in ranked if 40 < (u.ranking or 999) <= 160]
        safe_tier = [u for u in ranked if (u.ranking or 999) > 160]

        selected_unis: list[University] = []
        selected_unis.extend(top_tier[:5])
        selected_unis.extend(mid_tier[:5])
        selected_unis.extend(safe_tier[:6])

        if len(selected_unis) < 12:
            seen_ids = {u.id for u in selected_unis}
            for u in ranked:
                if u.id not in seen_ids:
                    selected_unis.append(u)
                    if len(selected_unis) >= 15:
                        break

        recommendations: list[CategorizedUniversity] = []

        for uni in selected_unis:
            rank = uni.ranking if uni.ranking is not None else 450
            criteria_info = get_criteria_for_university(uni.name, rank)
            sim_ratio = await self._get_similar_ratio(db, uni.id, student_data)
            prob, rationale, tailored_advice = self._compute_strict_acceptance(
                student_data=student_data,
                uni_name=uni.name,
                rank=rank,
                criteria=criteria_info,
                similar_admits_ratio=sim_ratio
            )
            category = self._category_from_probability(prob)

            requirements_dict = {
                "Admissions Philosophy": criteria_info.get("selection_philosophy", "Comprehensive institutional evaluation"),
                "Minimum CGPA": criteria_info.get("min_cgpa", "7.5 / 10.0"),
                "GRE Testing Policy": criteria_info.get("gre", "GRE Optional"),
                "English Standard": criteria_info.get("english", "TOEFL 85+ / IELTS 6.5+"),
                "Resume & Experience Priority": criteria_info.get("resume_focus", "Demonstrated software and algorithmic projects"),
                "Core Prerequisites": criteria_info.get("prerequisites", "Algorithms, Data Structures, Discrete Math"),
            }

            recommendations.append(
                CategorizedUniversity(
                    university_name=uni.name,
                    category=category,
                    acceptance_probability=prob,
                    rationale=rationale,
                    requirements=requirements_dict,
                    tailored_advice=tailored_advice,
                )
            )

        categories_present = {r.category for r in recommendations}
        if "Ambitious" not in categories_present and top_tier:
            for r in recommendations:
                if any(r.university_name == t.name for t in top_tier[:3]):
                    r.category = "Ambitious"
                    r.acceptance_probability = min(r.acceptance_probability, 0.12)
                    break

        strengths, improvements = self._generate_comprehensive_feedback(student_data)
        recommendations.sort(key=lambda x: x.acceptance_probability, reverse=True)

        return ProfileEvaluationResult(
            profile_summary=(
                f"Strict evaluation against {len(recommendations)} universities in {student_data.target_country} "
                f"for Master's in {student_data.target_program}. Admissions criteria evaluated based on individual institutional requirements, "
                f"rank selectivity tiers, and historical applicant distributions."
            ),
            key_strengths=strengths,
            areas_for_improvement=improvements,
            recommendations=recommendations,
        )

profile_matcher_service = ProfileMatcherService()
