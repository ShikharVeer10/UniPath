# 🎓 UniPath Backend

Welcome to the **UniPath Backend**! This is a production-oriented, asynchronous FastAPI backend skeleton designed to power the UniPath university admission predictor platform.

The system is configured with **SQLAlchemy** (asynchronous), **Alembic** (database migrations), and **Pydantic** for schemas, settings, and AI capabilities (via `pydantic-ai`).

---

## 📁 Project Structure

Here is a breakdown of the repository structure and what each module is designed for:

```text
Backend/
├── alembic/                # Database migrations directory
│   └── versions/           # Individual migration version files
├── alembic.ini             # Alembic configuration file
├── app/                    # Main application package
│   ├── api/                # API router definitions and entrypoints
│   │   └── v1/             # Version 1 of the API
│   │       ├── routes/     # Endpoint routes (auth, health, predictor, profile, etc.)
│   │       └── api.py      # Combines and registers all versioned routes
│   ├── controllers/        # Request handling logic (separated from route decorators)
│   ├── core/               # Configuration settings and security/crypto logic
│   ├── crud/               # Database helper operations (Create, Read, Update, Delete)
│   ├── db/                 # DB Session, Async Engine, and base Declarative Base
│   ├── dependencies/       # FastAPI dependencies (authentication, DB session providers)
│   ├── models/             # SQLAlchemy declarative database models
│   ├── prompts/            # System and LLM agent prompts
│   ├── schemas/            # Pydantic schemas for request/response validation
│   ├── services/           # Complex business logic and LLM services (RAG, Chat, etc.)
│   ├── utils/              # Helper utilities and common functions
│   └── main.py             # FastAPI application entrypoint
├── pyproject.toml          # Modern PEP 518/621 project configuration and dependencies
├── requirements.txt        # Legacy requirements export
├── scripts/                # Development and utility scripts
├── tests/                  # Pytest test suite (unit/ and integration/ tests)
├── .env.example            # Template for environment configuration
└── README.md               # This README file
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your local machine:
- **Python**: `>=3.11`
- **PostgreSQL**: With `pgvector` extension enabled for RAG/vector-similarity search
- **uv**: High-performance Python package manager (Recommended)

---

## 🚀 Quick Start Guide

### 1. Set Up the Virtual Environment & Dependencies

We recommend using `uv` to manage python dependencies. In the project root, run:

```bash
# Install dependencies and sync virtual environment
uv sync
```

*Alternatively, using standard virtualenv:*
```bash
python -m venv .venv
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the `.env.example` file to create your own local `.env` configuration:

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:
- `SECRET_KEY`: Used for JWT signing (generate using `openssl rand -hex 32`)
- `DATABASE_URL`: Asynchronous PostgreSQL connection string (e.g. `postgresql+psycopg://postgres:password@localhost:5432/unipath`)
- `OPENAI_API_KEY`: API key for Pydantic AI models

### 3. Database Setup & Migrations

Alembic is configured to handle database migrations. To prepare and run your database migrations:

```bash
# Generate the initial migration based on your SQLAlchemy models
alembic revision --autogenerate -m "Initial migration"

# Apply migrations to your database instance
alembic upgrade head
```

### 4. Running the Development Server

Start the FastAPI application with Uvicorn:

```bash
# Start the server with hot-reload enabled
uvicorn app.main:app --reload
```

The server will be available at **`http://localhost:8000`**.

### 5. Interactive API Documentation

FastAPI automatically generates interactive Swagger documentation for the API:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Testing, Linting & Formatting

This project uses **Pytest** for testing and **Ruff** for linting and formatting.

### Run Tests
```bash
pytest
```

### Lint and Format Check
```bash
# Run Ruff lint check
ruff check .

# Run Ruff code formatter check
ruff format --check .
```

### Auto-fix Linting & Formatting
```bash
ruff check --fix .
ruff format .
```

---

## 🛠️ Key Next Steps & Implementation Guidelines

When you begin implementing the endpoints, please pay attention to the following details in the scaffold:

1. **Resolve Router Imports**:
   `app/api/v1/api.py` imports routes like `applications`, `chat`, `comparison`, `similar_profiles`, `stats`, and `watchlist`. You need to create these corresponding files in `app/api/v1/routes/` and export a router from each.
2. **Database Engine**:
   `app/db/session.py` uses `create_async_engine` from SQLModel/SQLAlchemy and exports an async database session generator. Make sure your models and CRUD utilities use asynchronous database calls (e.g. using `await db.execute(...)`).
3. **Pydantic AI**:
   `pydantic-ai` is listed in your dependencies. You can build LLM agents and system prompt flows using this framework under the `app/services/` and `app/prompts/` directories.

