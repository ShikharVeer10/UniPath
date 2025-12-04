# UniPath Backend

FastAPI + MongoDB backend for UniPath with LLM-powered agents.

## Features
- Health check + DB ping (`/health/db`)
- Students: create/list/get/delete with pagination
- Applications (predictions): create/list/get/delete with pagination
- LLM Agent endpoints: resume parsing, admission prediction, feedback generation
- Environment-based MongoDB connection and configurable CORS
- Pytest test suite
- Docker support

## Requirements
- Python 3.12+
- MongoDB running locally or a connection string in `MONGODB_URI`

## Setup (Windows PowerShell)

```powershell
# (Recommended) create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# From the repo root where requirements.txt lives
pip install -r requirements.txt

# Optional: set env vars (or create a .env file)
$env:MONGODB_URI = "mongodb://localhost:27017/"
$env:MONGODB_DB = "unipath"
$env:ALLOWED_ORIGINS = "http://localhost:5173"

# Run the API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API
- GET `/` -> health
- GET `/health/db` -> Mongo ping
- POST `/students` -> body: UserProfile, returns `{ id }`
- GET `/students?skip=0&limit=50` -> returns `UserProfile[]`
- GET `/students/{id}` -> returns `UserProfile`
- DELETE `/students/{id}` -> deletes student
- POST `/applications` -> body: PredictionResult, returns `{ id }`
- GET `/applications?skip=0&limit=50` -> returns `PredictionResult[]`
- GET `/applications/{id}` -> returns `PredictionResult`
- DELETE `/applications/{id}` -> deletes application
- POST `/agents/resume-parse` -> body: `{ resume_text }`, returns `UserProfile`
- POST `/agents/predict` -> body: `{ profile, school_name? }`, returns `PredictionResult`
- POST `/agents/feedback` -> body: `{ prediction }`, returns improved `PredictionResult`

## Schemas
See `app/schemas/candidate.py` for `UserProfile` and `PredictionResult`.

## Notes
- Collections used: `Students`, `Applications` in DB `${MONGODB_DB}` (default `unipath`).
- IDs are not returned in list endpoints to keep response models simple.
