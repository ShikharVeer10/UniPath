# UniPath 🎓

**AI-powered university admission predictor — helping students make smarter study abroad decisions.**

UniPath is a full-stack platform inspired by products like Yocket. It helps students estimate their admission chances and create better university shortlists by using (1) historical admission outcomes, (2) multi-feature profile matching, and (3) a RAG-based AI advisor.

> **Project status:** Early-stage / under active development.

---

## 🚀 Features

- **University Explorer**  
  Search and filter universities by country, ranking, program, tuition, and intake season.

- **Admit Predictor**  
  Estimate admission probability based on your profile vs. historical applicants.

- **Admission Statistics**  
  View historical admit/reject counts and academic averages (GRE/CGPA/TOEFL) per program.

- **AI Chat Advisor (RAG)**  
  Get personalized recommendations and Q&A, grounded on a university knowledge base.

- **Application Tracker**  
  Track your applications from saved → submitted → decision.

- **Watchlist & Notes**  
  Bookmark universities and attach personal notes.

- **Similar Profile Finder**  
  Compare your profile to similar historical applicants.

- **University Comparison**  
  Side‑by‑side comparison of universities/programs.

---

## 🛠️ Tech Stack

### Backend

- **FastAPI** (Python) – API framework  
- **SQLModel** – ORM (Pydantic + SQLAlchemy)  
- **PostgreSQL** – Primary database  
- **Alembic** – Database migrations  

### AI / RAG

- **Pydantic-AI** – Structured agent responses  
- **OpenAI** – Chat + embeddings (configurable)  
- **Vector Search** – pgvector (via Supabase or self-hosted Postgres)  

### Dev & Deploy

- **Docker / Docker Compose** – Containerized local/dev environment  
- **GitHub Actions** – CI/CD (planned)  
- **uv** – Python dependency management

---

## 🎯 How the Admit Predictor Works

UniPath blends two signals:

1. **Similarity Search (data-driven):**
    - Finds historical applicants to the same program within a score window (e.g., CGPA ±0.5, GRE ±15).
    - Computes an admit ratio from similar profiles.

2. **Weighted Scoring (model-driven):**
    - Compares the user profile to program averages and computes a weighted score.
    - Example weights (configurable):
        - CGPA: 40%
        - GRE: 30%
        - TOEFL: 20%
        - Research: 10%

3. **Blending:**
    - Example: `final = 0.60 * similarity_ratio + 0.40 * weighted_score`
    - If there are too few similar profiles, increase weight on the scoring model.

4. **Result Categories:**
    - **Ambitious**: 0–30%
    - **Moderate**: 30–60%
    - **Safe**: 60–100%

> **Note:** Thresholds, features, and weights are configurable and may evolve.

---

## 🤖 How the AI Chat Advisor Works (RAG)

1. University/program content (descriptions, deadlines, FAQs, etc.) is chunked and embedded.
2. User queries are embedded and matched against the knowledge base via vector similarity search.
3. Retrieved context + user profile are passed to the agent.
4. The agent responds like a study‑abroad advisor, grounded in retrieved data.

---

## 🧑‍💻 Getting Started (Developer Setup)

### Prerequisites

- **Python 3.12+**
- A **PostgreSQL** instance (or **Supabase**)
- (Optional) **pgvector** enabled for RAG
- An **OpenAI API key** (or other provider, if you swap it)
- **uv** installed

### Installation

```bash
git clone https://github.com/ShikharVeer10/UniPath.git
cd UniPath
uv sync
```

### Environment Variables

Create a `.env` file (do not commit it):

```env
PROJECT_NAME=UniPath
SECRET_KEY=change-me

DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/unipath

OPENAI_API_KEY=your-openai-api-key

# If using Supabase:
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

### Run the API (example)

```bash
# Example only — adjust to your actual app entrypoint
uvicorn app.main:app --reload
```

Open Swagger UI:

- http://localhost:8000/docs

---

## 🗺️ Roadmap

- [ ] Database schema & migrations
- [ ] University explorer endpoints
- [ ] Admission statistics endpoints
- [ ] Admit predictor engine & calibration
- [ ] AI Chat Advisor (RAG) integration
- [ ] User profiles, watchlist, application tracker
- [ ] Frontend dashboard

---

## 🤝 Contributing

PRs are welcome! For larger changes, please first open an issue describing:
- The feature or bug
- Expected behavior
- Proposed implementation approach

---

## 📄 License

MIT License
