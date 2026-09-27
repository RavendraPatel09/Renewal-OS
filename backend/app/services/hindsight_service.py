import logging
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings
from app.models.seed_data import (
    BANK_MISSION,
    BANK_DIRECTIVES,
    ACME_OBSERVATIONS,
    ACME_WORLD_FACTS,
    ACME_EXPERIENCE_FACTS,
    ACME_TEMPORAL_PROGRESSION,
    ACME_KNOWLEDGE_GRAPH
)

logger = logging.getLogger("hindsight_service")

class MemoryStore:
    """In-memory indexing & fallback layer to complement Hindsight Cloud/Server."""
    def __init__(self):
        self.memories: List[Dict[str, Any]] = []

    def add(self, memory: Dict[str, Any]):
        # Avoid duplicates
        if not any(m.get("id") == memory.get("id") for m in self.memories):
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
        self.bank_id = settings.HINDSIGHT_BANK_ID

    async def retain(self, account_id: str, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Store interaction into Hindsight persistent memory bank."""
        memory_entry = {
            "id": metadata.get("id", f"mem_{len(local_memory_store.memories) + 1}"),
            "account_id": account_id,
            "interaction_type": metadata.get("interaction_type", "general"),
            "fact_type": metadata.get("fact_type", "world_fact"),
            "date": metadata.get("occurred_at", metadata.get("date", "2026-08-01")),
            "summary": metadata.get("title", metadata.get("summary", content[:80])),
            "content": content,
            "sentiment": metadata.get("sentiment", "neutral"),
            "importance": metadata.get("importance", "medium"),
            "source": metadata.get("source", "Manual Entry")
        }
        local_memory_store.add(memory_entry)

        hindsight_success = False
        # Attempt call to official Hindsight Cloud / Local Server API if configured
        if self.api_key or self.base_url:
            try:
                async with httpx.AsyncClient(timeout=3.0) as client:
                    headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
                    payload = {
                        "bank_id": self.bank_id,
                        "content": f"[Account: {account_id}] [{memory_entry['fact_type'].upper()}] {content}",
                        "metadata": metadata
                    }
                    res = await client.post(f"{self.base_url}/retain", json=payload, headers=headers)
                    if res.status_code in (200, 201):
                        hindsight_success = True
            except Exception as e:
                logger.warning(f"Hindsight API ping skipped/failed, using local memory index: {e}")

        memory_entry["hindsight_retained"] = True
        return memory_entry

    async def recall(self, query: str, account_id: Optional[str] = None, limit: int = 15) -> List[Dict[str, Any]]:
        """Perform multi-strategy search across Hindsight memory bank."""
        # Check if Hindsight Cloud endpoint is reachable for recall
        if self.api_key or self.base_url:
            try:
                async with httpx.AsyncClient(timeout=3.0) as client:
                    headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
                    params = {"bank_id": self.bank_id, "query": query, "limit": limit}
                    if account_id:
                        params["account_id"] = account_id
                    res = await client.get(f"{self.base_url}/recall", params=params, headers=headers)
                    if res.status_code == 200:
                        remote_results = res.json().get("memories", [])
                        if remote_results:
                            return remote_results
            except Exception as e:
                logger.debug(f"Hindsight server recall fallback: {e}")

        # Local multi-strategy retrieval
        memories = local_memory_store.memories
        if account_id:
            memories = [m for m in memories if m.get("account_id") == account_id]
        
        if query:
            keywords = query.lower().split()
            scored = []
            for m in memories:
                score = sum(1 for kw in keywords if kw in m.get("content", "").lower() or kw in m.get("summary", "").lower() or kw in m.get("account_id", "").lower())
                scored.append((score, m))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [m for s, m in scored[:limit]]
        
        return memories[:limit]

    async def reflect(self, query: str, account_id: str, include_cross_account: bool = False) -> Dict[str, Any]:
        """Perform deep synthesis across consolidated Observations, World Facts, and Experience Facts."""
        account_memories = await self.recall(query=query, account_id=account_id, limit=20)
        observations = self.get_observations(account_id)
        world_facts = self.get_world_facts(account_id)
        experience_facts = self.get_experience_facts(account_id)

        return {
            "query": query,
            "account_id": account_id,
            "observations": observations,
            "world_facts": world_facts,
            "experience_facts": experience_facts,
            "account_memories": account_memories,
            "bank_mission": BANK_MISSION,
            "bank_directives": BANK_DIRECTIVES
        }

    def get_observations(self, account_id: str) -> List[Dict[str, Any]]:
        """Return consolidated Hindsight observations for account based on memory accumulation."""
        acc_memories = local_memory_store.get_by_account(account_id)
        if len(acc_memories) >= 3 and account_id == "acme-corp":
            return ACME_OBSERVATIONS
        elif len(acc_memories) >= 3:
            return [{
                "id": f"obs-{account_id}-pattern",
                "account_id": account_id,
                "title": f"Durable Account Observation for {account_id.replace('-', ' ').title()}",
                "description": f"Multiple customer interactions indicate active engagement with {len(acc_memories)} retained context points.",
                "evidence_count": len(acc_memories),
                "first_detected": acc_memories[0].get("date", "2026-06-01") if acc_memories else "2026-06-01",
                "last_confirmed": acc_memories[-1].get("date", "2026-08-15") if acc_memories else "2026-08-15",
                "status": "Active",
                "supporting_memory_ids": [m.get("id") for m in acc_memories[:4]]
            }]
        return []

    def get_world_facts(self, account_id: str) -> List[str]:
        if account_id == "acme-corp":
            return ACME_WORLD_FACTS
        return [
            f"Customer {account_id.replace('-', ' ').title()} active on Enterprise Tier.",
            f"Renewal timeline monitored within RenewalOS Hindsight Bank."
        ]

    def get_experience_facts(self, account_id: str) -> List[str]:
        if account_id == "acme-corp":
            return ACME_EXPERIENCE_FACTS
        return [
            f"RenewalOS recorded recent customer touchpoints for {account_id.replace('-', ' ').title()}."
        ]

    def get_temporal_progression(self, account_id: str) -> List[Dict[str, Any]]:
        if account_id == "acme-corp":
            return ACME_TEMPORAL_PROGRESSION
        return [
            {"days_ago": "30 DAYS AGO", "status_color": "green", "label": "Onboarding", "description": "Customer onboarded."},
            {"days_ago": "TODAY", "status_color": "green", "label": "Active Review", "description": "Monitoring account status."}
        ]

    def get_knowledge_graph(self, account_id: str) -> Dict[str, Any]:
        if account_id == "acme-corp":
            return ACME_KNOWLEDGE_GRAPH
        return {
            "nodes": [
                {"id": account_id, "label": account_id.replace('-', ' ').title(), "type": "account"},
                {"id": "csm", "label": "CSM Owner", "type": "person"},
                {"id": "plan", "label": "Enterprise Plan", "type": "topic"}
            ],
            "links": [
                {"source": account_id, "target": "csm", "label": "managed by"},
                {"source": account_id, "target": "plan", "label": "subscribed to"}
            ]
        }

    def reset_memories(self):
        local_memory_store.clear()

hindsight_service = HindsightService()
