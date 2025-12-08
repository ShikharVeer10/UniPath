from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from ..db.engine import get_db
from .. import crud
from ..schemas.auth_schema import SignUpIn,LoginIn,Token,UserOut

#import auth utils (create token)

try:
    from .. import auth as auth_utils
except Exception:
    auth_utils=None

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup",response_model=UserOut,status_code=status.HTTP_201_CREATED)
def signup(payload:SignUpIn,db:Session=Depends(get_db)):
    existing=crud.get_user_by_email(db,payload.email)
    if existing:
        raise HTTPException(status_code=400,detail="Email already registered")
    user=crud.create_user(db,email=payload.email,password=payload.password)
    return user

@router.post("/login",response_model=Token) #. It defines the route URL and HTTP method
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if auth_utils is None:
        raise HTTPException(status_code=500, detail="Auth utilities not available (create app/auth.py)")
    access_token = auth_utils.create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

