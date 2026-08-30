# UniPath 🎓

AI-powered university admission predictor — helping students make smarter study-abroad decisions.

Status: Early-stage · under active development

---

## Overview

UniPath is a full-stack platform that helps students estimate admission chances, build shortlists, and get personalized guidance using data-driven signals and an AI advisor (RAG). It blends historical admission outcomes with configurable scoring to provide probability estimates and contextual advice.

Key capabilities:
- University explorer (search & filter)
- Admit predictor (data + model blend)
- Admission statistics per program
- AI Chat Advisor (RAG) with a university knowledge base
- Application tracker, watchlist, notes, and comparisons

---

## Features

- University Explorer: filter by country, ranking, program, tuition, intake season
- Admit Predictor: likelihood estimates based on similar historical applicants and a weighted scoring model
- Admission Statistics: admit/reject counts and average scores (GRE/CGPA/TOEFL) per program
- AI Chat Advisor (RAG): retrieval-augmented responses grounded in university/program content
- Watchlist & Notes: bookmark universities and add personal notes
- Similar Profile Finder & University Comparison
- Application Tracker: saved → submitted → decision workflow

---

## Tech Stack

Backend
- FastAPI (Python)
- SQLModel (Pydantic + SQLAlchemy)
- PostgreSQL (primary database)
- Alembic (migrations)

AI / RAG
- Pydantic-AI (structured agent responses)
- OpenAI (chat & embeddings; provider configurable)
- Vector search via pgvector (Supabase or self-hosted Postgres)

Dev & Deploy
- Docker / Docker Compose (local/dev)
- GitHub Actions (CI/CD — planned)
- uv (Python dependency manager)

---

## How the Admit Predictor Works

UniPath combines two complementary signals:

1. Similarity search (data-driven)
   - Finds historical applicants to the same program within configurable score windows (e.g., CGPA ±0.5, GRE ±15)
   - Computes admit ratio from matched historical profiles

2. Weighted scoring (model-driven)
   - Compares the user profile against program averages using configurable feature weights (example):
     - CGPA: 40% · GRE: 30% · TOEFL: 20% · Research: 10%

3. Blending
   - Example formula: final = 0.60 * similarity_ratio + 0.40 * weighted_score
   - If few similar profiles exist, increase the scoring-model weight

4. Result buckets (configurable)
   - Ambitious: 0–30%
   - Moderate: 30–60%
   - Safe: 60–100%

All thresholds, windows, and weights are configurable and intended to be tuned on real data.

---

## How the AI Chat Advisor (RAG) Works

1. University/program content (descriptions, deadlines, FAQs) is chunked and embedded.
2. User queries are embedded and matched against the vector store.
3. Retrieved context + user profile are passed to the agent.
4. The agent responds as a study‑abroad advisor, grounded in the retrieved data.

---

## Getting Started (Developer)

Prerequisites
- Python 3.12+
- PostgreSQL (or Supabase)
- (Optional) pgvector for RAG
- OpenAI API key (or other provider)
- uv installed

Clone and install
```bash
git clone https://github.com/ShikharVeer10/UniPath.git
cd UniPath
uv sync
```

Environment variables
Create a `.env` (DO NOT commit)
```env
PROJECT_NAME=UniPath
SECRET_KEY=change-me

DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/unipath

OPENAI_API_KEY=your-openai-api-key

# If using Supabase:
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

Run (example)
```bash
# Adjust to your project layout / entrypoint
uvicorn app.main:app --reload
```
Open API docs: http://localhost:8000/docs

Docker (optional)
- A Docker Compose configuration is recommended for local development (Postgres + app + optional vector service).

---

## Development Notes

- Database: use Alembic for schema migrations
- Vector store: pgvector extension in Postgres (or Supabase vector)
- Config-driven: weights, thresholds, and similarity windows are configurable to support calibration
- Tests: add unit tests for predictor logic (similarity, scoring, blending) before calibration

---

## Roadmap

- [ ] Database schema & migrations
- [ ] University explorer endpoints
- [ ] Admission statistics endpoints
- [ ] Admit predictor engine & calibration
- [ ] AI Chat Advisor (RAG) integration
- [ ] User profiles, watchlist, application tracker
- [ ] Frontend dashboard & UX polish

---

## Contributing

Contributions are welcome. For larger changes, open an issue describing:
- The feature or bug
- Expected behavior
- Proposed implementation approach

Guidelines:
- Follow the repo's code style and test strategy
- Use feature branches and open a PR for review

---

## License

MIT License
