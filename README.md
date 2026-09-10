# UniPath 🎓

> **AI-powered graduate admissions intelligence for study-abroad applicants.**
>
> Evaluate your profile, discover universities that fit your academic range, get application guidance, refine your SOP, and practice AI-driven admissions interviews.

[![CI](https://github.com/ShikharVeer10/UniPath/actions/workflows/python-app.yml/badge.svg)](https://github.com/ShikharVeer10/UniPath/actions/workflows/python-app.yml)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## What is UniPath?

UniPath is a full-stack admissions platform designed to help students make more informed graduate-school application decisions.

Instead of treating university selection as a simple ranking exercise, UniPath combines a student's academic profile with university/program data, historical applicant profiles, admissions heuristics, and AI assistance to produce a more actionable application strategy.

The platform brings together:

- **University discovery** with search, country, ranking, and program-oriented filtering
- **Acceptance prediction** based on profile matching and admissions signals
- **Program-level admission statistics** and historical applicant data
- **AI Admissions Advisor** for personalized application guidance
- **SOP refinement** with AI-generated critique and rewrites
- **AI mock interviews** with conversational follow-ups
- **Coding interview practice** with algorithmic questions and code execution/verification
- **Application tracking** for shortlisted universities, deadlines, target terms, and notes
- **Authentication** with JWT-based bearer tokens

---

## Core Features

### 🎯 Profile-Based University Evaluation

Submit academic signals such as CGPA, GRE, TOEFL, research experience, and work experience to evaluate your fit for a target program.

The backend combines:

1. **Historical profile matching** to find similar applicants.
2. **Profile and university heuristics** using academic and ranking signals.
3. **A blended acceptance estimate** with a rationale explaining the result.

### 🔎 University Explorer

Browse and filter universities using backend-supported parameters such as:

- Country
- University name
- Maximum world ranking
- Pagination

Program statistics can include applicant counts, admitted counts, acceptance rates, international-student estimates, average CGPA, and average GRE scores.

### 🤖 AI Admissions Advisor

The advisor accepts a student's profile alongside a natural-language question and provides admissions strategy for a target university or program.

It supports:

- Profile-aware recommendations
- University-specific guidance
- Retrieval of university knowledge/context
- Web verification for submitted links
- Faculty/researcher/organization lookups
- A rule-based fallback when the configured AI model is unavailable

The current advisor implementation uses **Pydantic AI** with an OpenAI-compatible provider configuration and can run against a local Ollama-backed model.

### ✍️ SOP Refiner

UniPath can analyze a Statement of Purpose draft against a target university/program and its prompt or departmental guidance.

The SOP workflow returns:

- Critique
- Suggested rewrite
- Key improvements

The current route is configured to use an OpenAI-compatible local Ollama endpoint with `llama3.1`.

### 🎙️ AI Mock Interview

Start an interview session using the candidate's name, major, target university, resume summary, and SOP summary.

The interview workflow supports:

- Starting a session
- Continuing a conversation using chat history
- Scheduling an interview call
- Retrieving coding questions
- Running submitted code against test cases

### 📌 Application Tracker

Track universities through the application process with:

- Status
- Target term
- Deadline
- Notes

Entries can be created, listed, updated, and deleted through the backend API.

### 🔐 Authentication

UniPath provides email/password signup and login with password hashing and JWT access tokens. The FastAPI application exposes the OAuth2 password flow at `/api/v1/auth/login`.

---

## Architecture

```text
┌──────────────────────────────┐
│       Next.js Frontend       │
│   React 19 + Tailwind CSS    │
└──────────────┬───────────────┘
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│        /api/v1/*             │
├──────────────────────────────┤
│ Auth                         │
│ Universities & Predictions  │
│ AI Advisor / RAG             │
│ SOP Refinement               │
│ Mock Interviews              │
│ Application Tracker          │
│ Feedback / Evaluations       │
└──────────────┬───────────────┘
               │ Async SQLAlchemy
               ▼
┌──────────────────────────────┐
│         PostgreSQL 16        │
│ Users / Universities /       │
│ Profiles / Evaluations / Apps│
└──────────────┬───────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   pgvector /      AI Provider
   vector data   OpenAI-compatible
                 / Ollama
```

The frontend lives at the repository root, while the FastAPI service is under `Backend/`. Alembic manages database migrations.

---

## Tech Stack

### Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React**
- ESLint + TypeScript type checking

### Backend

- **Python 3.12+**
- **FastAPI**
- **Uvicorn**
- **SQLModel / SQLAlchemy 2**
- **PostgreSQL** with async drivers
- **Alembic** for migrations
- **Pydantic / Pydantic Settings**
- **JWT authentication** with `python-jose` / `PyJWT`
- **Passlib / bcrypt** for password hashing
- **SlowAPI** for rate limiting

### AI / Data

- **Pydantic AI**
- **OpenAI-compatible APIs**
- **Ollama** for local model execution in the current advisor/SOP implementations
- **pgvector** for vector similarity search
- **pypdf** for PDF parsing

### DevOps

- **Docker**
- **Docker Compose**
- **GitHub Actions** for backend CI
- **uv** for Python dependency management

---

## Repository Structure

```text
UniPath/
├── app/                       # Next.js frontend
├── components/                # Reusable frontend components
├── lib/                       # Frontend utilities / API helpers
├── Backend/
│   ├── app/
│   │   ├── api/v1/routers/    # FastAPI route modules
│   │   ├── controllers/       # Backend controllers
│   │   ├── core/              # Configuration & security
│   │   ├── db/                # Database setup
│   │   ├── models/            # SQLModel models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Matching, AI, interview, search logic
│   ├── alembic/               # Database migrations
│   └── requirements.txt
├── .github/workflows/         # CI configuration
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python 3.12+**
- **Node.js** with npm
- **PostgreSQL 16** or a compatible PostgreSQL/Supabase instance
- **uv**
- An **OpenAI-compatible AI provider** for AI features

For the current local setup, the advisor and SOP routes are configured around **Ollama**.

### 1. Clone the repository

```bash
git clone https://github.com/ShikharVeer10/UniPath.git
cd UniPath
```

### 2. Start PostgreSQL

The repository includes Docker Compose configuration for PostgreSQL 16:

```bash
docker compose up -d db
```

The local database defaults to:

```text
Host: localhost
Port: 5432
Database: unipath
User: postgres
Password: password
```

Replace these defaults for any non-local environment.

### 3. Install backend dependencies

```bash
cd Backend
python -m pip install -r requirements.txt
```

Or from the repository root:

```bash
uv sync
```

### 4. Configure environment variables

Create your backend environment file using the variables expected by the application's configuration. A typical local setup is:

```env
PROJECT_NAME=UniPath
SECRET_KEY=change-me
ALGORITHM=HS256
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/unipath

OPENAI_API_KEY=your-key
OLLAMA_BASE_URL=http://localhost:11434/v1

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

**Never commit real API keys, JWT secrets, database passwords, or service credentials.**

### 5. Run database migrations

From `Backend/`:

```bash
alembic upgrade head
```

### 6. Start the FastAPI backend

From `Backend/`:

```bash
uvicorn app.main:app --reload --port 8000
```

API endpoints:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/api/v1/openapi.json`

### 7. Start the Next.js frontend

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Useful Commands

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking
```

### Backend

```bash
uvicorn app.main:app --reload --port 8000

alembic upgrade head
alembic revision --autogenerate -m "describe change"

pytest
flake8 .
```

---

## API Overview

The backend is mounted under `/api/v1`.

| Area | Example routes |
|---|---|
| Authentication | `/auth/signup`, `/auth/login` |
| Universities | `/universities/`, `/universities/{university_id}` |
| Prediction | `/universities/{university_id}/predict-acceptance` |
| University stats | `/universities/{university_id}/stats` |
| AI Advisor | `/advisor/chat` |
| SOP | `/sop/refine` |
| Interviews | `/interviews/start`, `/interviews/message` |
| Interview scheduling | `/interviews/schedule` |
| Coding practice | `/interviews/coding/random`, `/interviews/coding/run` |
| Application tracker | `/tracker/` |
| Feedback | `/feedback/analyze` |

For exact request and response schemas, use the generated Swagger UI at `/docs`.

---

## Acceptance Prediction

UniPath's predictor is designed as a hybrid decision-support system:

```text
Student profile
      │
      ├──► Historical profile matching ──► Similar applicant ratio
      │
      └──► Profile / university heuristics ──► Base score
                         │
                         ▼
               Blended probability
                         │
                         ▼
            Category + rationale + matches
```

The implementation considers signals such as:

- CGPA
- GRE
- TOEFL
- Research papers
- Work experience
- University ranking
- Similar historical applicants

These estimates are **not guaranteed admission probabilities**. Results depend on the quality of historical data, program differences, changing admissions policies, and missing applicant information.

---

## AI Architecture

### Advisor

```text
User question + profile
        │
        ├──► URL / faculty / organization detection
        │
        ├──► University document retrieval
        │
        └──► AI advisor model
                 │
                 ▼
          Personalized response
                 │
          ┌──────┴──────┐
          ▼             ▼
       Success      Model unavailable
                         │
                         ▼
                 Rule-based fallback
```

### SOP Refinement

```text
Target university + program + prompt + draft
                     │
                     ▼
                AI writing agent
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Critique    Rewrite   Improvements
```

---

## Testing & CI

Backend CI is configured with GitHub Actions and runs on pushes and pull requests targeting `main`.

The workflow currently:

1. Sets up Python 3.12.
2. Installs backend dependencies.
3. Runs Flake8 checks.
4. Runs Pytest using a SQLite test database.

This provides an automated validation path for backend changes.

---

## Current Status

UniPath is an **active development project**. The repository already contains a substantial backend API and a functional frontend, while several areas continue to evolve.

Potential next improvements include:

- Calibrating predictions against larger, cleaner historical datasets
- Strengthening vector retrieval and embedding pipelines
- Expanding API and service-level test coverage
- Adding more frontend integration tests
- Improving production deployment and observability
- Separating development and production AI provider configuration more cleanly

---

## Contributing

Contributions are welcome.

For larger changes, open an issue describing the problem, expected behavior, proposed approach, and any migration or configuration impact.

For code changes, use a focused feature branch, run the relevant checks locally, and open a pull request against `main`.

---

## Disclaimer

UniPath is an **educational and decision-support tool**. Its acceptance estimates and AI-generated guidance should not be treated as official admissions decisions or guarantees from any university.

Always verify current requirements, deadlines, test policies, and program information using the university's official sources before applying.

---

## License

The frontend `package.json` currently specifies the **ISC** license. Check the repository's licensing configuration for the authoritative terms.

---

## Author

**Shikhar Veeramachieni**

GitHub: [@ShikharVeer10](https://github.com/ShikharVeer10)

Project: [github.com/ShikharVeer10/UniPath](https://github.com/ShikharVeer10/UniPath)
