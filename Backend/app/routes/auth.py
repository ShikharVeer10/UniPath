from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from app.db.session import get_session
from app.models.user import User
from app.core.security import create_access_token

router=APIRouter()
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain,hashed):
    return pwd_context.verify(plain,hashed)

@router.post("/register")
async def register(email:str,password:str,db:AsyncSession=Depends(get_session)):
    result=await db.execute(select(User).where(User.email==email))
    existing_user=result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400,detail="User already exists")
    
    user=User(email=email,password=hash_password(password))
    db.add(user)
    await db.commit()

    return{"message":"User created"}


@router.post("/login")
async def login(email:str,password:str,db:AsyncSession=Depends(get_session)):
    result=await db.execute(select(User).where(User.email==email))
    user=result.scalar_one_or_none()

    if not user or not verify_password(password,user.password):
        raise HTTPException(status_code=401,detail="Invalid credentials")
    
    token=create_access_token({"sub":user.email})

    return{
        "access_token":token,
        "token_type":"bearer"
    }
