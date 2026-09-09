from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.resume_parser_service import resume_parser_service, ParsedResumeData

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.post("/parse-resume", response_model=ParsedResumeData)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported for resume parsing."
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file size exceeds 10MB limit."
        )

    try:
        parsed_data = await resume_parser_service.parse_resume(content)
        return parsed_data
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse resume: {str(exc)}"
        )
