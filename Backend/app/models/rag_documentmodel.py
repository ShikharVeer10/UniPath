import uuid
from datetime import datetime,timezone
from sqlmodel import SQLModel, Field, Column
from pgvector.sqlalchemy import Vector

def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class UniversityDocumentModel(SQLModel, table=True):
    __tablename__ = "university_documents"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    university_name: str = Field(index=True)
    program_name: str | None = Field(default=None, index=True)
    chunk_text: str
    embedding: list[float] | None = Field(default=None, sa_column=Column(Vector(1536)))

    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

UniversityDocument = UniversityDocumentModel