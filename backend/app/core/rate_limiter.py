import time
from collections import defaultdict, deque
from typing import Dict, Tuple, Optional
from fastapi import Request, HTTPException, status
from app.core.logging_config import app_logger
from app.core.error_tracker import error_tracker

class RateLimiter:
    """Sliding window in-memory rate limiter per IP or user key."""
    def __init__(self):
        # key -> deque of timestamps
        self.buckets: Dict[str, deque] = defaultdict(deque)

    def check(self, key: str, max_requests: int, window_seconds: int = 60) -> Tuple[bool, int, int]:
        """
        Returns (is_allowed, remaining_requests, retry_after_seconds)
        """
        now = time.time()
        bucket = self.buckets[key]
        
        # Evict timestamps older than window
        while bucket and bucket[0] < now - window_seconds:
            bucket.popleft()
            
        if len(bucket) >= max_requests:
            retry_after = int(window_seconds - (now - bucket[0])) + 1
            return False, 0, max(1, retry_after)
            
        bucket.append(now)
        remaining = max_requests - len(bucket)
        return True, remaining, 0

rate_limiter = RateLimiter()

def rate_limit_dependency(max_requests: int = 60, window_seconds: int = 60, key_prefix: str = "global"):
    """FastAPI Dependency for route-level rate limiting."""
    async def dependency(request: Request):
        # Prefer client IP or authorization token subject
        client_ip = request.client.host if request.client else "unknown_client"
        auth_header = request.headers.get("Authorization", "")
        
        identifier = f"{key_prefix}:{auth_header[:30] if auth_header else client_ip}"
        allowed, remaining, retry_after = rate_limiter.check(identifier, max_requests, window_seconds)
        
        if not allowed:
            req_id = getattr(request.state, "request_id", "unknown")
            app_logger.warning(
                f"Rate limit exceeded for {identifier}",
                extra={
                    "request_id": req_id,
                    "event_type": "rate_limit_exceeded",
                    "status": "blocked"
                }
            )
            error_tracker.record_error(
                category="rate_limit_error",
                message=f"Rate limit exceeded: {max_requests} reqs per {window_seconds}s.",
                request_id=req_id,
                status_code=429,
                details={"retry_after": retry_after}
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please wait {retry_after} seconds before retrying.",
                headers={"Retry-After": str(retry_after)}
            )
    return dependency
