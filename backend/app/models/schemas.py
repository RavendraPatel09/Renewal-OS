from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal, Dict, Any

# Authentication Schemas
class UserSignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = "Acme Workspace"

class UserSigninRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    company: Optional[str] = None
    created_at: Optional[str] = None

# Account & Contact Schemas
class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

class CommitmentResponse(BaseModel):
    id: str
    account_id: str
    description: str
    owner_name: str
    status: str  # open, completed, overdue, cancelled
    due_date: str
    created_at: Optional[str] = None

class CommitmentCreateRequest(BaseModel):
    description: str
    owner_name: Optional[str] = "Priya Sharma"
    status: str = "open"
    due_date: str

class AccountResponse(BaseModel):
    id: str
    workspace_id: Optional[str] = None
    name: str
    industry: str = "Enterprise Software"
    plan: str = "Enterprise"
    renewal_date: Optional[str] = "2026-09-30"
    renewal_days: int
    status: str  # healthy, attention, at_risk, renewed, churned
    risk_score: int
    risk_level: str  # low, medium, high
    open_issues_count: int = 0
    unresolved_promises_count: int = 0
    recent_sentiment: str = "neutral"
    mrr: int = 50000
    csm_name: str = "Priya Sharma"
    contacts: List[ContactResponse] = []
    commitments: List[CommitmentResponse] = []

# Alias for backwards compatibility
CustomerAccount = AccountResponse

class AccountCreateRequest(BaseModel):
    name: str
    industry: Optional[str] = "Enterprise Software"
    plan: Optional[str] = "Enterprise"
    renewal_days: Optional[int] = 30
    status: Optional[str] = "healthy"
    mrr: Optional[int] = 50000

# Interaction & Memory Schemas
class InteractionCreateRequest(BaseModel):
    type: str  # email, call, meeting, qbr, support, note, product_feedback, renewal
    title: str
    content: str
    occurred_at: Optional[str] = None  # defaults to current date e.g. 2026-08-15
    sentiment: Optional[str] = "neutral"  # positive, neutral, negative
    importance: Optional[str] = "medium"  # low, medium, high
    source: Optional[str] = "Manual Entry"
    fact_type: Optional[str] = "world_fact"  # world_fact, experience_fact

class InteractionResponse(BaseModel):
    id: str
    account_id: str
    type: str
    title: str
    content: str
    sentiment: str
    importance: str
    occurred_at: str
    source: str
    fact_type: str
    hindsight_retained: bool = False
    hindsight_memory_id: Optional[str] = None

# Hindsight Memory Models
class ObservationResponse(BaseModel):
    id: str
    account_id: str
    title: str
    description: str
    evidence_count: int
    first_detected: str
    last_confirmed: str
    status: str
    supporting_memory_ids: List[str] = []

class TemporalStepResponse(BaseModel):
    days_ago: str
    status_color: str
    label: str
    description: str
    trigger_memory_id: Optional[str] = None

class KnowledgeGraphNode(BaseModel):
    id: str
    label: str
    type: str

class KnowledgeGraphLink(BaseModel):
    source: str
    target: str
    label: str

class KnowledgeGraphResponse(BaseModel):
    nodes: List[KnowledgeGraphNode]
    links: List[KnowledgeGraphLink]

# Copilot Request & Response
class CopilotQueryRequest(BaseModel):
    account_id: Optional[str] = "acme-corp"
    query: str
    mode: Literal["recall", "reflect"] = "reflect"  # recall for factual, reflect for reasoning
    include_cross_account: bool = False
    demo_stage: Optional[int] = None

class CopilotQueryResponse(BaseModel):
    query_mode: str  # recall or reflect
    summary: str
    risk_score: int
    risk_level: str
    observations: List[ObservationResponse] = []
    world_facts: List[str] = []
    experience_facts: List[str] = []
    key_concerns: List[str] = []
    open_promises: List[str] = []
    sentiment_trend: str = "stable"
    historical_patterns: List[str] = []
    recommended_action: str
    supporting_memories: List[Dict[str, Any]] = []
    bank_mission: str
    bank_directives: List[str]
    hindsight_status: str = "connected"

# Feedback Schema
class FeedbackCreateRequest(BaseModel):
    rating: str  # excellent, good, okay, poor
    category: Optional[str] = "general"
    message: str
    email: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    rating: str
    category: str
    message: str
    created_at: str
