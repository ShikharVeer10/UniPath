import asyncio
from sqlmodel import select
from app.db.database import async_session
from app.models.university_model import University, HistoricalProfile

async def run_micro_test():
    async with async_session() as db:
        # Clean up if existing from previous run
        existing = (await db.execute(select(University).where(University.name == "University of Illinois Urbana-Champaign"))).scalars().all()
        for u in existing:
            await db.delete(u)
        await db.commit()

        test_uni = University(
            name="University of Illinois Urbana-Champaign",
            country="United States",
            ranking=35,
            tuition=45000.0
        )
        db.add(test_uni)
        await db.commit()
        await db.refresh(test_uni)
        print(f"Created University: {test_uni.name} with ID {test_uni.id}")

        profile = HistoricalProfile(
            university_id=test_uni.id,
            program_name="MS in Computer Science",
            cgpa=9.1,
            gre_score=325,
            toefl_score=110,
            research_papers=2,
            admitted=True
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        print(f"Created Profile: ID {profile.id} for University ID {profile.university_id}")

        stmt = select(HistoricalProfile).where(HistoricalProfile.university_id == test_uni.id)
        result = await db.execute(stmt)
        fetched_profiles = result.scalars().all()
        assert len(fetched_profiles) == 1
        assert fetched_profiles[0].cgpa == 9.1
        print("Model verification assertion passed successfully!")

        await db.delete(test_uni)
        await db.commit()

        check_stmt = select(HistoricalProfile).where(HistoricalProfile.id == profile.id)
        check_result = await db.execute(check_stmt)
        assert check_result.scalars().first() is None
        print("Cascade deletion test passed successfully!")

if __name__ == "__main__":
    asyncio.run(run_micro_test())