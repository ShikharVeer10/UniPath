from sqlalchemy import DeclarativeBase

class Base(DeclarativeBase):
    pass

from app.models.profile import profile
