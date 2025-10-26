import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")  # optional

# personality -> keywords mapping (tweak the keywords)
PERSONALITY_KEYWORDS = {
    "The Thinker": ["philosophy", "psychology", "strategy"],
    "The Explorer": ["travel", "adventure", "biography"],
    "The Dreamer": ["fiction", "creativity", "art"],
    "The Strategist": ["business", "productivity", "leadership"],
    "General": ["bestsellers", "popular"]
}

def build_query(keywords: list, max_results: int = 10) -> str:
    q = "+".join(keywords)
    return f"https://www.googleapis.com/books/v1/volumes?q={q}&maxResults={max_results}"

def get_books_for_personality(personality: str):
    keywords = PERSONALITY_KEYWORDS.get(personality, PERSONALITY_KEYWORDS["General"])
    url = build_query(keywords)
    if GOOGLE_API_KEY:
        url += f"&key={GOOGLE_API_KEY}"
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url)
            resp.raise_for_status()
            data = resp.json()
            items = []
            for it in data.get("items", []):
                vi = it.get("volumeInfo", {})
                items.append({
                    "title": vi.get("title"),
                    "authors": vi.get("authors"),
                    "description": vi.get("description"),
                    "thumbnail": vi.get("imageLinks", {}).get("thumbnail"),
                    "previewLink": vi.get("previewLink"),
                    "infoLink": vi.get("infoLink")
                })
            return items
    except Exception as e:
        # in production, log properly
        return {"error": "failed to fetch", "details": str(e)}
