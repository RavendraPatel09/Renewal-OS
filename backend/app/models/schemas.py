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

# Meeting Notes & Brief Schemas
class MeetingNotesCreateRequest(BaseModel):
    title: str
    date: Optional[str] = None
    participants: Optional[str] = None
    notes: str

# Hindsight Memory Models
class EvolutionStage(BaseModel):
    date: str
    label: str
    detail: str
    memory_id: Optional[str] = None

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
    agent_understanding: Optional[str] = None
    suggested_action: Optional[str] = None
    conflicting_evidence: Optional[str] = None
    related_entities: List[str] = []
    evolution_stages: List[EvolutionStage] = []

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

class MemoryTraceStep(BaseModel):
    step: str
    description: str
    status: str = "completed"

class CopilotQueryResponse(BaseModel):
    query_mode: str  # recall or reflect
    summary: str
    risk_score: int
    risk_level: str
    key_signals: List[str] = []
    observations: List[ObservationResponse] = []
    world_facts: List[str] = []
    experience_facts: List[str] = []
    key_concerns: List[str] = []
    open_promises: List[str] = []
    open_commitments: List[Dict[str, Any]] = []
    sentiment_trend: str = "stable"
    historical_patterns: List[str] = []
    recommended_action: str
    recommended_next_steps: List[str] = []
    uncertainty: Optional[str] = None
    memory_trace: List[MemoryTraceStep] = []
    supporting_memories: List[Dict[str, Any]] = []
    bank_mission: str
    bank_directives: List[str]
    hindsight_status: str = "connected"

# Renewal Brief & Meeting Prep
class RenewalBriefResponse(BaseModel):
    account_id: str
    account_name: str
    renewal_date: str
    days_until_renewal: int
    current_context: str
    key_risks: List[str]
    open_commitments: List[Dict[str, Any]]
    customer_priorities: List[str]
    what_changed_recently: List[str]
    relevant_observations: List[ObservationResponse]
    recommended_discussion_points: List[str]
    supporting_evidence_count: int

class MeetingPrepResponse(BaseModel):
    account_id: str
    account_name: str
    what_happened_since_last_meeting: List[str]
    what_to_ask: List[str]
    what_to_follow_up_on: List[str]
    unresolved_issues_to_address: List[str]
    customer_priorities_now: List[str]
    recommended_meeting_strategy: str

# Audit Events Schema
class AuditEventResponse(BaseModel):
    id: str
    event_type: str
    title: str
    description: str
    account_id: Optional[str] = None
    created_at: str

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

