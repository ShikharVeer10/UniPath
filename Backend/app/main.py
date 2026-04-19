from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, debug=settings.debug)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "UniPath backend is running"}

Base.metadata.create_all(bind=engine)