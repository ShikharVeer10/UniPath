# Routes for Authentication: Register, Login
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Pydantic schemas
from ..schemas import SignUpIn, LogIn, Token, UserOut

# DB and CRUD
from ..db.engine import get_db
from ..crud.simple_user_crud import create_user, authenticate_user, get_user_by_email
from ..auth import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: SignUpIn, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = create_user(db, user_in)
    return user


@router.post("/login", response_model=Token)
def login(login_data: LogIn, db: Session = Depends(get_db)):
    """Login and get access token"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return Token(access_token=access_token, token_type="bearer")