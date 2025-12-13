from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Text, Float
from sqlalchemy.orm import relationship
from .db.engine import Base


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Candidate(Base):
    """Stores candidate data"""
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Application(Base):
    """Stores prediction/application data"""
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Optional link to user
    name = Column(String, nullable=False)
    cgpa = Column(Float, nullable=False)
    test_score = Column(Float, nullable=True)
    target_college = Column(String, nullable=True)
    major = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    admission_chance = Column(Float, nullable=False)
    reasoning = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)