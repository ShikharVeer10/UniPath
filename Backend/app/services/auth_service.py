from os import stat
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import (create_user,get_user_by_email)
from app.models.user import User
from app.schemas.auth import (UserRegister,UserLogin)
from app.core.security import (hash_password,verify_password,create_access_token)

class AuthService:

    @staticmethod
    async def register_user(db:AsyncSession,user_data:UserRegister):
        existing_user=await get_user_by_email(db,email=user_data.email)
        if existing_user:
            raise ValueError("Email is already registered")
        new_user=User(email=user_data.email,hashed_password=hash_password(user_data.password))

        created_user=await create_user(db,new_user)
        return created_user
    
    @staticmethod
    async def login_user(db:AsyncSession,user_data:UserLogin):
        user=await get_user_by_email(db,user_data.email)
        if not user:
            raise ValueError("Invalid Credentials")

        password_valid=verify_password(user_data.password,user.hashed_password)

        if not password_valid:
            raise ValueError("Invalid Credentials")
        access_token=create_access_token(
            {
                "sub":str(user.id)
            }
        )
        return{
            "access_token":access_token,
            "token_type":"bearer"
        }

        
