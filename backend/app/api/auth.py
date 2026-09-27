from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.db_models import User, Workspace
from app.models.schemas import UserSignupRequest, UserSigninRequest, TokenResponse, UserProfileResponse
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.core.logging_config import app_logger
from app.core.rate_limiter import rate_limit_dependency

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post(
    "/signup",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=10, window_seconds=60, key_prefix="auth_signup"))]
)
async def signup(request: Request, req: UserSignupRequest, db: Session = Depends(get_db)):
    req_id = getattr(request.state, "request_id", "internal")
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        app_logger.warning(
            f"Signup failed: email {req.email.lower()} already registered",
            extra={"request_id": req_id, "event_type": "auth_signup_duplicate", "status": "failed"}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    new_user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=get_password_hash(req.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create user workspace
    workspace = Workspace(
        name=f"{req.company or req.name}'s Workspace",
        owner_id=new_user.id
    )
    db.add(workspace)
    db.commit()

    token = create_access_token({"sub": new_user.id, "email": new_user.email})
    app_logger.info(
        f"User signed up: {new_user.email}",
        extra={
            "request_id": req_id,
            "event_type": "auth_signup_success",
            "user_id": new_user.id,
            "status": "success"
        }
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "workspace_id": workspace.id
        }
    }

@router.post(
    "/signin",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=15, window_seconds=60, key_prefix="auth_signin"))]
)
async def signin(request: Request, req: UserSigninRequest, db: Session = Depends(get_db)):
    req_id = getattr(request.state, "request_id", "internal")
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        app_logger.warning(
            f"Failed signin attempt for {req.email.lower()}",
            extra={"request_id": req_id, "event_type": "auth_signin_failed", "status": "unauthorized"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    workspace = db.query(Workspace).filter(Workspace.owner_id == user.id).first()
    workspace_id = workspace.id if workspace else None

    token = create_access_token({"sub": user.id, "email": user.email})
    app_logger.info(
        f"User signed in: {user.email}",
        extra={
            "request_id": req_id,
            "event_type": "auth_signin_success",
            "user_id": user.id,
            "status": "success"
        }
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "workspace_id": workspace_id
        }
    }

@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }
