from fastapi import APIRouter

router=APIRouter()

@router.post("/profile")
def create_profile(profile: ProfileCreate, db:Session):
    return create_profile(profile,db)

