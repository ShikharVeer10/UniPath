from fastapi import APIRouter
from app.dependencies.auth import get_current_user

router=APIRouter()

@router.post("/profile")
async def create_profile():
    pass

@router.get("/profile/me")
async def get_my_profile(current_user: User=Depends(get_current_user)):
    return current_user