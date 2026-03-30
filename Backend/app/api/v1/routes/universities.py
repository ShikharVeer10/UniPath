from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_universities() -> dict[str, str]:
    # TODO: Add filtering + pagination via service/repository layer.
    return {"todo": "implement university explorer listing"}
