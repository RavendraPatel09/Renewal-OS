from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.db.session import get_db
from app.models.db_models import AuditEvent, User
from app.models.schemas import AuditEventResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/api/activity", tags=["activity"])

def record_audit_event(
    db: Session,
    event_type: str,
    title: str,
    description: str,
    account_id: str = None,
    user_id: str = None,
    workspace_id: str = None
):
    try:
        event = AuditEvent(
            event_type=event_type,
            title=title,
            description=description,
            account_id=account_id,
            user_id=user_id,
            workspace_id=workspace_id,
            created_at=datetime.now(timezone.utc)
        )
        db.add(event)
        db.commit()
    except Exception as e:
        db.rollback()

@router.get("", response_model=List[AuditEventResponse])
def get_activity_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    events = db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(20).all()
    if not events:
        # Default starter event
        return [
            AuditEventResponse(
                id="evt-init",
                event_type="hindsight_bank_initialized",
                title="Hindsight Memory Bank Connected",
                description="Memory bank 'renewal_os_bank' active with configured mission and directives.",
                account_id="acme-corp",
                created_at=datetime.now(timezone.utc).strftime("%H:%M • %Y-%m-%d")
            )
        ]
    return [
        AuditEventResponse(
            id=e.id,
            event_type=e.event_type,
            title=e.title,
            description=e.description,
            account_id=e.account_id,
            created_at=e.created_at.strftime("%H:%M • %Y-%m-%d") if e.created_at else "Just now"
        )
        for e in events
    ]
