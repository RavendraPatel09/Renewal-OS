import time
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from collections import deque

class ErrorTracker:
    """Centralized in-memory error & metrics tracking for observability and health monitoring."""
    def __init__(self, max_recent: int = 50):
        self.max_recent = max_recent
        self.recent_errors: deque = deque(maxlen=max_recent)
        self.error_counts_by_category: Dict[str, int] = {
            "hindsight_error": 0,
            "llm_error": 0,
            "database_error": 0,
            "auth_error": 0,
            "rate_limit_error": 0,
            "unhandled_error": 0
        }
        self.total_copilot_queries: int = 0
        self.total_tokens_estimated: int = 0
        self.start_time: float = time.time()

    def record_error(
        self,
        category: str,
        message: str,
        request_id: Optional[str] = None,
        account_id: Optional[str] = None,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        cat = category if category in self.error_counts_by_category else "unhandled_error"
        self.error_counts_by_category[cat] += 1
        
        error_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "category": cat,
            "message": message[:300],
            "request_id": request_id or "unknown",
            "account_id": account_id,
            "status_code": status_code,
            "details": details or {}
        }
        self.recent_errors.appendleft(error_entry)

    def record_tokens(self, count: int):
        self.total_tokens_estimated += count
        self.total_copilot_queries += 1

    def get_metrics(self) -> Dict[str, Any]:
        uptime_seconds = int(time.time() - self.start_time)
        return {
            "uptime_seconds": uptime_seconds,
            "total_copilot_queries": self.total_copilot_queries,
            "total_tokens_estimated": self.total_tokens_estimated,
            "error_counts": dict(self.error_counts_by_category),
            "recent_errors": list(self.recent_errors)[:10]
        }

error_tracker = ErrorTracker()
