from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# @app.get("/api/books/recommend/{personality_type}")
# def recommend_books(personality_type: str):
#     recommendations = {
#         "The Thinker": [
#             {
#                 "title": "Thinking, Fast and Slow",
#                 "author": "Daniel Kahneman",
#                 "link": "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow"
#             },
#             {
#                 "title": "The Art of Thinking Clearly",
#                 "author": "Rolf Dobelli",
#                 "link": "https://www.goodreads.com/book/show/16248196-the-art-of-thinking-clearly"
#             },
#             {
#                 "title": "Predictably Irrational",
#                 "author": "Dan Ariely",
#                 "link": "https://www.goodreads.com/book/show/1713426.Predictably_Irrational"
#             },
#             {
#                 "title": "Superforecasting",
#                 "author": "Philip E. Tetlock",
#                 "link": "https://www.goodreads.com/book/show/23995360-superforecasting"
#             },
#         ],
#         "The Explorer": [
#             {
#                 "title": "Into the Wild",
#                 "author": "Jon Krakauer",
#                 "link": "https://www.goodreads.com/book/show/1845.Into_the_Wild"
#             },
#             {
#                 "title": "The Alchemist",
#                 "author": "Paulo Coelho",
#                 "link": "https://www.goodreads.com/book/show/865.The_Alchemist"
#             },
#             {
#                 "title": "Eat Pray Love",
#                 "author": "Elizabeth Gilbert",
#                 "link": "https://www.goodreads.com/book/show/19501.Eat_Pray_Love"
#             },
#             {
#                 "title": "Wild",
#                 "author": "Cheryl Strayed",
#                 "link": "https://www.goodreads.com/book/show/12262741-wild"
#             },
#         ],
#         "The Dreamer": [
#             {
#                 "title": "Big Magic",
#                 "author": "Elizabeth Gilbert",
#                 "link": "https://www.goodreads.com/book/show/24453082-big-magic"
#             },
#             {
#                 "title": "The War of Art",
#                 "author": "Steven Pressfield",
#                 "link": "https://www.goodreads.com/book/show/1319.The_War_of_Art"
#             },
#             {
#                 "title": "Steal Like an Artist",
#                 "author": "Austin Kleon",
#                 "link": "https://www.goodreads.com/book/show/13099738-steal-like-an-artist"
#             },
#             {
#                 "title": "The Artist's Way",
#                 "author": "Julia Cameron",
#                 "link": "https://www.goodreads.com/book/show/615570.The_Artist_s_Way"
#             },
#         ],
#         "The Strategist": [
#             {
#                 "title": "The 48 Laws of Power",
#                 "author": "Robert Greene",
#                 "link": "https://www.goodreads.com/book/show/1303.The_48_Laws_of_Power"
#             },
#             {
#                 "title": "Good Strategy Bad Strategy",
#                 "author": "Richard Rumelt",
#                 "link": "https://www.goodreads.com/book/show/11721966-good-strategy-bad-strategy"
#             },
#             {
#                 "title": "The Art of War",
#                 "author": "Sun Tzu",
#                 "link": "https://www.goodreads.com/book/show/10534.The_Art_of_War"
#             },
#             {
#                 "title": "Measure What Matters",
#                 "author": "John Doerr",
#                 "link": "https://www.goodreads.com/book/show/39286958-measure-what-matters"
#             },
#         ],
#         "General": [
#             {
#                 "title": "Atomic Habits",
#                 "author": "James Clear",
#                 "link": "https://www.goodreads.com/book/show/40121378-atomic-habits"
#             },
#             {
#                 "title": "Mindset",
#                 "author": "Carol Dweck",
#                 "link": "https://www.goodreads.com/book/show/40745.Mindset"
#             },
#             {
#                 "title": "Deep Work",
#                 "author": "Cal Newport",
#                 "link": "https://www.goodreads.com/book/show/25744928-deep-work"
#             },
#             {
#                 "title": "The Power of Now",
#                 "author": "Eckhart Tolle",
#                 "link": "https://www.goodreads.com/book/show/6708.The_Power_of_Now"
#             },
#         ],
#     }

#     return {"books": recommendations.get(personality_type, recommendations["General"])}
