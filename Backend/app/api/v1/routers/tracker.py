import uuid
from griffe import patch_loggers
from fastapi import APIRouter,Depends,HTTPException,status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from typing import List,Optional

from app.db.database import get_db
from app.models.application import ApplicationTracker
from app.models.university_model import University

router=APIRouter(prefix="/tracker",tags=["Application Tracker"])

class TrackerCreateRequest(BaseModel):
    user_identifier:str
    university_id:uuid.UUID
    status:Optional[str]="Shortlisted"
    target_term: Optional[str] = None
    deadline:Optional[str]=None
    notes:Optional[str]=None

class TrackerUpdateRequest(BaseModel):
    status:Optional[str]=None
    target_term:Optional[str]=None
    deadline:Optional[str]=None
    notes:Optional[str]=None

class TrackerResponse(BaseModel):
    id:int
    user_identifier:str
    university_id:uuid.UUID
    university_name:Optional[str]=None
    status:str
    target_term:str
    deadline:Optional[str]
    notes:Optional[str]

@router.post("/",response_model=TrackerResponse,status_code=status.HTTP_201_CREATED)
async def add_to_tracker(payload:TrackerCreateRequest,db:AsyncSession=Depends(get_db)):
    uni=await db.get(University,payload.university_id)
    if not uni:
        raise HTTPException(status_code=404,detail="University not found")

    tracker_kwargs={
        "user_identifier":payload.user_identifier,
        "university_id":payload.university_id,
        "status":payload.status,
        "deadline":payload.deadline,
        "notes":payload.notes
    }
    if payload.target_term:
        tracker_kwargs["target_term"]=payload.target_term
    
    tracker_item=ApplicationTracker(**tracker_kwargs)
    db.add(tracker_item)
    await db.commit()
    await db.refresh(tracker_item)

    return TrackerResponse(
        id=tracker_item.id,
        user_identifier=tracker_item.user_identifier,
        university_id=tracker_item.university_id,
        university_name=uni.name,
        status=tracker_item.status,
        target_term=tracker_item.target_term,
        deadline=tracker_item.deadline,
        notes=tracker_item.notes
    )


@router.get("/{user_identifier}", response_model=List[TrackerResponse])
async def get_user_tracker(user_identifier: str, db: AsyncSession = Depends(get_db)):
    statement = select(ApplicationTracker).where(ApplicationTracker.user_identifier == user_identifier)
    result = await db.execute(statement)
    items = result.scalars().all()

    response_list = []
    for item in items:
        uni = await db.get(University, item.university_id)
        response_list.append(
            TrackerResponse(
                id=item.id,
                user_identifier=item.user_identifier,
                university_id=item.university_id,
                university_name=uni.name if uni else "Unknown University",
                status=item.status,
                target_term=item.target_term,
                deadline=item.deadline,
                notes=item.notes
            )
        )
    return response_list

@router.patch("/{tracker_id}", response_model=TrackerResponse)
async def update_tracker_item(tracker_id: int, payload: TrackerUpdateRequest, db: AsyncSession = Depends(get_db)):
    item = await db.get(ApplicationTracker, tracker_id)
    if not item:
        raise HTTPException(status_code=404, detail="Tracker entry not found")

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.add(item)
    await db.commit()
    await db.refresh(item)

    uni = await db.get(University, item.university_id)
    return TrackerResponse(
        id=item.id,
        user_identifier=item.user_identifier,
        university_id=item.university_id,
        university_name=uni.name if uni else "Unknown University",
        status=item.status,
        target_term=item.target_term,
        deadline=item.deadline,
        notes=item.notes
    )

@router.delete("/{tracker_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tracker_item(tracker_id: int, db: AsyncSession = Depends(get_db)):
    item = await db.get(ApplicationTracker, tracker_id)
    if not item:
        raise HTTPException(status_code=404, detail="Tracker entry not found")

    await db.delete(item)
    await db.commit()
    return None
