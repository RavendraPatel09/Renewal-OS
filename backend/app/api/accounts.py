from fastapi import APIRouter, Depends, HTTPException, Request, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime, timezone, timedelta
from app.db.session import get_db
from app.models.db_models import Account, Contact, Interaction, Commitment, User
from app.models.schemas import (
    AccountResponse,
    AccountCreateRequest,
    InteractionResponse,
    InteractionCreateRequest,
    CommitmentResponse,
    CommitmentCreateRequest,
    TemporalStepResponse,
    KnowledgeGraphResponse
)
from app.core.security import get_current_user_optional, get_current_user
from app.core.logging_config import app_logger
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

# In-memory idempotency cache: hash -> (interaction_id, timestamp)
idempotency_cache: Dict[str, tuple] = {}

def get_interaction_idempotency_key(account_id: str, title: str, content: str, occurred_at: str) -> str:
    import hashlib
    raw = f"{account_id}:{title}:{content[:100]}:{occurred_at}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()

@router.get("", response_model=List[AccountResponse])
async def get_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    res = []
    for acc in accounts:
        res.append(AccountResponse(
            id=acc.id,
            workspace_id=acc.workspace_id,
            name=acc.name,
            industry=acc.industry or "Enterprise Software",
            plan=acc.plan or "Enterprise",
            renewal_date=acc.renewal_date,
            renewal_days=acc.renewal_days,
            status=acc.status,
            risk_score=acc.risk_score,
            risk_level=acc.risk_level,
            open_issues_count=acc.open_issues_count,
            unresolved_promises_count=acc.unresolved_promises_count,
            recent_sentiment=acc.recent_sentiment,
            mrr=acc.mrr,
            csm_name=acc.csm_name,
            contacts=[{"id": c.id, "name": c.name, "email": c.email, "role": c.role} for c in acc.contacts],
            commitments=[{
                "id": c.id,
                "account_id": c.account_id,
                "description": c.description,
                "owner_name": c.owner_name,
                "status": c.status,
                "due_date": c.due_date,
                "created_at": c.created_at.isoformat() if c.created_at else None
            } for c in acc.commitments]
        ))
    return res

@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(account_id: str, db: Session = Depends(get_db)):
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")
    
    return AccountResponse(
        id=acc.id,
        workspace_id=acc.workspace_id,
        name=acc.name,
        industry=acc.industry or "Enterprise Software",
        plan=acc.plan or "Enterprise",
        renewal_date=acc.renewal_date,
        renewal_days=acc.renewal_days,
        status=acc.status,
        risk_score=acc.risk_score,
        risk_level=acc.risk_level,
        open_issues_count=acc.open_issues_count,
        unresolved_promises_count=acc.unresolved_promises_count,
        recent_sentiment=acc.recent_sentiment,
        mrr=acc.mrr,
        csm_name=acc.csm_name,
        contacts=[{"id": c.id, "name": c.name, "email": c.email, "role": c.role} for c in acc.contacts],
        commitments=[{
            "id": c.id,
            "account_id": c.account_id,
            "description": c.description,
            "owner_name": c.owner_name,
            "status": c.status,
            "due_date": c.due_date,
            "created_at": c.created_at.isoformat() if c.created_at else None
        } for c in acc.commitments]
    )

