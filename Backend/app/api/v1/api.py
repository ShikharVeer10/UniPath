from fastapi import APIRouter

from app.api.v1.routes import (
    applications,
    chat,
    comparison,
    health,
    predictor,
    similar_profiles,
    stats,
    universities,
    watchlist,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(universities.router, prefix="/universities", tags=["universities"])
api_router.include_router(predictor.router, prefix="/predictor", tags=["predictor"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])
api_router.include_router(similar_profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(comparison.router, prefix="/compare", tags=["comparison"])
