import uuid
from datetime import datetime,timezone
from sqlmodel import SQLModel, Field

def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str | None = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)