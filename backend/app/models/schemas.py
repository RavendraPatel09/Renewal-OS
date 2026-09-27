from pydantic import BaseModel, Field
from typing import List, Optional

class CustomerAccount(BaseModel):
    id: str
    name: str
    tier: str = "Enterprise"
    renewal_days: int
    risk_score: int
    risk_level: str  # low, medium, high
    open_issues_count: int = 0
    unresolved_promises_count: int = 0
    recent_sentiment: str = "neutral"  # positive, neutral, negative, declining
    status: str = "active"  # active, renewed, churned
    mrr: int = 0
    csm_name: str = "Priya Sharma"

class InteractionMemory(BaseModel):
    id: str
    account_id: str
    interaction_type: str  # sales_call, meeting, qbr, support_ticket, email, product_feedback, renewal_call, internal_note
    date: str
    summary: str
    content: str
    sentiment: str  # positive, neutral, negative
    importance: str  # low, medium, high
    source: str = "Manual Entry"

class MemoryCreateRequest(BaseModel):
    account_id: str
    interaction_type: str
    date: str
    summary: str
    content: str
    sentiment: str = "neutral"
    importance: str = "medium"
    source: str = "Manual Entry"

class CopilotQueryRequest(BaseModel):
    account_id: Optional[str] = None
    query: str
    include_cross_account: bool = False
    demo_stage: Optional[int] = None  # 1, 2, 3 for demo mode logic

class BriefingResponse(BaseModel):
    summary: str
    risk_score: int
    risk_level: str
    key_concerns: List[str]
    open_promises: List[str]
    sentiment_trend: str
    historical_patterns: List[str]
    recommended_action: str
    supporting_memories: List[dict]
