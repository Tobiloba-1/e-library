from fastapi import APIRouter
from pydantic import BaseModel
from app.services.personality_engine import compute_personality

router = APIRouter()

class QuizSubmission(BaseModel):
    answers: dict  # example: {"q1": "A", "q2": "B", ...}

@router.post("/submit")
def submit_quiz(payload: QuizSubmission):
    # compute_personality returns e.g. {"type": "The Thinker", "score": {...}}
    result = compute_personality(payload.answers)
    return result
