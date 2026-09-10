from fastapi import APIRouter
from app.api.v1.routers import auth, evaluations, profile, universities, advisor, interviews, feedback, tracker, sop_refiner, interview_score

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(universities.router)
api_router.include_router(evaluations.router)
api_router.include_router(advisor.router)
api_router.include_router(interviews.router)
api_router.include_router(feedback.router)
api_router.include_router(tracker.router)
api_router.include_router(sop_refiner.router)    
api_router.include_router(interview_score.router) 