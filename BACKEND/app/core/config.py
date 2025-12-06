import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")

#OPEN-AI CONFIGURATION
OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")
OPENAI_MODEL=os.getenv("OPENAI_MODEL","gpt-4o-mini")

#JWT(Json Web Token) configuration
JWT_SECRET=os.getenv("JWT_SECRET","dev-secret")
JWT_ALGO=os.getenv("JWT_ALGO","HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))