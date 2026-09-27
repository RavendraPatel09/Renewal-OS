from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.db_models import Interaction
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/memories", tags=["memories"])

@router.get("")
async def get_memories(account_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    memories = await hindsight_service.recall(query="", account_id=account_id, limit=100)
    return memories

@router.get("/evolution/{account_id}")
async def get_memory_evolution(account_id: str):
    observations = hindsight_service.get_observations(account_id)
    world_facts = hindsight_service.get_world_facts(account_id)
    experience_facts = hindsight_service.get_experience_facts(account_id)
    raw_memories = await hindsight_service.recall(query="", account_id=account_id, limit=20)

    return {
        "account_id": account_id,
        "observations": observations,
        "world_facts": world_facts,
        "experience_facts": experience_facts,
        "raw_memories_count": len(raw_memories)
    }

@router.post("")
async def create_memory(req: dict):
    memory = await hindsight_service.retain(
        account_id=req.get("account_id", "acme-corp"),
        content=req.get("content", ""),
        metadata={
            "interaction_type": req.get("interaction_type", "meeting"),
            "fact_type": req.get("fact_type", "world_fact"),
            "occurred_at": req.get("date", "2026-08-15"),
            "date": req.get("date", "2026-08-15"),
            "title": req.get("summary", ""),
            "summary": req.get("summary", ""),
            "sentiment": req.get("sentiment", "neutral"),
            "importance": req.get("importance", "medium"),
            "source": req.get("source", "Manual Entry")
        }
    )
    return {
        "status": "success",
        "message": "Memory retained in Hindsight Bank",
        "memory": memory
    }
