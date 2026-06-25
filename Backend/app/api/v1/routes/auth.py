from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.auth_controller import AuthController
from app.db.session import get_session
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    TokenResponse
)
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth",tags=["Authentication"])

@router.get("/me")
async def get_me(current_user:User=Depends(get_current_user)):
    return{
        "id":current_user.id,
        "email":current_user.email,
        "is_active":current_user.is_active,
        "created_at":current_user.created_at
    }

@router.post("/register")
async def register(user_data: UserRegister,db: AsyncSession = Depends(get_session)):
    return await AuthController.register(db=db,user_data=user_data)


@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin,db: AsyncSession = Depends(get_session)):
    return await AuthController.login(db=db,user_data=user_data)