import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspaces = relationship("Workspace", back_populates="owner")
    interactions = relationship("Interaction", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="user")

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="workspaces")
    accounts = relationship("Account", back_populates="workspace", cascade="all, delete-orphan")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=generate_uuid)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(150), index=True, nullable=False)
    industry = Column(String(100), default="Enterprise Software")
    plan = Column(String(50), default="Enterprise")
    renewal_date = Column(String(50), nullable=False)  # ISO string or days descriptor
    renewal_days = Column(Integer, default=30)
    status = Column(String(50), default="healthy")  # healthy, attention, at_risk, renewed, churned
    risk_score = Column(Integer, default=25)
    risk_level = Column(String(20), default="low")  # low, medium, high
    open_issues_count = Column(Integer, default=0)
    unresolved_promises_count = Column(Integer, default=0)
    recent_sentiment = Column(String(30), default="neutral")  # positive, neutral, negative, declining
    mrr = Column(Integer, default=50000)
    owner_id = Column(String, ForeignKey("users.id"), nullable=True)
    csm_name = Column(String(100), default="Priya Sharma")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="accounts")
    contacts = relationship("Contact", back_populates="account", cascade="all, delete-orphan")
    interactions = relationship("Interaction", back_populates="account", cascade="all, delete-orphan")
    commitments = relationship("Commitment", back_populates="account", cascade="all, delete-orphan")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(String, primary_key=True, default=generate_uuid)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(100), default="Stakeholder")
    created_at = Column(DateTime, default=datetime.utcnow)

    account = relationship("Account", back_populates="contacts")

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    type = Column(String(50), nullable=False)  # email, call, meeting, qbr, support, note, product_feedback, renewal
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    sentiment = Column(String(20), default="neutral")  # positive, neutral, negative
    importance = Column(String(20), default="medium")  # low, medium, high
    occurred_at = Column(String(50), nullable=False)  # ISO Date string e.g. 2026-08-04
    source = Column(String(100), default="Manual Entry")
    fact_type = Column(String(50), default="world_fact")  # world_fact, experience_fact
    hindsight_retained = Column(Boolean, default=False)
    hindsight_memory_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    account = relationship("Account", back_populates="interactions")
    user = relationship("User", back_populates="interactions")

class Commitment(Base):
    __tablename__ = "commitments"

    id = Column(String, primary_key=True, default=generate_uuid)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False)
    description = Column(Text, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=True)
    owner_name = Column(String(100), default="Priya Sharma")
    status = Column(String(50), default="open")  # open, completed, overdue, cancelled
    due_date = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    account = relationship("Account", back_populates="commitments")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    rating = Column(String(20), nullable=False)  # excellent, good, okay, poor
    category = Column(String(50), default="general")
    message = Column(Text, nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    account_id = Column(String, nullable=True)
    event_type = Column(String(50), nullable=False)  # interaction_retained, memory_recalled, reflect_completed, observation_formed, commitment_created, commitment_completed, user_signin, demo_reset, meeting_notes_retained
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

