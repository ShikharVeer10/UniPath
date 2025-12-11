# Generic CRUD base class for all database models
from typing import Generic,TypeVar,Type,List,Optional,Any,Dict
from sqlmodel import SQLModel,Session,Select,select
from pydantic import BaseModel

# Type variables: ModelType = DB model, CreateSchemaType/UpdateSchemaType = Pydantic schemas
ModelType=TypeVar("ModelType",bound=SQLModel)
CreateSchemaType=TypeVar("CreateSchemaType",bound=BaseModel)
UpdateSchemaType=TypeVar("UpdateSchemaType",bound=BaseModel)

class CRUDBase(Generic[ModelType,CreateSchemaType,UpdateSchemaType]):
    #Base class with common DB operations (Create, Read, Update, Delete)

    def __init__(self,model: Type[ModelType]):
     #Store the SQLModel class to operate on
        self.model=model
    
    def get(self,db:Session,id:Any)->Optional[ModelType]:
        #Get one record by primary key
        return db.get(self.model,id)
    
    def get_multi(self, db: Session, *, offset: int = 0, limit: int = 100) -> List[ModelType]:
        #Get multiple records with pagination
        statement = select(self.model).offset(offset).limit(limit)
        return db.exec(statement).all()

    def get_by(self, db: Session, **kwargs) -> Optional[ModelType]:
        #Get first record matching filters (e.g., email="user@example.com")
        statement = select(self.model)
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                statement = statement.where(getattr(self.model, key) == value)
        return db.exec(statement).first()

    def create(self, db: Session, *, obj_in: CreateSchemaType | dict) -> ModelType:
        #Create new record from Pydantic schema or dict
        data = obj_in.model_dump() if hasattr(obj_in, "dict") else dict(obj_in)
        db_obj = self.model(**data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)  # Reload from DB to get auto-generated fields
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict) -> ModelType:
        #Update existing record with new data
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)  # Only fields provided

        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)  # Update each field

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db: Session, *, id: Any) -> Optional[ModelType]:
        #Delete record by ID, returns deleted object or None
        obj = db.get(self.model, id)
        if not obj:
            return None

        db.delete(obj)
        db.commit()
        return obj

