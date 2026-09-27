from fastapi import APIRouter
from app.models.schemas import CopilotQueryRequest, BriefingResponse
from app.services.agent_service import agent_service

router = APIRouter(prefix="/copilot", tags=["copilot"])

@router.post("/query", response_model=BriefingResponse)
async def query_copilot(req: CopilotQueryRequest):
    account_id = req.account_id or "acme-corp"
    briefing = await agent_service.generate_renewal_briefing(
        account_id=account_id,
        query=req.query,
        include_cross_account=req.include_cross_account,
        demo_stage=req.demo_stage
    )
    return briefing
