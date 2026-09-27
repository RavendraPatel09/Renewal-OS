from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.init_db import init_db
from app.services.hindsight_service import hindsight_service
from app.models.db_models import Interaction, Account
from app.models.seed_data import (
    SYNTHETIC_ACCOUNTS,
    ACME_DEMO_MEMORIES,
    HISTORICAL_CHURN_MEMORIES,
    HISTORICAL_RENEWED_MEMORIES
)

from app.api.activity import record_audit_event

router = APIRouter(prefix="/api/demo", tags=["demo"])

@router.post("/reset")
async def reset_demo(db: Session = Depends(get_db)):
    hindsight_service.reset_memories()
    record_audit_event(
        db=db,
        event_type="demo_reset",
        title="Demo Environment Reset",
        description="Demo memory bank cleared for fresh scenario walkthrough.",
        account_id="acme-corp"
    )
    return {"status": "success", "message": "Demo state reset safely. Hindsight memory bank cleared."}

@router.post("/seed")
async def seed_demo(db: Session = Depends(get_db)):
    hindsight_service.reset_memories()
    init_db(db)
    
    # Ingest Acme memories
    for mem in ACME_DEMO_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )
        
    # Ingest Historical Churn memories
    for mem in HISTORICAL_CHURN_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )

    # Ingest Historical Renewed memories
    for mem in HISTORICAL_RENEWED_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )

    all_memories = await hindsight_service.recall(query="", limit=200)

    return {
        "status": "success",
        "message": "Demo environment ready",
        "accounts_count": len(SYNTHETIC_ACCOUNTS),
        "memories_count": len(all_memories),
        "renewal_histories": 6,
        "unresolved_signals": 23
    }

@router.post("/inject-acme-stage2")
async def inject_acme_stage2():
    for mem in ACME_DEMO_MEMORIES[:5]:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )
    return {"status": "success", "message": "5 Acme memories retained into Hindsight for Stage 2"}

@router.post("/inject-cross-account-stage3")
async def inject_cross_account_stage3():
    for mem in HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )
    return {"status": "success", "message": "Cross-account historical renewal memories retained for Stage 3"}
