import uuid
from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import DateTime

class TimeStampedModel(SQLModel):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now().replace(microsecond=0),
        sa_type=DateTime(timezone=True),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now().replace(microsecond=0),
        sa_type=DateTime(timezone=True),
        nullable=False
    )