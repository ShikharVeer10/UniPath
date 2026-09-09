import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base_crud import CRUDBase
from app.models.university_model import University,HistoricalProfile
from app.schemas.university_schema import UniversityCreate,HistoricalProfileCreate

class CRUDUniversity(CRUDBase[University,UniversityCreate]):
    async def get_by_name(self,db: AsyncSession,name:str) -> University | None:
        statement=select(University).where(University.name==name)
        result=await db.execute(statement)
        return result.scalars().first()

class CRUDHistoricalProfile(CRUDBase[HistoricalProfile,HistoricalProfileCreate]):
    async def get_by_university(self,db:AsyncSession,university_id:uuid.UUID)-> list[HistoricalProfile]:
        statement=select(HistoricalProfile).where(HistoricalProfile.university_id==university_id)
        result=await db.execute(statement)
        return list(result.scalars().all())

university_crud=CRUDUniversity(University)
historicalprofile_crud=CRUDHistoricalProfile(HistoricalProfile)


