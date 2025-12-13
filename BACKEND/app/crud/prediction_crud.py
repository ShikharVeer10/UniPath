# app/crud/prediction_crud.py
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from .. import models, schemas


class PredictionCRUD():
    def get(self, db: Session, prediction_id: int) -> Optional[models.Application]:
        """Get a prediction by its primary key."""
        return db.get(models.Application, prediction_id)

    def get_by_user(self, db: Session, user_id: int) -> List[models.Application]:
        """Return all predictions for a given user id (most recent first)."""
        stmt = select(models.Application).where(models.Application.user_id == user_id).order_by(models.Application.id.desc())
        return db.execute(stmt).scalars().all()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[models.Application]:
        """Return a page of predictions."""
        stmt = select(models.Application).offset(skip).limit(limit)
        return db.execute(stmt).scalars().all()

    def create(self, db: Session, pred_in: schemas.PredictionCreate) -> models.Application:
        """
        Create a new prediction row and return it.
        Rolls back the transaction on error.
        """
        db_obj = models.Application(**pred_in.model_dump())
        try:
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError:
            db.rollback()
            raise

    def update(self, db: Session, db_obj: models.Application, obj_in: dict) -> models.Application:
        data = obj_in
        try:
            for field, value in data.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError:
            db.rollback()
            raise

    def remove(self, db: Session, prediction_id: int) -> Optional[models.Application]:
        """
        Delete a prediction by id and return the deleted object (or None if not found)."""
        obj = db.get(models.Application, prediction_id)
        if obj is None:
            return None
        try:
            db.delete(obj)
            db.commit()
            return obj
        except SQLAlchemyError:
            db.rollback()
            raise

prediction = PredictionCRUD()
