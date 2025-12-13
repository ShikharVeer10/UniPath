from fastapi import FastAPI
from .routers import auth, candidates

app = FastAPI()

app.include_router(auth.router)
app.include_router(candidates.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
