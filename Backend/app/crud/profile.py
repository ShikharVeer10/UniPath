from sqlalchemy.ext.asyncio import AsyncSession
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate
from sqlalchemy import select

async def create_profile(db: AsyncSession, profile_data: ProfileCreate):
    profile = Profile(**profile_data.model_dump())

    db.add(profile)
    await db.commit()
    await db.refresh(profile) 

    return profile

async def get_profile(db: AsyncSession,profile_id:int):
    return await db.get(Profile,profile_id)

async def get_all_profiles(db:AsyncSession):
    result=await db.execute(select(Profile))
    return result.scalars().all()