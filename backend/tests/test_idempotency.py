import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_interaction_write_idempotency():
    # 1. First write
    payload = {
        "type": "support_ticket",
        "title": "Idempotent Bug Report #999",
        "content": "Customer reported token timeout on login page.",
        "sentiment": "negative",
        "importance": "high",
        "fact_type": "world_fact",
        "occurred_at": "2026-08-01",
        "source": "Zendesk"
    }
    res1 = client.post("/api/accounts/acme-corp/interactions", json=payload)
    assert res1.status_code == 200
    int_id1 = res1.json()["id"]

    # 2. Immediate duplicate write (simulating double click)
    res2 = client.post("/api/accounts/acme-corp/interactions", json=payload)
    assert res2.status_code == 200
    int_id2 = res2.json()["id"]

    # Must return the same interaction ID rather than creating a duplicate row
    assert int_id1 == int_id2
