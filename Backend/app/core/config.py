from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME:str="UniPath"
    SECRET_KEY:str
    ALGORITHM:str="HS256"
    ACCESS_TOKEN_EXPIRED_MINUTES:int=10080
    DATABASE_URL:str
    OPENAI_API_KEY:str | None=None

    model_config=SettingsConfigDict(env_file=".env",env_file_encoding="utf-8",extra="ignore")

settings=Settings()