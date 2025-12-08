from typing import List
from fastapi import APIRouter,Depends,HTTPException,status,Session
from ..db.engine import get_db
from .. import crud
from ..schemas.candidate_Schema import  CandidateCreate, CandidateUpdate, CandidateOut

try:
    from ..dependencies import get_current_user
except Exception:
    def get_current_user():
        raise HTTPException(status_code=501, reason="get_current_user() not yet implemented")
    
router=APIRouter(prefix="/candidates",tags=["Candidates"])

@router.get("/",response_model=List[CandidateOut])
def list_candidates(skip: int=0,limit: int=50,db:Session=Depends(get_db)):
    return crud.list_candidates(db, skip=skip, limit=limit)


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = crud.get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.post("/", response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
def create_candidate(
    payload: CandidateCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # any user can create a candidate
    return crud.create_candidate(
        db,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        resume_text=payload.resume_text
    )


@router.put("/{candidate_id}", response_model=CandidateOut)
def update_candidate(
    candidate_id: int,
    payload: CandidateUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    candidate = crud.get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return crud.update_candidate(db, candidate, **payload.dict(exclude_unset=True))


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    candidate = crud.get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    crud.delete_candidate(db, candidate)
    return None