from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import accounts, memories, copilot, demo
from app.services.hindsight_service import hindsight_service
from app.models.seed_data import ACME_DEMO_MEMORIES, HISTORICAL_CHURN_MEMORIES, HISTORICAL_RENEWED_MEMORIES

app = FastAPI(title="RenewalOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(memories.router)
app.include_router(copilot.router)
app.include_router(demo.router)

@app.on_event("startup")
async def startup_event():
    # Auto-seed memories on startup so demo is ready out of the box
    for mem in ACME_DEMO_MEMORIES + HISTORICAL_CHURN_MEMORIES + HISTORICAL_RENEWED_MEMORIES:
        await hindsight_service.retain(
            account_id=mem["account_id"],
            content=mem["content"],
            metadata=mem
        )

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "memory": "connected",
        "llm": "connected"
    }
