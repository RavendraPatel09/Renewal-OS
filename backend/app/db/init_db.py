import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.db_models import User, Workspace, Account, Contact, Interaction, Commitment
from app.core.security import get_password_hash
from app.models.seed_data import (
    SYNTHETIC_ACCOUNTS,
    ACME_DEMO_MEMORIES,
    HISTORICAL_CHURN_MEMORIES,
    HISTORICAL_RENEWED_MEMORIES
)
from app.services.hindsight_service import hindsight_service

logger = logging.getLogger("init_db")

def init_db(db: Session = None):
    Base.metadata.create_all(bind=engine)
    
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        # Check if default user exists
        user = db.query(User).filter(User.email == "priya@company.com").first()
        if not user:
            logger.info("Seeding default user priya@company.com...")
            user = User(
                id="user-priya-sharma",
                name="Priya Sharma",
                email="priya@company.com",
                password_hash=get_password_hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check default workspace
        workspace = db.query(Workspace).filter(Workspace.owner_id == user.id).first()
        if not workspace:
            logger.info("Seeding default workspace...")
            workspace = Workspace(
                id="workspace-enterprise-csm",
                name="Priya Sharma Workspace",
                owner_id=user.id
            )
            db.add(workspace)
            db.commit()
            db.refresh(workspace)

        # Check and seed accounts
        for acc_data in SYNTHETIC_ACCOUNTS:
            existing_acc = db.query(Account).filter(Account.id == acc_data.id).first()
            if not existing_acc:
                status_mapping = {
                    "active": "attention" if acc_data.risk_level == "high" else "healthy",
                    "renewed": "renewed",
                    "churned": "at_risk"
                }
                new_acc = Account(
                    id=acc_data.id,
                    workspace_id=workspace.id,
                    name=acc_data.name,
                    industry="Enterprise SaaS",
                    plan=getattr(acc_data, "plan", getattr(acc_data, "tier", "Enterprise")),
                    renewal_date="2026-09-30",
                    renewal_days=acc_data.renewal_days,
                    status=status_mapping.get(acc_data.status, "healthy"),
                    risk_score=acc_data.risk_score,
                    risk_level=acc_data.risk_level,
                    open_issues_count=acc_data.open_issues_count,
                    unresolved_promises_count=acc_data.unresolved_promises_count,
                    recent_sentiment=acc_data.recent_sentiment,
                    mrr=acc_data.mrr,
                    owner_id=user.id,
                    csm_name=acc_data.csm_name
                )
                db.add(new_acc)
                
                # Add default contact
                contact = Contact(
                    id=f"contact-{acc_data.id}",
                    account_id=acc_data.id,
                    name=f"Lead Stakeholder ({acc_data.name})",
                    email=f"sponsor@{acc_data.id}.com",
                    role="VP Technology / Buyer"
                )
                db.add(contact)
        db.commit()

        # Seed Acme commitments
        acme_commitments = [
            {
                "id": "commit-acme-sso",
                "account_id": "acme-corp",
                "description": "Deliver dedicated SAML Okta SSO bug fix patch v2.4",
                "owner_id": user.id,
                "owner_name": "Tier 3 Engineering",
                "status": "overdue",
                "due_date": "2026-08-01"
            },
            {
                "id": "commit-acme-exec",
                "account_id": "acme-corp",
                "description": "Executive alignment call with VP Engineering regarding renewal pricing terms",
                "owner_id": user.id,
                "owner_name": "Priya Sharma (CSM)",
                "status": "open",
                "due_date": "2026-08-20"
            }
        ]
        for c_data in acme_commitments:
            if not db.query(Commitment).filter(Commitment.id == c_data["id"]).first():
                db.add(Commitment(**c_data))
        db.commit()

        # Seed interactions in DB
        all_seed_interactions = ACME_DEMO_MEMORIES + HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES
        for m in all_seed_interactions:
            existing_int = db.query(Interaction).filter(Interaction.id == m["id"]).first()
            if not existing_int:
                int_entry = Interaction(
                    id=m["id"],
                    account_id=m["account_id"],
                    user_id=user.id,
                    type=m["interaction_type"],
                    title=m["summary"],
                    content=m["content"],
                    sentiment=m["sentiment"],
                    importance=m["importance"],
                    occurred_at=m["date"],
                    source=m.get("source", "Manual Entry"),
                    fact_type=m.get("fact_type", "world_fact"),
                    hindsight_retained=True,
                    hindsight_memory_id=m["id"]
                )
                db.add(int_entry)
        db.commit()
        logger.info("Database initialized and seeded successfully.")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        db.rollback()
    finally:
        if close_db:
            db.close()
