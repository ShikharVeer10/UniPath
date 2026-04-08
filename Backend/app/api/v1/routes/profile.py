from fastapi import APIRouter

router=APIRouter()

@router.post("/profile")
async def create_profile():
    pass
    