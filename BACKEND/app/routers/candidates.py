from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..schemas.prediction_schema import PredictionCreate
from ..crud.prediction_crud import prediction

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)

@router.post("/predict")
def predict_candidate(
    payload: PredictionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a prediction entry for a candidate.
    CRUD handles DB logic.
    """
    try:
        result = prediction.create(db=db, obj_in=payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
