import asyncio
from sqlmodel import select
from app.db.database import async_session
from app.models.university_model import University,HistoricalProfile

async def seed_database():
    async with async_session() as session:
        result=await session.execute(select(University))
        existing_units=result.scalars().all()
        if existing_units:
            print("Database already seeded with universities. Skipping seed process.")
            return
        
        print("Seeding initial universities and historical profiles...")

        #Creation of sample Universities
        # 1. Create Sample Universities
        mit = University(
            name="Massachusetts Institute of Technology (MIT)",
            country="United States",
            ranking=1,
            tuition=60000.0
        )
        stanford = University(
            name="Stanford University",
            country="United States",
            ranking=2,
            tuition=58000.0
        )
        cmu = University(
            name="Carnegie Mellon University",
            country="United States",
            ranking=3,
            tuition=62000.0
        )

        session.add_all([mit, stanford, cmu])
        await session.commit()
        await session.refresh(mit)
        await session.refresh(stanford)
        await session.refresh(cmu)

        # 2. Create Historical Admission Profiles for Context
        profiles = [
            HistoricalProfile(
                university_id=mit.id,
                program_name="MS in Computer Science",
                cgpa=9.5,
                gre_score=332,
                toefl_score=115,
                research_papers=3,
                admitted=True
            ),
            HistoricalProfile(
                university_id=mit.id,
                program_name="MS in Computer Science",
                cgpa=8.8,
                gre_score=318,
                toefl_score=102,
                research_papers=0,
                admitted=False
            ),
            HistoricalProfile(
                university_id=stanford.id,
                program_name="MS in Computer Science",
                cgpa=9.3,
                gre_score=328,
                toefl_score=112,
                research_papers=2,
                admitted=True
            ),
            HistoricalProfile(
                university_id=cmu.id,
                program_name="MS in Artificial Intelligence",
                cgpa=9.0,
                gre_score=325,
                toefl_score=110,
                research_papers=2,
                admitted=True
            ),
        ]

        session.add_all(profiles)
        await session.commit()
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
