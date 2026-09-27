import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.hindsight_service import hindsight_service
from app.db.session import SessionLocal
from app.models.db_models import Account

client = TestClient(app)

@pytest.mark.anyio
async def test_account_deletion_and_memory_purge():
    # 1. Sign up user to obtain auth token
    signup_res = client.post("/api/auth/signup", json={
        "name": "Audit User",
        "email": "delete-test-unique@company.com",
        "password": "password123",
        "company": "Audit Corp"
    })
    token = signup_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a temporary account in DB
    db = SessionLocal()
    temp_acc = Account(
        id="temp-delete-corp",
        name="Temp Delete Corp",
        tier="Enterprise",
        renewal_days=30,
        risk_score=50,
        risk_level="medium",
        status="active",
        mrr=5000,
        csm_name="Priya Sharma"
    )
    db.add(temp_acc)
    db.commit()
    db.close()

    # 3. Ingest interaction memory
    client.post("/api/accounts/temp-delete-corp/interactions", json={
        "type": "meeting",
        "title": "Purge Test Meeting",
        "content": "This note must be purged upon deletion.",
        "sentiment": "neutral",
        "importance": "high"
    })

    # 4. Request deletion of account
    del_res = client.delete("/api/accounts/temp-delete-corp", headers=headers)
    assert del_res.status_code == 200
    assert "deleted" in del_res.json()["message"]

    # 5. Verify Account is gone from database
    get_res = client.get("/api/accounts/temp-delete-corp")
    assert get_res.status_code == 404

    # 6. Verify Hindsight memory store purged account memories
    acc_mems = await hindsight_service.recall(query="", account_id="temp-delete-corp")
    assert len(acc_mems) == 0
