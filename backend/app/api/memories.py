from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import MemoryCreateRequest
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/memories", tags=["memories"])

@router.get("")
async def get_memories(account_id: Optional[str] = None):
    memories = await hindsight_service.recall(query="", account_id=account_id, limit=100)
    return memories

@router.post("")
async def create_memory(req: MemoryCreateRequest):
    memory = await hindsight_service.retain(
        account_id=req.account_id,
        content=req.content,
        metadata={
            "interaction_type": req.interaction_type,
            "date": req.date,
            "summary": req.summary,
            "sentiment": req.sentiment,
            "importance": req.importance,
            "source": req.source
        }
    )
    return {
        "status": "success",
        "message": "Memory stored in Hindsight",
        "memory": memory
    }
