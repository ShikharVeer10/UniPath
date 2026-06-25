from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import UserLogin,UserRegister
from app.services.auth_service import AuthService

class AuthController:

    @staticmethod
    async def register(db:AsyncSession,user_data:UserRegister):
        return await AuthService.register_user(db,user_data)
    
    @staticmethod
    async def login(db:AsyncSession,user_data:UserLogin):
        return await AuthService.login_user(db,user_data)