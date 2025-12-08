from fastapi import APIRouter
from .auth import router as auth_router
from .candidates import router as candidate_router

router=APIRouter()

router.include_router(auth_router)
router.include_router(candidates.router)
