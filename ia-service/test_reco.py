from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    assert client.get("/health").status_code == 200

def test_reco():
    r = client.get("/recommendations?userId=demo")
    assert r.status_code == 200
    assert r.json()["userId"] == "demo"

def test_reco_post():
    payload = {
        "userId": "demo",
        "history": [{"trackId": "track-001", "playedAt": "2024-01-01T00:00:00Z"}],
        "favorites": [{"artistId": "artist-001"}],
        "artists": [{"id": "artist-001", "stageName": "MTL Artist"}],
        "tracks": [
            {"id": "track-001", "artistId": "artist-001", "genre": "rap", "playCount": 10}
        ],
    }
    r = client.post("/recommendations", json=payload)
    assert r.status_code == 200
    items = r.json()["items"]
    assert isinstance(items, list)
    assert len(items) > 0
