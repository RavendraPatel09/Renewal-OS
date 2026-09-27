from fastapi import APIRouter
from app.services.hindsight_service import hindsight_service
from app.models.seed_data import SYNTHETIC_ACCOUNTS, ACME_DEMO_MEMORIES, HISTORICAL_CHURN_MEMORIES, HISTORICAL_RENEWED_MEMORIES

router = APIRouter(prefix="/demo", tags=["demo"])

@router.post("/reset")
async def reset_demo():
    hindsight_service.reset_memories()
    return {"status": "success", "message": "Demo state reset. Memories cleared."}

@router.post("/seed")
async def seed_demo():
    hindsight_service.reset_memories()
    
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
    return {"status": "success", "message": "5 Acme memories injected for Stage 2"}

@router.post("/inject-cross-account-stage3")
async def inject_cross_account_stage3():
    for mem in HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )
    return {"status": "success", "message": "Cross-account historical renewal memories injected for Stage 3"}
