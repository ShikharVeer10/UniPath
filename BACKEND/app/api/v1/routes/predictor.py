from fastapi import APIRouter

router = APIRouter()


@router.post("/admit")
def predict_admit() -> dict[str, str]:
    # TODO: Implement blended model (similarity + weighted score).
    return {"todo": "implement admit predictor endpoint"}
