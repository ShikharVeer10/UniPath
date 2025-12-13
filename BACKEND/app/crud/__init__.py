# app/crud/__init__.py
from .user_crud import user as user_crud
from .prediction_crud import prediction as prediction_crud

__all__ = ["user_crud", "prediction_crud"]
