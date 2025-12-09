from datetime import datetime,timedelta
from typing import Dict,Any,Optional
from passlib.context import CryptContext #Secure password hashing
import jwt
from jwt import PyJWTError #Error raised if token is invalid
from .core.config import settings

pwd_context=CryptContext(schemas=["bcrypt"],deprecated="auto")

#Taken plain text password  and runs a secured hashed version
def get_password_hash(password:str)->str:
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str)->bool:
    return pwd_context.verify(plain_password,hashed_password)

#JWT Access token creation
def create_access_token(data:Dict[str,Any],expires_minutes:Optional[int]=None)->str:
    to_encode=data.copy() #Copy of original payload
    expires_minutes=expires_minutes if expires_minutes is not None else settings.ACCESS_TOKEN_EXPIRE_MINUTES
    expire=datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp":expire}) #exp claim for expiry validation
    token=jwt.encode(to_encode,settings.JWT_SECRET,algorithm=settings.JWT_ALGORITHM)
    """
    Payload-to_encode
    Secret key=settings.JWT_SECRET
    signing algorithm=settings.JWT_Algorithm
    """
    return token

#Decode token
def decode_access_token(token:str)->Dict[str,Any]:
    try:
        payload=jwt.decode(token,settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload

    except PyJWTError: #If token is invalid or expired
        raise