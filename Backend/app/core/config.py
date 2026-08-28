from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniPath"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"

    class Config:
        env_file = ".env"

settings = Settings()
