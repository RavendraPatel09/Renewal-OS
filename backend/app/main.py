import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.core.logging_config import app_logger
from app.core.error_tracker import error_tracker
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.api import auth, accounts, memories, copilot, feedback, demo, activity
from app.services.hindsight_service import hindsight_service, local_memory_store
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
    app_logger.info("RenewalOS Application & Hindsight Memory Bank initialized successfully.")
    yield

app = FastAPI(
    title="RenewalOS API",
    description="Production-grade AI Customer Success Memory Agent API powered by Hindsight",
    version="2.1.0",
    lifespan=lifespan
)

# 1. Request ID and Access Logging Middleware
@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = req_id
    start_time = time.time()
    
    try:
        response: Response = await call_next(request)
        latency_ms = int((time.time() - start_time) * 1000)
        response.headers["X-Request-ID"] = req_id
        
        # Avoid logging noisy health checks at INFO unless error
        if request.url.path not in ("/health", "/api/health") or response.status_code >= 400:
            app_logger.info(
                f"{request.method} {request.url.path} -> {response.status_code} ({latency_ms}ms)",
                extra={
                    "request_id": req_id,
                    "event_type": "http_request",
                    "status": response.status_code,
                    "latency_ms": latency_ms
                }
            )
        return response
    except Exception as exc:
        latency_ms = int((time.time() - start_time) * 1000)
        error_tracker.record_error(
            category="unhandled_error",
            message=str(exc),
            request_id=req_id,
            status_code=500
        )
        app_logger.error(
            f"Unhandled exception during {request.method} {request.url.path}: {exc}",
            exc_info=True,
            extra={
                "request_id": req_id,
                "event_type": "http_error",
                "status": 500,
                "latency_ms": latency_ms
            }
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred while processing the request.",
                "request_id": req_id
            },
            headers={"X-Request-ID": req_id}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
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

@app.get("/health")
@app.get("/api/health")
async def health_check(request: Request):
    req_id = getattr(request.state, "request_id", "internal")
    
    # 1. Database check
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception as e:
        db_status = "error"
        error_tracker.record_error("database_error", str(e), request_id=req_id)

    # 2. Auth check
    auth_status = "ready" if settings.JWT_SECRET else "missing_secret"

    # 3. Hindsight memory bank check
    mem_count = len(local_memory_store.memories)
    hindsight_status = "connected" if mem_count > 0 else "initialized"

    # 4. LLM check
    llm_status = "ready" if settings.GROQ_API_KEY else "fallback_rule_based"

    metrics = error_tracker.get_metrics()

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
        "observability": {
            "uptime_seconds": metrics["uptime_seconds"],
            "total_copilot_queries": metrics["total_copilot_queries"],
            "total_tokens_estimated": metrics["total_tokens_estimated"],
            "error_counts": metrics["error_counts"]
        },
        "version": "2.1.0"
    }

@app.get("/api/observability/metrics")
async def get_metrics():
    return error_tracker.get_metrics()
