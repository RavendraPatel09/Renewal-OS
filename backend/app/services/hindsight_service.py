import logging
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings

logger = logging.getLogger("hindsight_service")

class MemoryStore:
    """In-memory fallback & indexing layer to complement Hindsight or operate seamlessly when standalone."""
    def __init__(self):
        self.memories: List[Dict[str, Any]] = []

    def add(self, memory: Dict[str, Any]):
        self.memories.append(memory)

    def get_by_account(self, account_id: str) -> List[Dict[str, Any]]:
        return [m for m in self.memories if m.get("account_id") == account_id]

    def clear(self):
        self.memories = []

local_memory_store = MemoryStore()

class HindsightService:
    def __init__(self):
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.api_key = settings.HINDSIGHT_API_KEY
        self.bank_id = settings.DEFAULT_BANK_ID

    async def retain(self, account_id: str, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Store interaction into Hindsight persistent memory layer + local index."""
        memory_entry = {
            "id": metadata.get("id", f"mem_{len(local_memory_store.memories) + 1}"),
            "account_id": account_id,
            "interaction_type": metadata.get("interaction_type", "general"),
            "date": metadata.get("date", "2026-08-01"),
            "summary": metadata.get("summary", content[:80]),
            "content": content,
            "sentiment": metadata.get("sentiment", "neutral"),
            "importance": metadata.get("importance", "medium"),
            "source": metadata.get("source", "Manual Entry")
        }
        local_memory_store.add(memory_entry)

        # Attempt call to Hindsight Cloud/Server API if configured
        if self.api_key or self.base_url:
            try:
                async with httpx.AsyncClient(timeout=3.0) as client:
                    headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
                    payload = {
                        "bank_id": self.bank_id,
                        "content": f"[Account: {account_id}] {content}",
                        "metadata": metadata
                    }
                    await client.post(f"{self.base_url}/retain", json=payload, headers=headers)
            except Exception as e:
                logger.warning(f"Hindsight API ping skipped/failed, using local memory index: {e}")

        return memory_entry

    async def recall(self, query: str, account_id: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve relevant memories matching query & optionally filtered by account."""
        memories = local_memory_store.memories
        if account_id:
            memories = [m for m in memories if m.get("account_id") == account_id]
        
        # Simple relevance filter by keyword / recency if query specified
        if query:
            keywords = query.lower().split()
            scored = []
            for m in memories:
                score = sum(1 for kw in keywords if kw in m.get("content", "").lower() or kw in m.get("summary", "").lower() or kw in m.get("account_id", "").lower())
                scored.append((score, m))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [m for s, m in scored[:limit]]
        
        return memories[:limit]

    def reset_memories(self):
        local_memory_store.clear()

hindsight_service = HindsightService()
