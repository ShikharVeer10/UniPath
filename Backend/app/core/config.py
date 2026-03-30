from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    model_config=SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    #App
    PROJECT_NAME: str = "UniPath"
    ENV: Literal["local","dev","staging","production"]="local"
    API_V1_PREFIX:str="/api/v1"
    DEBUG: bool=False
    SECRET_KEY:str

@lru_cache
def get_settings()->Settings:
    return Settings()

settings=get_settings()