from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import CustomerAccount
from app.models.seed_data import SYNTHETIC_ACCOUNTS

router = APIRouter(prefix="/accounts", tags=["accounts"])

# In-memory account list initialized with synthetic data
account_db = {acc.id: acc for acc in SYNTHETIC_ACCOUNTS}

@router.get("", response_model=List[CustomerAccount])
async def get_accounts():
    return list(account_db.values())

@router.get("/{account_id}", response_model=CustomerAccount)
async def get_account(account_id: str):
    if account_id not in account_db:
        raise HTTPException(status_code=404, detail="Account not found")
    return account_db[account_id]
