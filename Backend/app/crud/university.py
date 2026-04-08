from sqlalchemy.ext.asyncio import AsyncSession
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate
from sqlalchemy import select

async def get_filtered_universities(db:AsyncSession,profile): #Takes student details and return universities they are eligible for
    result=await db.execute(select(University)) #Fetches all uni
    universities=result.scalars().all()
    filtered=[]

    #filtering logic
    for uni in universities:
        if(
            profile.gpa>=uni.min_gpa and
            profile.gre>=uni.avg_gre
        ):
            filtered.append(uni)

    return filtered