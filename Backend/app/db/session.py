from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel.ext.asyncio.session import AsyncGenerator
from sqlmodel.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import sessionmaker
from sqlalchemy.pool import AsyncAdaptedQueuePool
from app.core.config import settings

DB_POOL_SIZE=83
WEB_CONCURRENCY=9
POOL_SIZE=max(DB_POOL_SIZE // WEB_CONCURRENCY,5)

engine=create_async_engine(
    str(settings.ASYNC_DATABASE_URI),
    echo=False, #Cleans logs and for better performance
    poolclass=AsyncAdaptedQueuePool,
    pool_size=POOL_SIZE,
    max_overflow=10,
)

AsyncSessionLocal=sessionmaker(
    engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

async def get_session() ->AsyncGenerator[AsyncSession,None]:
    async with AsyncSessionLocal() as session:
        yield session
