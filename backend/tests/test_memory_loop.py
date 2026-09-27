import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_memory_evolution_loop():
    # Step 1: User sign in to get valid token
    signin_res = client.post("/api/auth/signin", json={
        "email": "priya@company.com",
        "password": "password123"
    })
    assert signin_res.status_code == 200
    token = signin_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Reset demo memory to clean baseline
    reset_res = client.post("/api/demo/reset")
    assert reset_res.status_code == 200

    # Step 3: Add first interaction (SSO issue report)
    int1_res = client.post(
        "/api/accounts/acme-corp/interactions",
        json={
            "type": "support",
            "title": "Customer logged Ticket #4821 for Okta SSO failure",
            "content": "Acme Corp reported that Okta SSO authentication failed for 450 users with token expiration.",
            "sentiment": "negative",
            "importance": "high",
            "source": "Zendesk",
            "fact_type": "world_fact",
            "occurred_at": "2026-07-02"
        },
        headers=headers
    )
    assert int1_res.status_code == 200
    assert int1_res.json()["hindsight_retained"] is True

    # Step 4: Recall query and verify the memory exists
    recall1 = client.post(
        "/api/copilot/query",
        json={
            "account_id": "acme-corp",
            "query": "What problems has Acme had with SSO?",
            "mode": "recall",
            "include_cross_account": False
        },
        headers=headers
    )
    assert recall1.status_code == 200
    r1_data = recall1.json()
    assert r1_data["query_mode"] == "recall"
    assert len(r1_data["supporting_memories"]) >= 1

    # Step 5: Add second related interaction (QBR promise)
    int2_res = client.post(
        "/api/accounts/acme-corp/interactions",
        json={
            "type": "qbr",
            "title": "July QBR: Promised SAML v2.4 engineering fix",
            "content": "CSM and Engineering lead committed to delivering SAML SSO patch v2.4 before end of Q3.",
            "sentiment": "neutral",
            "importance": "high",
            "source": "Zoom QBR Notes",
            "fact_type": "experience_fact",
            "occurred_at": "2026-07-18"
        },
        headers=headers
    )
    assert int2_res.status_code == 200

    # Step 6: Add third interaction (unresolved escalation)
    int3_res = client.post(
        "/api/accounts/acme-corp/interactions",
        json={
            "type": "call",
            "title": "VP Engineering Escalation: SSO still broken",
            "content": "VP Engineering stated SAML token errors are still occurring and renewal is conditioned on fix.",
            "sentiment": "negative",
            "importance": "high",
            "source": "Gong Call",
            "fact_type": "experience_fact",
            "occurred_at": "2026-08-14"
        },
        headers=headers
    )
    assert int3_res.status_code == 200

    # Step 7: Recall again and verify evolved context
    recall2 = client.post(
        "/api/copilot/query",
        json={
            "account_id": "acme-corp",
            "query": "What did we promise Acme?",
            "mode": "recall",
            "include_cross_account": False
        },
        headers=headers
    )
    assert recall2.status_code == 200
    r2_data = recall2.json()
    assert len(r2_data["supporting_memories"]) >= 3

    # Step 8: Reflect query — test multi-memory reasoning & evidence
    reflect_res = client.post(
        "/api/copilot/query",
        json={
            "account_id": "acme-corp",
            "query": "What should I do before the renewal?",
            "mode": "reflect",
            "include_cross_account": True
        },
        headers=headers
    )
    assert reflect_res.status_code == 200
    ref_data = reflect_res.json()
    assert ref_data["query_mode"] == "reflect"
    assert ref_data["risk_level"] in ("high", "medium")
    assert len(ref_data["supporting_memories"]) >= 3
    assert len(ref_data["key_signals"]) >= 1
    assert ref_data["recommended_action"] != ""
    assert len(ref_data["memory_trace"]) == 5

    # Step 9: Verify Renewal Brief and Meeting Prep endpoints
    brief_res = client.get("/api/accounts/acme-corp/renewal-brief", headers=headers)
    assert brief_res.status_code == 200
    assert brief_res.json()["account_name"] == "Acme Corp"
    assert len(brief_res.json()["key_risks"]) >= 1

    prep_res = client.get("/api/accounts/acme-corp/meeting-prep", headers=headers)
    assert prep_res.status_code == 200
    assert len(prep_res.json()["what_to_ask"]) >= 1

    # Step 10: Verify Activity audit log
    act_res = client.get("/api/activity", headers=headers)
    assert act_res.status_code == 200
    assert len(act_res.json()) >= 1
