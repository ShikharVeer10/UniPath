# app/api/__init__.py
# Export routers so main.py can import them cleanly.

from .routers import router as prediction_router
from .auth_router import router as auth_router

__all__ = ["prediction_router", "auth_router"]
