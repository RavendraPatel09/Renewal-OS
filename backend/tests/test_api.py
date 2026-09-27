import asyncio
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.init_db import init_db
from app.services.hindsight_service import hindsight_service
from app.models.seed_data import (
    ACME_DEMO_MEMORIES,
    HISTORICAL_CHURN_MEMORIES,
    HISTORICAL_RENEWED_MEMORIES
)

@pytest.fixture(scope="module", autouse=True)
def setup_module():
    init_db()
    async def seed_hindsight():
        for mem in ACME_DEMO_MEMORIES + HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES:
            await hindsight_service.retain(
                account_id=mem["account_id"],
                content=mem["content"],
                metadata=mem
            )
    asyncio.run(seed_hindsight())

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert res.json()["database"] == "connected"

def test_auth_flow():
    # 1. Signin with default seed user
    login_res = client.post("/api/auth/signin", json={
        "email": "priya@company.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    # 2. Get profile with token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "priya@company.com"

    # 3. Invalid credentials test
    bad_login = client.post("/api/auth/signin", json={
        "email": "priya@company.com",
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 401

def test_accounts_api():
    res = client.get("/api/accounts")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 8
    
    # Check Acme
    acme_res = client.get("/api/accounts/acme-corp")
    assert acme_res.status_code == 200
    assert acme_res.json()["name"] == "Acme Corp"

def test_create_interaction_and_retain():
    payload = {
        "type": "support",
        "title": "SSO authentication repeated timeout",
        "content": "Customer VP Engineering reported users getting 504 on SAML login callback.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Zendesk",
        "fact_type": "experience_fact"
    }
    res = client.post("/api/accounts/acme-corp/interactions", json=payload)
    assert res.status_code == 200
    assert res.json()["hindsight_retained"] is True

    # Retrieve interactions
    list_res = client.get("/api/accounts/acme-corp/interactions")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

def test_copilot_recall_and_reflect():
    # Recall Mode (Factual)
    recall_res = client.post("/api/copilot/query", json={
        "account_id": "acme-corp",
        "query": "What did Acme report regarding SSO?",
        "mode": "recall"
    })
    assert recall_res.status_code == 200
    assert recall_res.json()["query_mode"] == "recall"

    # Reflect Mode (Reasoning)
    reflect_res = client.post("/api/copilot/query", json={
        "account_id": "acme-corp",
        "query": "Should I be concerned about Acme's renewal?",
        "mode": "reflect",
        "include_cross_account": True
    })
    assert reflect_res.status_code == 200
    data = reflect_res.json()
    assert data["query_mode"] == "reflect"
    assert data["risk_score"] > 0
    assert len(data["supporting_memories"]) > 0
    assert len(data["bank_directives"]) > 0

def test_feedback_api():
    res = client.post("/api/feedback", json={
        "rating": "excellent",
        "category": "copilot",
        "message": "The Hindsight reflection and observation evolution is super helpful for CSMs!",
        "email": "priya@company.com"
    })
    assert res.status_code == 200
    assert res.json()["rating"] == "excellent"

def test_demo_stages():
    # Reset
    reset_res = client.post("/api/demo/reset")
    assert reset_res.status_code == 200

    # Seed
    seed_res = client.post("/api/demo/seed")
    assert seed_res.status_code == 200
    assert seed_res.json()["memories_count"] > 0
