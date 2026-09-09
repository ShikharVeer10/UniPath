import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class University(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(unique=True, index=True)
    country: str
    ranking: int | None = None
    tuition: float | None = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    historical_profiles: list["HistoricalProfile"] = Relationship(
        back_populates="university",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class HistoricalProfile(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    university_id: uuid.UUID = Field(foreign_key="university.id", ondelete="CASCADE", index=True)
    program_name: str
    cgpa: float
    gre_score: int | None = None
    toefl_score: int | None = None
    research_papers: int = Field(default=0)
    admitted: bool
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    university: University | None = Relationship(back_populates="historical_profiles")