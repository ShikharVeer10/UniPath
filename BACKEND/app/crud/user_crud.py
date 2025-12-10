# app/crud/user_crud.py
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from passlib.context import CryptContext

from app import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCRUD:
    def get(self, db: Session, user_id: int) -> Optional[models.User]:
        return db.get(models.User, user_id)

    def get_by_email(self, db: Session, email: str) -> Optional[models.User]:
        stmt = select(models.User).where(models.User.email == email)
        return db.execute(stmt).scalars().first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
        stmt = select(models.User).offset(skip).limit(limit)
        return db.execute(stmt).scalars().all()

    def create(self, db: Session, user_in: schemas.UserCreate) -> models.User:
        hashed = pwd_context.hash(user_in.password)
        db_user = models.User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=hashed,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update(self, db: Session, db_obj: models.User, obj_in: schemas.UserUpdate) -> models.User:
        data = obj_in.dict(exclude_unset=True)
        if "password" in data:
            data["hashed_password"] = pwd_context.hash(data.pop("password"))
        for field, value in data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, user_id: int) -> models.User:
        obj = db.get(models.User, user_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def authenticate(self, db: Session, email: str, password: str) -> Optional[models.User]:
        user = self.get_by_email(db, email)
        if not user:
            return None
        if not pwd_context.verify(password, user.hashed_password):
            return None
        return user

# singleton for import convenience
user = UserCRUD()
