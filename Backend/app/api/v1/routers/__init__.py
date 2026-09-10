from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.routers.recommendations import router as recommendations_router
from app.api.v1.routers.evaluations import router as evaluations_router
from app.api.v1.routers.universities import router as universities_router
from app.api.v1.routers.profile import router as profile_router
from app.api.v1.routers.interviews import router as interviews_router
from app.api.v1.routers.interview_score import router as interview_score_router
from app.api.v1.routers.advisor import router as advisor_router
from app.api.v1.routers.feedback import router as feedback_router
from app.api.v1.routers.tracker import router as tracker_router
from app.controllers.auth_controller import auth_controller
from app.db.database import get_db
from app.schemas.user_schema import Token, UserCreate, UserResponse

api_router = APIRouter()
api_router.include_router(recommendations_router)
api_router.include_router(evaluations_router)
api_router.include_router(universities_router)
api_router.include_router(profile_router)
api_router.include_router(interviews_router)
api_router.include_router(interview_score_router)
api_router.include_router(advisor_router)
api_router.include_router(feedback_router)
api_router.include_router(tracker_router)

@api_router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    return await auth_controller.register(db, user_in)


@api_router.post("/auth/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> Token:
    return await auth_controller.login(db, form_data)
