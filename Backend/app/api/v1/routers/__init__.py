from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.routers.recommendations import router as recommendations_router
from app.controllers.auth_controller import auth_controller
from app.db.database import get_db
from app.schemas.user_schema import Token, UserCreate, UserResponse
api_router = APIRouter()
api_router.include_router(recommendations_router)

@api_router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    return await auth_controller.register(db, user_in)


@api_router.post("/auth/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> Token:
    return await auth_controller.login(db, form_data)
