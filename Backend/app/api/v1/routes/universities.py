from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app import crud

router = APIRouter()


@router.get("/")
def list_universities() -> dict[str, str]:
    # TODO: Add filtering + pagination via service/repository layer.
    return {"todo": "implement university explorer listing"}
