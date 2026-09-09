import csv
import asyncio
from sqlmodel import select
from app.db.database import async_session
from app.models.university_model import University, HistoricalProfile

async def import_universities_from_csv(file_path: str):
    async with async_session() as session:
        print(f"Reading university data from {file_path}...")
        
        try:
            with open(file_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                count = 0
                
                for row in reader:
                    name = row.get("name") or row.get("University Name")
                    country = row.get("country") or row.get("Location")
                    ranking_str = row.get("ranking") or row.get("University Rank")
                    
                    if not name or not country:
                        continue

                    ranking = int(ranking_str) if ranking_str and ranking_str.isdigit() else None
                    existing_query = select(University).where(University.name == name)
                    existing = (await session.execute(existing_query)).scalars().first()
                    
                    if not existing:
                        university = University(
                            name=name,
                            country=country,
                            ranking=ranking,
                            tuition=45000.0 # Default global baseline if unspecified
                        )
                        session.add(university)
                        await session.flush()
                        baseline_profile = HistoricalProfile(
                            university_id=university.id,
                            program_name="Computer Science",
                            cgpa=8.5,
                            gre_score=315,
                            toefl_score=100,
                            research_papers=0,
                            admitted=True
                        )
                        session.add(baseline_profile)
                        count += 1

                await session.commit()
                print(f"Successfully imported {count} new universities into the database!")
                
        except FileNotFoundError:
            print(f"Error: The file {file_path} was not found. Please provide a valid CSV file path.")

if __name__ == "__main__":
    csv_file = input("Enter path to your universities CSV file (or press enter for default): ").strip()
    if not csv_file:
        csv_file = "universities_dataset.csv"
    asyncio.run(import_universities_from_csv(csv_file))