# app/crud/user_crud.py
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from passlib.context import CryptContext

from .. import models, schemas

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
        """
        Create a new user. Commits the session and returns the new DB object.
        Rolls back if an error occurs.
        """
        hashed = pwd_context.hash(user_in.password)
        db_user = models.User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=hashed,
            is_active=True
        )
        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except Exception:
            db.rollback()
            raise

    def update(self, db: Session, db_obj: models.User, obj_in: schemas.UserUpdate) -> models.User:
        """
        Update a user. `obj_in` can be a pydantic model or dict-like.
        Converts `password` field to `hashed_password` if provided.
        """
        data = obj_in.model_dump(exclude_unset=True)
        try:
            # If caller passed 'password', convert it to hashed_password
            if "password" in data:
                data["hashed_password"] = pwd_context.hash(data.pop("password"))
            for field, value in data.items():
                # Only set attributes that exist on the model
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except Exception:
            db.rollback()
            raise

    def remove(self, db: Session, user_id: int) -> Optional[models.User]:
        """
        Remove (delete) a user by id. Commits the session.
        Returns the deleted object (or None if not found).
        """
        obj = db.get(models.User, user_id)
        if obj is None:
            return None
        try:
            db.delete(obj)
            db.commit()
            return obj
        except Exception:
            db.rollback()
            raise

    def authenticate(self, db: Session, email: str, password: str) -> Optional[models.User]:
        """
        Return user if email/password match; otherwise None.
        """
        user = self.get_by_email(db, email)
        if not user:
            return None
        if not pwd_context.verify(password, user.hashed_password):
            return None
        return user


# singleton instance exported for convenience
user = UserCRUD()
