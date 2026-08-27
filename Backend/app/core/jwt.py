from datetime import datetime,timezone,timedelta
import jwt
from app.core.config import settings

def create_access_token(subject:str,expires_delta:timezone | None=None)->str:
    if expires_delta:
        expire=datetime.now(timezone.utc) + expires_delta
    else:
        expire=datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRED_MINUTES)

    to_encode={"exp":expire,"sub":str(subject)}
    return jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)