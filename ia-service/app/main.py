from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="MTLVibes IA Service", version="0.1.0")

class RecommendationItem(BaseModel):
    type: str
    id: str
    score: float

@app.get("/health")
def health():
    return {"status": "ok", "service": "ia"}

@app.get("/recommendations")
def recommendations(userId: str = "demo"):
    items: List[RecommendationItem] = [
        RecommendationItem(type="track", id="track-001", score=0.92),
        RecommendationItem(type="track", id="track-002", score=0.88),
        RecommendationItem(type="artist", id="artist-010", score=0.84),
    ]
    return {"userId": userId, "items": [i.model_dump() for i in items], "model": "mock-cf"}
