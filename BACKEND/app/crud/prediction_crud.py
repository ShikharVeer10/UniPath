# app/crud/prediction_crud.py
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from app import models, schemas


class PredictionCRUD():
    def get(self, db: Session, prediction_id: int) -> Optional[models.Prediction]:
        """Get a prediction by its primary key."""
        return db.get(models.Prediction, prediction_id)

    def get_by_candidate(self, db: Session, candidate_id: int) -> List[models.Prediction]:
        """Return all predictions for a given candidate id (most recent first)."""
        stmt = select(models.Prediction).where(models.Prediction.candidate_id == candidate_id).order_by(models.Prediction.id.desc())
        return db.execute(stmt).scalars().all()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[models.Prediction]:
        """Return a page of predictions."""
        stmt = select(models.Prediction).offset(skip).limit(limit)
        return db.execute(stmt).scalars().all()

    def create(self, db: Session, pred_in: schemas.PredictionCreate) -> models.Prediction:
        """
        Create a new prediction row and return it.
        Rolls back the transaction on error.
        """
        db_obj = models.Prediction(**pred_in.dict())
        try:
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError:
            db.rollback()
            raise

    def update(self, db: Session, db_obj: models.Prediction, obj_in: schemas.PredictionUpdate) -> models.Prediction:
        data = obj_in.dict(exclude_unset=True)
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

    def remove(self, db: Session, prediction_id: int) -> Optional[models.Prediction]:
        """
        Delete a prediction by id and return the deleted object (or None if not found).
        """
        obj = db.get(models.Prediction, prediction_id)
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
