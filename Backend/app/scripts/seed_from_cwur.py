import csv
import random
from pathlib import Path
import asyncio
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import async_session
from app.models.university_model import University,HistoricalProfile

CSV_PATH = Path(__file__).resolve().parent / "cwurData.csv"

COUNTRY_MAP={
    "USA": "United States",
    "UK": "United Kingdom",
}
PROGRAMS=[
    "Computer Science",
        "Data Science",
        "Artificial Intelligence",
        "Machine Learning",
        "Software Engineering",
        "Electrical Engineering",
    ]

def estimate_tuition(country: str, rank: int) -> float:
    if country == "United States":
        return round(random.uniform(40000, 65000), 2)
    elif country in ("United Kingdom", "Australia", "Canada"):
        return round(random.uniform(28000, 48000), 2)
    elif country == "Germany":
        return round(random.uniform(1000, 5000), 2)
    else:
        return round(random.uniform(15000, 35000), 2)

def generate_profiles_for_uni(uni_id, ranking: int) ->list[HistoricalProfile]:
        profiles = []
        if ranking <= 50:
            cgpa_mean, gre_mean = 9.2, 328
        elif ranking <= 150:
            cgpa_mean, gre_mean = 8.5, 318
        elif ranking <= 300:
            cgpa_mean, gre_mean = 8.0, 310
        else:
            cgpa_mean, gre_mean = 7.4, 302

        for prog in PROGRAMS[:3]:  
            for _ in range(random.randint(4, 6)):
                cgpa = round(min(10.0, max(6.0, random.gauss(cgpa_mean, 0.6))),2)
                gre = int(min(340, max(280, random.gauss(gre_mean, 8))))
                toefl = int(min(120, max(80, random.gauss(105, 7))))
                papers = random.choices([0, 1, 2, 3], weights=[50, 30, 15,5])[0]
                score = (cgpa / 10.0) * 0.5 + ((gre - 260) / 80) * 0.35 +(papers / 3) * 0.15
                threshold = 0.85 if ranking <= 50 else (0.75 if ranking <= 150 else 0.62)
                admitted = score >= threshold or (random.random() < 0.12)  

                profiles.append(
                    HistoricalProfile(
                        university_id=uni_id,
                        program_name=prog,
                        cgpa=cgpa,
                        gre_score=gre,
                        toefl_score=toefl,
                        research_papers=papers,
                        admitted=admitted
                    )
                )
        return profiles

async def seed_cwur_data():
        if not CSV_PATH.exists():
            print(f"Error: Could not find CSV file at {CSV_PATH}")
            return

        print("Reading CWUR dataset")
        universities_dict: dict[str, dict] = {}

        with open(CSV_PATH, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row["institution"].strip()
                year = int(row.get("year", 0))
                rank = int(row["world_rank"])
                country = row["country"].strip()
                country = COUNTRY_MAP.get(country, country)

                if name not in universities_dict or year >universities_dict[name]["year"]:
                    universities_dict[name] = {
                        "name": name,
                        "country": country,
                        "ranking": rank,
                        "year": year,
                    }

        print(f"Parsed {len(universities_dict)} unique universities from CWUR.")

        async with async_session() as session:
            result = await session.execute(select(University.name))
            existing_names = set(result.scalars().all())

            new_unis = []
            for uni_data in universities_dict.values():
                if uni_data["name"] in existing_names:
                    continue

                uni = University(
                    name=uni_data["name"],
                    country=uni_data["country"],
                    ranking=uni_data["ranking"],
                    tuition=estimate_tuition(uni_data["country"],uni_data["ranking"])
                )
                new_unis.append(uni)

            if not new_unis:
                print("All universities from CWUR are already present in database.")
                return

            print(f"Inserting {len(new_unis)} new universities into database")

            batch_size = 100
            for i in range(0, len(new_unis), batch_size):
                chunk = new_unis[i:i + batch_size]
                session.add_all(chunk)
                await session.commit()
                for u in chunk:
                    await session.refresh(u)
                chunk_profiles = []
                for u in chunk:
                    chunk_profiles.extend(generate_profiles_for_uni(u.id, u.ranking or 500))
                session.add_all(chunk_profiles)
                await session.commit()
                print(f"Inserted {min(i + batch_size,len(new_unis))}/{len(new_unis)} universities with profiles")

            print("Database seeding from CWUR completed successfully!")

if __name__ == "__main__":
        asyncio.run(seed_cwur_data())

