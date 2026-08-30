import uuid
from datetime import datetime
from sqlmodel import SQLModel, Field

class University(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(unique=True, index=True)
    country: str
    ranking: int | None = None
    tuition: float | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HistoricalProfile(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    university_id: uuid.UUID = Field(foreign_key="university.id", index=True)
    program_name: str
    cgpa: float
    gre_score: int | None = None
    toefl_score: int | None = None
    research_papers: int = Field(default=0)
    admitted: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)