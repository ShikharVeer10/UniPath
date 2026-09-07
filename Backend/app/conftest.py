import asyncio
from collections.abc import AsyncGenerator
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.db.database import get_db
from sqlmodel import SQLModel
from app.models.user_model import User  # noqa: F401
from app.models.evaluation import EvaluationRecord  # noqa: F401
from app.models.university_model import University, HistoricalProfile  # noqa: F401

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False, future=True)
async_session_test = async_sessionmaker(bind=engine_test, class_=AsyncSession, expire_on_commit=False)

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_test() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
async def setup_db():
    async with engine_test.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac