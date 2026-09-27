import json
import logging
import sys
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

class JSONFormatter(logging.Formatter):
    """Formats log records as structured JSON for production observability."""
    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Merge structured extra fields if present
        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id
        if hasattr(record, "event_type"):
            log_obj["event_type"] = record.event_type
        if hasattr(record, "account_id"):
            log_obj["account_id"] = record.account_id
        if hasattr(record, "latency_ms"):
            log_obj["latency_ms"] = record.latency_ms
        if hasattr(record, "status"):
            log_obj["status"] = record.status
        if hasattr(record, "token_count"):
            log_obj["token_count"] = record.token_count
        if hasattr(record, "model"):
            log_obj["model"] = record.model
        if hasattr(record, "user_id"):
            log_obj["user_id"] = record.user_id

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)

def setup_logging(level: str = "INFO"):
    logger = logging.getLogger("renewalos")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    
    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.propagate = False
        
    return logger

app_logger = setup_logging()
