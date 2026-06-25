from fastapi import Depends,HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.db.session import get_session
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(
        token:str=Depends(oauth2_scheme),
        db:AsyncSession=Depends(get_session)
):
        payload=decode_access_token(token)

        if payload is None:
                raise HTTPException(status_code=401,detail="Invalid Token")
        
        email=payload.get("sub")

        result=await db.execute(select(User).where(User.email==email))
        user=result.scalar_one_or_none()

        if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User not found")
        
        return user