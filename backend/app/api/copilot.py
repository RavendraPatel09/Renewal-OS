from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.schemas import CopilotQueryRequest, CopilotQueryResponse
from app.services.agent_service import agent_service
from app.api.activity import record_audit_event

router = APIRouter(prefix="/api/copilot", tags=["copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
async def query_copilot(req: CopilotQueryRequest, db: Session = Depends(get_db)):
    account_id = req.account_id or "acme-corp"
    briefing = await agent_service.generate_renewal_briefing(
        account_id=account_id,
        query=req.query,
        mode=req.mode,
        include_cross_account=req.include_cross_account,
        demo_stage=req.demo_stage
    )
    
    event_type = "memory_recalled" if req.mode == "recall" else "reflect_completed"
    title = f"Hindsight {req.mode.upper()}: {req.query[:45]}..."
    desc = f"Processed {req.mode.upper()} query with {len(briefing.get('supporting_memories', []))} supporting memories."
    record_audit_event(
        db=db,
        event_type=event_type,
        title=title,
        description=desc,
        account_id=account_id
    )

    return briefing