@router.delete("/{account_id}")
async def delete_account(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Data Rights / GDPR Endpoint: Delete account from PostgreSQL and purge all Hindsight memories.
    """
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")

    # 1. Delete associated DB rows
    db.query(Interaction).filter(Interaction.account_id == account_id).delete()
    db.query(Commitment).filter(Commitment.account_id == account_id).delete()
    db.query(Contact).filter(Contact.account_id == account_id).delete()
    db.delete(acc)
    db.commit()

    # 2. Purge from Hindsight Memory Bank
    hindsight_service.purge_account_memories(account_id)

    app_logger.info(
        f"Account {account_id} and all related memory records permanently deleted",
        extra={"event_type": "data_deletion", "account_id": account_id, "user_id": current_user.id}
    )

    return {
        "status": "success",
        "message": f"Account '{account_id}' and all associated Hindsight memories permanently deleted.",
        "account_id": account_id
    }

@router.get("/{account_id}/temporal", response_model=List[TemporalStepResponse])
async def get_account_temporal(account_id: str):
    return hindsight_service.get_temporal_progression(account_id)

@router.get("/{account_id}/graph", response_model=KnowledgeGraphResponse)
async def get_account_graph(account_id: str):
    return hindsight_service.get_knowledge_graph(account_id)

@router.get("/{account_id}/interactions", response_model=List[InteractionResponse])
async def get_account_interactions(account_id: str, db: Session = Depends(get_db)):
    interactions = db.query(Interaction).filter(Interaction.account_id == account_id).order_by(Interaction.occurred_at.desc()).all()
    return [
        InteractionResponse(
            id=i.id,
            account_id=i.account_id,
            type=i.type,
            title=i.title,
            content=i.content,
            sentiment=i.sentiment,
            importance=i.importance,
            occurred_at=i.occurred_at,
            source=i.source,
            fact_type=i.fact_type,
            hindsight_retained=i.hindsight_retained,
            hindsight_memory_id=i.hindsight_memory_id
        ) for i in interactions
    ]

@router.post("/{account_id}/interactions", response_model=InteractionResponse)
async def create_interaction(
    request: Request,
    account_id: str,
    req: InteractionCreateRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key")
):
    req_id = getattr(request.state, "request_id", "internal")
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")
    
    occurred_at = req.occurred_at or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    # 0. Idempotency & double-click protection (60 second window)
    cache_key = idempotency_key or get_interaction_idempotency_key(account_id, req.title, req.content, occurred_at)
    now = datetime.now(timezone.utc)
    if cache_key in idempotency_cache:
        cached_id, cached_time = idempotency_cache[cache_key]
        if now - cached_time < timedelta(seconds=60):
            existing_int = db.query(Interaction).filter(Interaction.id == cached_id).first()
            if existing_int:
                app_logger.info(
                    f"Duplicate write blocked by idempotency key for {account_id}",
                    extra={"request_id": req_id, "event_type": "write_idempotent_hit", "account_id": account_id}
                )
                return InteractionResponse(
                    id=existing_int.id,
                    account_id=existing_int.account_id,
                    type=existing_int.type,
                    title=existing_int.title,
                    content=existing_int.content,
                    sentiment=existing_int.sentiment,
                    importance=existing_int.importance,
                    occurred_at=existing_int.occurred_at,
                    source=existing_int.source,
                    fact_type=existing_int.fact_type,
                    hindsight_retained=existing_int.hindsight_retained,
                    hindsight_memory_id=existing_int.hindsight_memory_id
                )

    # 1. Save to database
    interaction = Interaction(
        account_id=account_id,
        user_id=user.id if user else None,
        type=req.type,
        title=req.title,
        content=req.content,
        sentiment=req.sentiment or "neutral",
        importance=req.importance or "medium",
        occurred_at=occurred_at,
        source=req.source or "Manual Entry",
        fact_type=req.fact_type or "world_fact",
        hindsight_retained=False
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    idempotency_cache[cache_key] = (interaction.id, now)

    # 2. Retain in Hindsight
    try:
        hindsight_res = await hindsight_service.retain(
            account_id=account_id,
            content=f"{req.title}: {req.content}",
            metadata={
                "id": interaction.id,
                "interaction_type": req.type,
                "fact_type": req.fact_type or "world_fact",
                "occurred_at": occurred_at,
                "date": occurred_at,
                "title": req.title,
                "sentiment": req.sentiment or "neutral",
                "importance": req.importance or "medium",
                "source": req.source or "Manual Entry",
                "workspace_id": acc.workspace_id
            },
            request_id=req_id,
            workspace_id=acc.workspace_id
        )
        interaction.hindsight_retained = True
        interaction.hindsight_memory_id = hindsight_res.get("id", interaction.id)
        db.commit()
    except Exception as e:
        # Graceful failure: record stays in DB, hindsight marked for reconciliation
        db.commit()

    # Update account open issues count or sentiment if critical
    if req.sentiment == "negative":
        acc.recent_sentiment = "declining"
        acc.risk_score = min(acc.risk_score + 8, 95)
        if acc.risk_score > 70:
            acc.risk_level = "high"
            acc.status = "attention"
        db.commit()

    # Record audit event
    from app.api.activity import record_audit_event
    record_audit_event(
        db=db,
        event_type="interaction_retained",
        title=f"Interaction Retained: {req.type.title()}",
        description=f"Retained '{req.title}' ({req.fact_type}) into Hindsight Memory Bank.",
        account_id=account_id,
        user_id=user.id if user else None
    )

    return InteractionResponse(
        id=interaction.id,
        account_id=interaction.account_id,
        type=interaction.type,
        title=interaction.title,
        content=interaction.content,
        sentiment=interaction.sentiment,
        importance=interaction.importance,
        occurred_at=interaction.occurred_at,
        source=interaction.source,
        fact_type=interaction.fact_type,
        hindsight_retained=interaction.hindsight_retained,
        hindsight_memory_id=interaction.hindsight_memory_id
    )

@router.post("/{account_id}/interactions/{interaction_id}/resync")
async def resync_interaction(
    account_id: str,
    interaction_id: str,
    db: Session = Depends(get_db)
):
    """Reconciliation endpoint: re-attempt Hindsight Retain for an un-synced interaction."""
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id,
        Interaction.account_id == account_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found.")

    h_res = await hindsight_service.retain(
        account_id=account_id,
        content=f"{interaction.title}: {interaction.content}",
        metadata={
            "id": interaction.id,
            "interaction_type": interaction.type,
            "fact_type": interaction.fact_type,
            "occurred_at": interaction.occurred_at,
            "date": interaction.occurred_at,
            "title": interaction.title,
            "sentiment": interaction.sentiment,
            "importance": interaction.importance,
            "source": interaction.source
        }
    )
    interaction.hindsight_retained = True
    interaction.hindsight_memory_id = h_res.get("id", interaction.id)
    db.commit()

    return {
        "status": "success",
        "message": f"Interaction {interaction_id} re-synced with Hindsight memory bank.",
        "hindsight_memory_id": interaction.hindsight_memory_id
    }

@router.get("/{account_id}/observations", response_model=List[dict])
async def get_account_observations(account_id: str):
    return hindsight_service.get_observations(account_id)

@router.get("/{account_id}/renewal-brief")
async def get_renewal_brief(account_id: str, db: Session = Depends(get_db)):
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")
    
    from app.services.agent_service import agent_service
    from app.api.activity import record_audit_event
    record_audit_event(
        db=db,
        event_type="renewal_brief_generated",
        title=f"Renewal Brief Prepared for {acc.name}",
        description=f"Grounded renewal intelligence synthesized from persistent memory bank.",
        account_id=account_id
    )
    return await agent_service.generate_renewal_brief(account_id, acc.name, acc.renewal_days)

@router.get("/{account_id}/meeting-prep")
async def get_meeting_prep(account_id: str, db: Session = Depends(get_db)):
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")
    
    from app.services.agent_service import agent_service
    from app.api.activity import record_audit_event
    record_audit_event(
        db=db,
        event_type="meeting_prep_generated",
        title=f"Meeting Prep Briefing for {acc.name}",
        description=f"Prepared agenda, open issues, and follow-ups from Hindsight memories.",
        account_id=account_id
    )
    return await agent_service.generate_meeting_prep(account_id, acc.name)

@router.post("/{account_id}/meeting-notes")
async def add_meeting_notes(
    request: Request,
    account_id: str,
    req: dict,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    req_id = getattr(request.state, "request_id", "internal")
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account '{account_id}' not found.")

    occurred_at = req.get("date") or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = req.get("title") or "Customer Meeting Notes"
    notes = req.get("notes") or ""
    participants = req.get("participants") or "CSM & Stakeholders"

    full_content = f"Meeting: {title}\nParticipants: {participants}\nNotes: {notes}"
    
    # 1. Save in DB
    interaction = Interaction(
        account_id=account_id,
        user_id=user.id if user else None,
        type="meeting",
        title=title,
        content=full_content,
        sentiment="neutral",
        importance="high",
        occurred_at=occurred_at,
        source="Meeting Logger",
        fact_type="experience_fact",
        hindsight_retained=False
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    # 2. Retain to Hindsight
    try:
        h_res = await hindsight_service.retain(
            account_id=account_id,
            content=full_content,
            metadata={
                "id": interaction.id,
                "interaction_type": "meeting",
                "fact_type": "experience_fact",
                "occurred_at": occurred_at,
                "date": occurred_at,
                "title": title,
                "sentiment": "neutral",
                "importance": "high",
                "source": "Meeting Logger",
                "workspace_id": acc.workspace_id
            },
            request_id=req_id,
            workspace_id=acc.workspace_id
        )
        interaction.hindsight_retained = True
        interaction.hindsight_memory_id = h_res.get("id", interaction.id)
        db.commit()
    except Exception:
        db.commit()

    # 3. Audit event
    from app.api.activity import record_audit_event
    record_audit_event(
        db=db,
        event_type="meeting_notes_retained",
        title=f"Meeting Notes Remembered: {title}",
        description=f"Saved to DB and indexed into Hindsight persistent memory bank.",
        account_id=account_id,
        user_id=user.id if user else None
    )

    return {
        "status": "success",
        "message": "Meeting remembered.",
        "interaction_id": interaction.id,
        "hindsight_retained": interaction.hindsight_retained,
        "account_id": account_id
    }

@router.get("/{account_id}/commitments", response_model=List[CommitmentResponse])
async def get_account_commitments(account_id: str, db: Session = Depends(get_db)):
    commitments = db.query(Commitment).filter(Commitment.account_id == account_id).all()
    return [
        CommitmentResponse(
            id=c.id,
            account_id=c.account_id,
            description=c.description,
            owner_name=c.owner_name,
            status=c.status,
            due_date=c.due_date,
            created_at=c.created_at.isoformat() if c.created_at else None
        ) for c in commitments
    ]

@router.post("/{account_id}/commitments", response_model=CommitmentResponse)
async def create_commitment(
    account_id: str,
    req: CommitmentCreateRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    acc = db.query(Account).filter(Account.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found.")
    
    commitment = Commitment(
        account_id=account_id,
        description=req.description,
        owner_id=user.id if user else None,
        owner_name=req.owner_name or "Priya Sharma",
        status=req.status or "open",
        due_date=req.due_date
    )
    db.add(commitment)
    if req.status == "overdue":
        acc.unresolved_promises_count += 1
    db.commit()
    db.refresh(commitment)

    from app.api.activity import record_audit_event
    record_audit_event(
        db=db,
        event_type="commitment_created",
        title=f"New Commitment for {acc.name}",
        description=f"Recorded '{req.description}' (Due: {req.due_date})",
        account_id=account_id
    )

    return CommitmentResponse(
        id=commitment.id,
        account_id=commitment.account_id,
        description=commitment.description,
        owner_name=commitment.owner_name,
        status=commitment.status,
        due_date=commitment.due_date,
        created_at=commitment.created_at.isoformat() if commitment.created_at else None
    )
