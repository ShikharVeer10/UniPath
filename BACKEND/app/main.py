from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import prediction_router, auth_router
from .db.engine import create_db_and_tables

app = FastAPI(title="UNI-PATH (College Admission Predictor)")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routers
app.include_router(auth_router)
app.include_router(prediction_router)


@app.get("/", tags=["Health"])
def root():
    """Root endpoint - API health check"""
    return {
        "message": "UNI-PATH API is running",
        "version": "1.0.0",
        "status": "ok"
    }