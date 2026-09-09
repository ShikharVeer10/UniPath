import uuid
from typing import Generic,TypeVar,Type
from pydantic import BaseModel
from sqlmodel import SQLModel,select
from sqlalchemy.ext.asyncio import AsyncSession

ModelType=TypeVar("ModelType", bound=SQLModel)
CreateSchemaType=TypeVar("CreateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType,CreateSchemaType]):
    def __init__(self,model: Type[ModelType]):
        self.model=model #Constructor

    async def get(self,db: AsyncSession,id:uuid.UUID)->ModelType | None:
        statement=select(self.model).where(self.model.id==id)
        result=await db.execute(statement)
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip:int=0,limit:int=100) -> list[ModelType]:
        statement=select(self.model).offset(skip).limit(limit)
        result=await db.execute(statement)
        return list(result.scalars().all())
    #Fetches a paginated list of multiple records, offset(skip) tells the database to skip a specific number of rows,caps the maximum number of rows returned at one time and converts the db into a python list

    async def create(self,db:AsyncSession,obj_in:CreateSchemaType) -> ModelType:
        obj_data=obj_in.model_dump()
        db_obj=self.model(**obj_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self,db: AsyncSession, id:uuid.UUID) -> ModelType | None:
        obj=await self.get(db,id) #Finds the record to make sure it exists
        if obj: #If record is found
            await db.delete(obj) #Stages the deletion
            await db.commit() #Executes it 
        return obj #returns None    