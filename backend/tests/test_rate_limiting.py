import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_rate_limiting():
    # Make multiple signin requests rapidly to trigger rate limiting
    hit_rate_limit = False
    for _ in range(25):
        res = client.post("/api/auth/signin", json={"email": "nonexistent@test.com", "password": "wrong"})
        if res.status_code == 429:
            hit_rate_limit = True
            assert "Rate limit exceeded" in res.json()["detail"]
            assert "Retry-After" in res.headers
            break
    assert hit_rate_limit
