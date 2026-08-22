import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from sqlmodel import SQLModel

from app.core.config import settings
from app.models.base_model import TimeStampedModel
from app.models.user_model import User
from app.models.university_model import University, HistoricalProfile

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
target_metadata = SQLModel.metadata

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    connectable=create_async_engine(settings.DATABASE_URL)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

def run_migrations_online():
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    url=config.get_main_option("sqlalchemy.url")
    context.configure(url=url,target_metadata=target_metadata,literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()
else:
    run_migrations_online()