from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import prediction_router,auth_router #import from app/api/__init__.py

app=FastAPI(title="UNI-PATH(College Admission Predictor)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(prediction_router)