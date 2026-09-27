from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.models.db_models import Feedback, User
from app.models.schemas import FeedbackCreateRequest, FeedbackResponse
from app.core.security import get_current_user_optional

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(
    req: FeedbackCreateRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback message cannot be empty."
        )

    feedback = Feedback(
        user_id=user.id if user else None,
        rating=req.rating,
        category=req.category or "general",
        message=req.message,
        email=req.email or (user.email if user else None)
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return FeedbackResponse(
        id=feedback.id,
        rating=feedback.rating,
        category=feedback.category,
        message=feedback.message,
        created_at=feedback.created_at.isoformat() if feedback.created_at else ""
    )
