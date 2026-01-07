from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    assert client.get("/health").status_code == 200

def test_reco():
    r = client.get("/recommendations?userId=demo")
    assert r.status_code == 200
    assert r.json()["userId"] == "demo"
