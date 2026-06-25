#DB Operations
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

async def get_user_by_email(db:AsyncSession,email:str):
    result=await db.execute(select(User).where(User.email==email))
    return result.scalar_one_or_none()

async def get_user_by_id(db:AsyncSession,user_id:int):
    result=await db.execute(select(User).where(User.id==user_id))
    return result.scalar_one_or_none()

async def create_user(db:AsyncSession,email:str,hashed_password:str): #Stores new user in database
    user_obj=User(email=email,hashed_password=hashed_password)
    db.add(user_obj)
    await db.commit()
    await db.refresh(user_obj)
    return user_obj 