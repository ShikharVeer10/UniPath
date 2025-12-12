from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import os

from ..schemas.prediction_schema import ApplicantCreate, PredictionResponse
from ..db.engine import get_db
from ..models import Application
from ..dependencies import get_current_user
from ..models import User

# Creating a router for all prediction related endpoints
router = APIRouter(tags=["Prediction"], prefix="/predictions")


@router.post("/predict",
             response_model=PredictionResponse,
             summary="Predicts the admission chance using applicant data",
)
async def predict_admission(
    applicant: ApplicantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Predict admission chance using a simple heuristic model.
    Requires authentication.
    """
    # Simple heuristic prediction
    cgpa_score = (applicant.cgpa / 10.0) * 0.5  # 50% weight
    test_score_weight = (applicant.test_score / 340.0) * 0.3 if applicant.test_score else 0.15
    resume_weight = 0.2 if applicant.resume_text else 0.05
    
    admission_chance = min(cgpa_score + test_score_weight + resume_weight, 1.0)
    
    # Generate reasoning
    reasoning_parts = []
    reasoning_parts.append(f"CGPA of {applicant.cgpa} contributes {cgpa_score:.2%} to admission probability.")
    
    if applicant.test_score:
        reasoning_parts.append(f"Test score of {applicant.test_score} adds {test_score_weight:.2%}.")
    else:
        reasoning_parts.append("No test score provided (default 15% added).")
    
    if applicant.resume_text:
        reasoning_parts.append("Resume provided adds 20% weight.")
    else:
        reasoning_parts.append("No resume (minimal 5% weight).")
    
    reasoning = " ".join(reasoning_parts)
    
    # Store in database
    db_application = Application(
        user_id=current_user.id,
        name=applicant.name,
        cgpa=applicant.cgpa,
        test_score=applicant.test_score,
        target_college=applicant.target_college,
        major=applicant.major,
        resume_text=applicant.resume_text,
        admission_chance=admission_chance,
        reasoning=reasoning
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    return PredictionResponse(
        admission_chance=admission_chance,
        reasoning=reasoning,
        raw_prediction={"application_id": db_application.id}
    )


@router.get("/applications", summary="List all stored applications")
async def list_applications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all applications for the current user"""
    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return {"applications": applications, "count": len(applications)}


@router.get("/applications/{id}", summary="Get application by ID")
async def get_application(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific application by ID"""
    application = db.query(Application).filter(
        Application.id == id,
        Application.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return application
