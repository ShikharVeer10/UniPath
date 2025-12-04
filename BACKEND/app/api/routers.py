from fastapi import APIRouter, HTTPException,UploadFile,File
from typing import Optional

from app.models.schemas import  ApplicantData,PredictionResponse

from app.services.predictor_services import get_prediction_and_store
from app.services.db_service import get_all_applications, get_application_by_id

from app.core.utils import extract_text_from_bytes

#Creating a router for all prediction related endpoints
router=APIRouter(tags=["Prediction"])

#POST -- # POST: create a new prediction entry in the system
@router.post("/predict",
             response_model=PredictionResponse,
             summary="Predicts the admission chance using a Resume",
)
async def predict_with_resume(
    name:str,
    cgpa:float,
    file:UploadFile=File(...),
    test_score:Optional[float]=None,
    target_college:Optional[str]=None,
    major:Optional[str]=None,
):
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400,detail="Resume must be in a PDF format")
    
    pdf_bytes=await file.read()

    resume_text=extract_text_from_bytes(pdf_bytes)

    applicant=ApplicantData(
        name=name,
        cgpa=cgpa,
        test_score=test_score,
        target_college=target_college,
        major=major,
        resume_text=resume_text,
    )

    return await predict_admission(applicant)



#GET /applications 
@router.get("/applications",summary="List all stored applications")
async def all_applications():
    return await get_all_applications()

#GET /applications/{id}
@router.get("/applications/{id}",summary="Get application by ID")

async def application_by_id(id:int):
    doc=await get_application_by_id(id)
    if not doc:
        raise HTTPException(status_code=404,detail="Application not found")
    return doc
