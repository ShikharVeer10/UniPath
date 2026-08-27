from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user_crud import user_crud
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.schemas.user_schema import UserCreate, UserResponse, Token

class AuthController:
    async def register(self, db: AsyncSession, user_in: UserCreate) -> UserResponse:
        existing = await user_crud.get_by_email(db, email=user_in.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        user = await user_crud.create(db, obj_in=user_in)
        return UserResponse.model_validate(user)

    async def login(self, db: AsyncSession, form_data: OAuth2PasswordRequestForm) -> Token:
        user = await user_crud.get_by_email(db, email=form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive account")
        
        token = create_access_token(subject=str(user.id))
        return Token(access_token=token, token_type="bearer")

auth_controller = AuthController()