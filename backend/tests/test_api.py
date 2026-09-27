import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_accounts():
    response = client.get("/accounts")
    assert response.status_code == 200
    assert len(response.json()) >= 8

def test_get_acme_account():
    response = client.get("/accounts/acme-corp")
    assert response.status_code == 200
    assert response.json()["name"] == "Acme Corp"

def test_memory_ingestion_and_recall():
    payload = {
        "account_id": "acme-corp",
        "interaction_type": "email",
        "date": "2026-08-25",
        "summary": "Followup email on pricing renewal",
        "content": "Customer asked if volume discount can be applied.",
        "sentiment": "neutral",
        "importance": "medium",
        "source": "Gmail"
    }
    res = client.post("/memories", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "success"

    rec_res = client.get("/memories?account_id=acme-corp")
    assert rec_res.status_code == 200
    assert len(rec_res.json()) >= 1

def test_copilot_query():
    query_payload = {
        "account_id": "acme-corp",
        "query": "Prepare me for Acme's renewal",
        "include_cross_account": True
    }
    res = client.post("/copilot/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "recommended_action" in data
    assert len(data["supporting_memories"]) > 0

def test_demo_reset_and_inject():
    reset_res = client.post("/demo/reset")
    assert reset_res.status_code == 200
    
    stage1_query = client.post("/copilot/query", json={"account_id": "acme-corp", "query": "Prepare me for Acme's renewal", "demo_stage": 1})
    assert stage1_query.json()["risk_score"] == 50

    inject_res = client.post("/demo/inject-acme-stage2")
    assert inject_res.status_code == 200

    stage2_query = client.post("/copilot/query", json={"account_id": "acme-corp", "query": "Prepare me for Acme's renewal", "demo_stage": 2})
    assert stage2_query.json()["risk_score"] > 50
