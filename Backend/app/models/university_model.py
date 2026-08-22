import uuid
from sqlmodel import Field, Relationship
from app.models.base_model import TimeStampedModel

class University(TimeStampedModel, table=True):
    __tablename__ = "universities"

    name: str = Field(index=True, nullable=False)
    country: str = Field(index=True, nullable=False)
    ranking: int | None = Field(default=None, index=True)
    tuition: float | None = Field(default=None)

    profiles: list["HistoricalProfile"] = Relationship(
        back_populates="university",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class HistoricalProfile(TimeStampedModel, table=True):
    __tablename__ = "historical_profiles"

    university_id: uuid.UUID = Field(
        foreign_key="universities.id",
        index=True,
        nullable=False
    )
    program_name: str = Field(index=True, nullable=False)
    cgpa: float = Field(index=True, nullable=False)
    gre_score: int | None = Field(default=None, index=True)
    toefl_score: int | None = Field(default=None)
    research_papers: int = Field(default=0)
    admitted: bool = Field(index=True, nullable=False)

    university: University | None = Relationship(back_populates="profiles")