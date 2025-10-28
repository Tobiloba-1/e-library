from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routes import auth 

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from .models.user import User
from pydantic import BaseModel
import hashlib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth script starts here
# create DB tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Request Schemas
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/register")
def register_user(user: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registration successful", "user": new_user.username}


@app.post("/api/login")
def login_user(user: LoginRequest, db: Session = Depends(get_db)):
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = db.query(User).filter(User.email == user.email, User.password == hashed_password).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user": db_user.username}
# Auth script ends here.



class QuizAnswers(BaseModel):
    answers: dict


@app.post("/api/personality/submit")
def process_quiz(quiz: QuizAnswers):
    answers = quiz.answers

    # Initialize score categories
    score = {"thinker": 0, "explorer": 0, "dreamer": 0, "strategist": 0}

    # Scoring logic for each question
    for q, ans in answers.items():
        if q == "q1":
            if ans == "Analyze it logically":
                score["thinker"] += 1
            elif ans == "Look for creative alternatives":
                score["explorer"] += 1
            elif ans == "Ask others for input":
                score["dreamer"] += 1
            elif ans == "Trust my intuition":
                score["strategist"] += 1

        elif q == "q2":
            if ans == "I like structure and clear plans":
                score["strategist"] += 1
            elif ans == "I thrive in spontaneous environments":
                score["explorer"] += 1
            elif ans == "I enjoy leading and organizing":
                score["thinker"] += 1
            elif ans == "I prefer exploring and experimenting":
                score["dreamer"] += 1

        elif q == "q3":
            if ans == "Data-driven":
                score["thinker"] += 1
            elif ans == "Gut feeling":
                score["strategist"] += 1
            elif ans == "Discussing with people":
                score["dreamer"] += 1
            elif ans == "Visualizing future outcomes":
                score["explorer"] += 1

        elif q == "q4":
            if ans == "Achieving goals efficiently":
                score["thinker"] += 1
            elif ans == "Discovering new ideas":
                score["explorer"] += 1
            elif ans == "Inspiring others":
                score["dreamer"] += 1
            elif ans == "Turning dreams into reality":
                score["strategist"] += 1

        elif q == "q5":
            if ans == "Clear and factual":
                score["thinker"] += 1
            elif ans == "Empathetic and expressive":
                score["dreamer"] += 1
            elif ans == "Strategic and persuasive":
                score["strategist"] += 1
            elif ans == "Casual and flexible":
                score["explorer"] += 1

        elif q == "q6":
            if ans == "The planner":
                score["strategist"] += 1
            elif ans == "The creative thinker":
                score["explorer"] += 1
            elif ans == "The motivator":
                score["dreamer"] += 1
            elif ans == "The problem solver":
                score["thinker"] += 1

        elif q == "q7":
            if ans == "Stay calm and adapt":
                score["strategist"] += 1
            elif ans == "Think of a new creative route":
                score["explorer"] += 1
            elif ans == "Reassess the plan carefully":
                score["thinker"] += 1
            elif ans == "Take a break to rethink":
                score["dreamer"] += 1

        elif q == "q8":
            if ans == "Growth and mastery":
                score["thinker"] += 1
            elif ans == "Freedom and creativity":
                score["explorer"] += 1
            elif ans == "Stability and clarity":
                score["strategist"] += 1
            elif ans == "Impact and innovation":
                score["dreamer"] += 1

    # Identify dominant personality type
    personality_type = max(score, key=score.get).title()
    type_map = {
        "Thinker": "The Thinker",
        "Explorer": "The Explorer",
        "Dreamer": "The Dreamer",
        "Strategist": "The Strategist",
    }

    return {"type": type_map.get(personality_type, "General"), "score": score}

import requests

@app.get("/api/books/recommend/{personality_type}")
def recommend_books(personality_type: str):
    search_map = {
        "The Thinker": "psychology logical thinking",
        "The Explorer": "adventure discovery travel",
        "The Dreamer": "creativity imagination inspiration",
        "The Strategist": "strategy leadership planning",
        "General": "personal development self improvement"
    }

    query = search_map.get(personality_type, "personal development")
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=10"

    response = requests.get(url)
    data = response.json()

    books = []
    if "items" in data:
        for item in data["items"]:
            info = item["volumeInfo"]
            books.append({
                "title": info.get("title"),
                "author": ", ".join(info.get("authors", [])),
                "link": info.get("infoLink"),
                "thumbnail": info.get("imageLinks", {}).get("thumbnail")
            })

    return {"books": books}

@app.get("/api/books/search/{category}")
def search_books(category: str):
    url = f"https://www.googleapis.com/books/v1/volumes?q={category}&maxResults=20"
    response = requests.get(url)
    data = response.json()
    books = [
        {
            "title": item["volumeInfo"].get("title", "Unknown Title"),
            "author": ", ".join(item["volumeInfo"].get("authors", ["Unknown Author"])),
            "link": item["volumeInfo"].get("infoLink", "#"),
        }
        for item in data.get("items", [])
    ]
    return {"books": books}

# this is for the authentication
app.include_router(auth.router, prefix="/api")

