from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, candidates
from .db.engine import create_db_and_tables

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(candidates.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
