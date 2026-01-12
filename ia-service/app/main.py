from collections import Counter, defaultdict
from datetime import datetime, timezone
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="MTLVibes IA Service", version="0.1.0")

class RecommendationItem(BaseModel):
    type: str
    id: str
    score: float
    reason: str

class HistoryItem(BaseModel):
    trackId: str
    playedAt: str

class FavoriteArtist(BaseModel):
    artistId: str

class ArtistPayload(BaseModel):
    id: str
    stageName: Optional[str] = None

class TrackPayload(BaseModel):
    id: str
    artistId: str
    genre: Optional[str] = ""
    playCount: Optional[float] = 0

class RecommendationRequest(BaseModel):
    userId: str
    history: List[HistoryItem] = []
    favorites: List[FavoriteArtist] = []
    artists: List[ArtistPayload] = []
    tracks: List[TrackPayload] = []

@app.get("/health")
def health():
    return {"status": "ok", "service": "ia"}

@app.get("/recommendations")
def recommendations(userId: str = "demo"):
    items: List[RecommendationItem] = [
        RecommendationItem(
            type="track",
            id="track-001",
            score=0.92,
            reason="Mock recommendation",
        ),
        RecommendationItem(
            type="track",
            id="track-002",
            score=0.88,
            reason="Mock recommendation",
        ),
        RecommendationItem(
            type="artist",
            id="artist-010",
            score=0.84,
            reason="Mock recommendation",
        ),
    ]
    return {"userId": userId, "items": [i.model_dump() for i in items], "model": "mock-cf"}

@app.post("/recommendations")
def recommendations_from_profile(payload: RecommendationRequest):
    track_by_id = {track.id: track for track in payload.tracks}
    artist_tracks = defaultdict(list)
    for track in payload.tracks:
        artist_tracks[track.artistId].append(track)

    artist_listen_counts = Counter()
    genre_counts = Counter()
    recent_entries = []
    for entry in payload.history:
        track = track_by_id.get(entry.trackId)
        if not track:
            continue
        played_at = None
        weight = 1.0
        try:
            played_at = datetime.fromisoformat(entry.playedAt.replace("Z", "+00:00"))
            days_ago = max(
                0.0,
                (datetime.now(timezone.utc) - played_at).total_seconds() / 86400,
            )
            weight = max(0.1, 0.9 ** (days_ago / 7))
        except ValueError:
            pass
        if played_at:
            recent_entries.append((played_at, entry.trackId))
        artist_listen_counts[track.artistId] += weight
        if track.genre:
            genre_counts[track.genre.lower()] += weight

    favorite_artist_ids = {fav.artistId for fav in payload.favorites}
    top_genres = {genre for genre, _ in genre_counts.most_common(3)}

    scores = {}
    reasons = defaultdict(list)

    def add_score(key, amount, reason):
        scores[key] = scores.get(key, 0) + amount
        reasons[key].append(reason)

    for artist_id in favorite_artist_ids:
        add_score(("artist", artist_id), 3.0, "Artiste favori")

    for artist_id, count in artist_listen_counts.items():
        add_score(("artist", artist_id), 2.0 * count, "Ecoutes recentes")

    for artist_id, tracks in artist_tracks.items():
        popularity = sum(track.playCount or 0 for track in tracks) * 0.5
        if popularity:
            add_score(("artist", artist_id), popularity, "Popularite globale")

    recent_entries.sort(key=lambda item: item[0], reverse=True)
    recent_track_ids = {track_id for _, track_id in recent_entries[:20]}

    for track in payload.tracks:
        if track.id in recent_track_ids:
            continue
        if track.artistId in favorite_artist_ids:
            add_score(("track", track.id), 3.0, "Artiste favori")
        if track.artistId in artist_listen_counts:
            add_score(("track", track.id), 2.0 * artist_listen_counts[track.artistId], "Ecoutes recentes")
        if track.genre and track.genre.lower() in top_genres:
            add_score(("track", track.id), 1.0, "Genre frequent")
        popularity = (track.playCount or 0) * 0.5
        if popularity:
            add_score(("track", track.id), popularity, "Popularite globale")

    max_score = max(scores.values(), default=0.0) or 1.0
    items = []
    for (item_type, item_id), score in scores.items():
        reason = ", ".join(reasons[(item_type, item_id)])
        normalized = round((score / max_score) * 10, 2)
        items.append(
            RecommendationItem(type=item_type, id=item_id, score=normalized, reason=reason)
        )

    items.sort(key=lambda item: item.score, reverse=True)
    results = []
    per_artist = Counter()
    per_genre = Counter()
    for item in items:
        if item.type == "track":
            track = track_by_id.get(item.id)
            if track:
                if per_artist[track.artistId] >= 2:
                    continue
                if track.genre and per_genre[track.genre.lower()] >= 4:
                    continue
                per_artist[track.artistId] += 1
                if track.genre:
                    per_genre[track.genre.lower()] += 1
        results.append(item)
        if len(results) >= 10:
            break

    return {"items": [item.model_dump() for item in results]}
