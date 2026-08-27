from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base_crud import CRUDBase
from app.models.user_model import User
from app.schemas.user_schema import UserCreate
from app.core.security import get_password_hash

class CRUDUser(CRUDBase[User,UserCreate]):
    async def get_by_email(self,db:AsyncSession,email:str)-> User | None:
        statement=select(User).where(User.email==email)
        result=await db.execute(statement)
        return result.scalars().first()

    async def create(self,db: AsyncSession,obj_in:UserCreate)->User:
        db_obj=User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

user_crud=CRUDUser(User)