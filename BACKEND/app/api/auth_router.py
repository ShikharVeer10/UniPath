#Routes for Authentication: Register,Login,Refresh,Logout
from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any,Optional

#Pydantic schemas
from app.schemas import UserCreate,TokenResponse,RefreshRequest,UserOut

from app.db import get_db #DB dependency and CRUD helper
from app.crud.user_crud import async_get_user_by_email,async_create_user

from app.auth.utils import hash_password, verify_password
from app.auth.tokens import create_access_token,create_refresh_token,decode_token

import asyncio
from pathlib import Path as StdPath

router=APIRouter(prefix="/auth",tags=['Auth'])

TOKEN_STORE_FILE = "data/tokens.json"