import os
from typing import Optional

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

_MONGO_URI = (
	os.getenv("DATABASE_URL")
	or os.getenv("MONGODB_URI")
	or "mongodb://localhost:27017"
)
_MONGO_DB = os.getenv("MONGODB_DB") or os.getenv("DATABASE_NAME") or "unipath"

client: Optional[MongoClient] = None


def get_client() -> MongoClient:
	global client
	if client is None:
		client = MongoClient(_MONGO_URI)
	return client


def get_db():
	return get_client()[_MONGO_DB]


def ping() -> bool:
	try:
		get_client().admin.command("ping")
		return True
	except ConnectionFailure:
		return False


if __name__ == "__main__":
	ok = ping()
	print(
		{
			"uri": _MONGO_URI,
			"db": _MONGO_DB,
			"status": "ok" if ok else "failed",
		}
	)