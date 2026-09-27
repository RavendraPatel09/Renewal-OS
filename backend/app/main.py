from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api import auth, accounts, memories, copilot, feedback, demo, activity
from app.services.hindsight_service import hindsight_service, local_memory_store
from app.config import settings
from app.db.session import SessionLocal
from app.models.seed_data import (
    ACME_DEMO_MEMORIES,
    HISTORICAL_CHURN_MEMORIES,
    HISTORICAL_RENEWED_MEMORIES
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed data on startup
    init_db()
    # Seed Hindsight memory bank with interaction memories
    for mem in ACME_DEMO_MEMORIES + HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )
    yield

app = FastAPI(
    title="RenewalOS API",
    description="Production-grade AI Customer Success Memory Agent API powered by Hindsight",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers (both with /api prefix and root for backwards compatibility)
app.include_router(auth.router)

app.include_router(accounts.router)
app.include_router(accounts.router, prefix="", tags=["accounts-compat"])

app.include_router(memories.router)
app.include_router(memories.router, prefix="", tags=["memories-compat"])

app.include_router(copilot.router)
app.include_router(copilot.router, prefix="", tags=["copilot-compat"])

app.include_router(feedback.router)
app.include_router(feedback.router, prefix="", tags=["feedback-compat"])

app.include_router(demo.router)
app.include_router(demo.router, prefix="", tags=["demo-compat"])

app.include_router(activity.router)
app.include_router(activity.router, prefix="", tags=["activity-compat"])

from sqlalchemy import text

@app.get("/health")
@app.get("/api/health")
async def health_check():
    # 1. Database check
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "error"

    # 2. Auth check
    auth_status = "ready" if settings.JWT_SECRET else "missing_secret"

    # 3. Hindsight memory bank check
    mem_count = len(local_memory_store.memories)
    hindsight_status = "connected" if mem_count > 0 else "initialized"

    # 4. LLM check
    llm_status = "ready" if settings.GROQ_API_KEY else "fallback_rule_based"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "authentication": auth_status,
        "hindsight": {
            "status": hindsight_status,
            "bank_id": settings.HINDSIGHT_BANK_ID,
            "indexed_memories": mem_count
        },
        "llm_engine": llm_status,
        "version": "2.0.0"
    }

