from collections.abc import Generator
from sqlmodel import Session, create_engine
from app.core.config import settings

engine=create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True, ## reliability by checking dead db connections
    pool_recycle=1800, #refreshes long lived ones
    future=True,
)

def get_session()-> Generator[Session,None,None]:
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise

def get_session_context() -> Session:
    return Session(engine)