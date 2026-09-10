from starlette.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api.v1.routers import api_router
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlmodel import SQLModel
from app.db.database import engine
# Import models so SQLModel registers every table before create_all runs.
from app.models.user_model import User  # noqa: F401
from app.models.evaluation import EvaluationRecord  # noqa: F401
from app.models.university_model import University, HistoricalProfile  # noqa: F401

from contextlib import asynccontextmanager

logger = logging.getLogger("uvicorn.error")

limiter = Limiter(key_func=get_remote_address)

def configure_swagger(target_app: FastAPI):
    openapi_schema = target_app.openapi()
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/api/v1/auth/login",
                    "scopes": {}
                }
            }
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"OAuth2PasswordBearer": []}]
    target_app.openapi_schema = openapi_schema

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as connection:
            await connection.run_sync(SQLModel.metadata.create_all)
    except Exception as exc:
        logger.warning("Create_all skipped or failed(safe if migrations is applied)", exc)
    configure_swagger(app)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.include_router(api_router, prefix="/api/v1")


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.exception("Database error while handling %s %s", request.method, request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred. Please try again later."},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error while handling %s %s", request.method, request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."}
    )

