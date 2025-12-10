from fastapi import APIRouter, HTTPException
from .. import crud
from ..auth import create_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(email: str, password: str):
    user = crud.create_user(email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"message": "Signup successful"}

@router.post("/login")
def login(email: str, password: str):
    user = crud.authenticate(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(email)
    return {"access_token": token, "token_type": "bearer"}

