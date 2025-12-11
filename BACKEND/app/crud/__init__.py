# app/crud/__init__.py
from .user_crud import user as user_crud
from .base import candidate as candidate_crud
from .prediction_crud import prediction as prediction_crud

__all__ = ["user_crud", "base", "prediction_crud"]
