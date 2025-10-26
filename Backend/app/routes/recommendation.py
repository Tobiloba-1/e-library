from fastapi import APIRouter, Query
from typing import Optional
from app.services.book_recommender import get_books_for_personality

router = APIRouter()

@router.get("/")
def recommend(personality: Optional[str] = Query(None, description="personality type")):
    """
    Example call: /api/recommendation?personality=The%20Thinker
    """
    if not personality:
        return {"error": "personality query param is required."}
    books = get_books_for_personality(personality)
    return {"personality": personality, "books": books}
