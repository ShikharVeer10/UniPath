from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.routers import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(api_router, prefix="/api/v1")
