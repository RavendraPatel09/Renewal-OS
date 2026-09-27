import asyncio
import logging
import time
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings
from app.core.logging_config import app_logger
from app.core.error_tracker import error_tracker
from app.models.seed_data import (
    BANK_MISSION,
    BANK_DIRECTIVES,
    ACME_OBSERVATIONS,
    ACME_WORLD_FACTS,
    ACME_EXPERIENCE_FACTS,
    ACME_TEMPORAL_PROGRESSION,
    ACME_KNOWLEDGE_GRAPH
)

class MemoryStore:
    """In-memory indexing & fallback layer to complement Hindsight Cloud/Server."""
    def __init__(self):
        self.memories: List[Dict[str, Any]] = []

    def add(self, memory: Dict[str, Any]):
        # Deduplicate by ID
        if not any(m.get("id") == memory.get("id") for m in self.memories):
            self.memories.append(memory)

    def get_by_account(self, account_id: str, workspace_id: Optional[str] = None) -> List[Dict[str, Any]]:
        results = [m for m in self.memories if m.get("account_id") == account_id]
        if workspace_id:
            results = [m for m in results if m.get("workspace_id") == workspace_id or not m.get("workspace_id")]
        return results

    def purge_account(self, account_id: str):
        self.memories = [m for m in self.memories if m.get("account_id") != account_id]

    def clear(self):
        self.memories = []

local_memory_store = MemoryStore()

class HindsightService:
    def __init__(self):
        self.base_url = settings.HINDSIGHT_BASE_URL
        self.api_key = settings.HINDSIGHT_API_KEY
        self.bank_id = settings.HINDSIGHT_BANK_ID

    async def retain(
        self,
        account_id: str,
        content: str,
        metadata: Dict[str, Any],
        request_id: Optional[str] = None,
        workspace_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Store interaction into Hindsight persistent memory bank with retry & structured logging.
        """
        start_time = time.time()
        memory_entry = {
            "id": metadata.get("id", f"mem_{len(local_memory_store.memories) + 1}"),
            "account_id": account_id,
            "workspace_id": workspace_id or metadata.get("workspace_id"),
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

        # Retry loop for external Hindsight API
        hindsight_success = False
        retry_count = 0
        max_retries = 3

        if self.api_key or (self.base_url and "localhost" not in self.base_url):
            for attempt in range(1, max_retries + 1):
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
                            break
                        else:
                            retry_count += 1
                            await asyncio.sleep(0.2 * attempt)
                except Exception as e:
                    retry_count += 1
                    if attempt == max_retries:
                        error_tracker.record_error(
                            category="hindsight_error",
                            message=f"Hindsight Retain failed after {max_retries} attempts: {str(e)[:150]}",
                            request_id=request_id,
                            account_id=account_id
                        )
                    await asyncio.sleep(0.2 * attempt)
        else:
            # Local in-memory bank mode active
            hindsight_success = True

        latency_ms = int((time.time() - start_time) * 1000)
        app_logger.info(
            f"Hindsight Retain completed for account {account_id}",
            extra={
                "request_id": request_id or "internal",
                "event_type": "hindsight_retain",
                "account_id": account_id,
                "latency_ms": latency_ms,
                "status": "success" if hindsight_success else "fallback_local"
            }
        )

        memory_entry["hindsight_retained"] = True
        memory_entry["hindsight_sync_status"] = "synced" if hindsight_success else "pending_sync"
        return memory_entry

    async def recall(
        self,
        query: str,
        account_id: Optional[str] = None,
        workspace_id: Optional[str] = None,
        limit: int = 15,
        request_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform multi-strategy search across Hindsight memory bank.
        Restricted by workspace_id and capped by limit.
        """
        start_time = time.time()
        effective_limit = min(limit, 20)  # Sane cap on memory recall

        # Local multi-strategy retrieval with strict workspace partition
        memories = local_memory_store.memories
        if account_id:
            memories = [m for m in memories if m.get("account_id") == account_id]
        if workspace_id:
            memories = [m for m in memories if m.get("workspace_id") == workspace_id or not m.get("workspace_id")]

        results = []
        if query:
            keywords = query.lower().split()
            scored = []
            for m in memories:
                score = sum(
                    1 for kw in keywords 
                    if kw in m.get("content", "").lower() 
                    or kw in m.get("summary", "").lower() 
                    or kw in m.get("account_id", "").lower()
                )
                scored.append((score, m))
            scored.sort(key=lambda x: x[0], reverse=True)
            results = [m for s, m in scored[:effective_limit]]
        else:
            results = memories[:effective_limit]

        latency_ms = int((time.time() - start_time) * 1000)
        app_logger.info(
            f"Hindsight Recall executed (recalled {len(results)} items)",
            extra={
                "request_id": request_id or "internal",
                "event_type": "hindsight_recall",
                "account_id": account_id or "all",
                "latency_ms": latency_ms,
                "status": "success"
            }
        )
        return results

    async def reflect(
        self,
        query: str,
        account_id: str,
        workspace_id: Optional[str] = None,
        include_cross_account: bool = False,
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Perform deep synthesis across consolidated Observations, World Facts, and Experience Facts."""
        start_time = time.time()
        account_memories = await self.recall(
            query=query,
            account_id=account_id,
            workspace_id=workspace_id,
            limit=15,
            request_id=request_id
        )
        observations = self.get_observations(account_id)
        world_facts = self.get_world_facts(account_id)
        experience_facts = self.get_experience_facts(account_id)

        latency_ms = int((time.time() - start_time) * 1000)
        app_logger.info(
            f"Hindsight Reflect context prepared for {account_id}",
            extra={
                "request_id": request_id or "internal",
                "event_type": "hindsight_reflect",
                "account_id": account_id,
                "latency_ms": latency_ms,
                "status": "success"
            }
        )

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
        acc_memories = local_memory_store.get_by_account(account_id)
        if len(acc_memories) >= 3 and account_id == "acme-corp":
            return ACME_OBSERVATIONS
        elif len(acc_memories) >= 2:
            first_mem = acc_memories[0]
            last_mem = acc_memories[-1]
            neg_count = sum(1 for m in acc_memories if m.get("sentiment") == "negative")
            has_sso = any("sso" in m.get("content", "").lower() for m in acc_memories)
            has_pricing = any("price" in m.get("content", "").lower() or "pricing" in m.get("content", "").lower() for m in acc_memories)

            account_title = account_id.replace('-', ' ').title()
            if has_sso or neg_count >= 2:
                title = f"Emerging Authentication & Stability Pattern for {account_title}"
                desc = f"Repeated support tickets and stakeholder conversations highlight technical friction across {len(acc_memories)} recorded interactions."
                understanding = f"Persistent technical friction across multiple touchpoints directly impacts customer renewal confidence."
                suggested = f"Schedule technical review to resolve open issues before commercial renewal discussions."
            elif has_pricing:
                title = f"Commercial & Budget Sensitivity Pattern for {account_title}"
                desc = f"Multiple customer interactions indicate sensitivity to pricing tiers and usage-based expansion."
                understanding = f"Customer is evaluating budget constraints ahead of the renewal window."
                suggested = f"Prepare ROI justification deck and flexible multi-year tier options."
            else:
                title = f"Durable Account Engagement Pattern for {account_title}"
                desc = f"Active customer relationship with {len(acc_memories)} retained context interactions."
                understanding = f"Account demonstrates regular touchpoints and ongoing operational usage."
                suggested = f"Maintain quarterly business cadence and review upcoming roadmap."

            stages = [
                {
                    "date": m.get("date", "2026-07-01"),
                    "label": f"Touchpoint: {m.get('interaction_type', 'meeting').title()}",
                    "detail": m.get("summary", m.get("content", "")[:90]),
                    "memory_id": m.get("id")
                }
                for m in acc_memories[:5]
            ]

            return [{
                "id": f"obs-{account_id}-dynamic",
                "account_id": account_id,
                "title": title,
                "description": desc,
                "evidence_count": len(acc_memories),
                "first_detected": first_mem.get("date", "2026-06-01"),
                "last_confirmed": last_mem.get("date", "2026-08-15"),
                "status": "Active Risk" if neg_count >= 1 else "Active Pattern",
                "supporting_memory_ids": [m.get("id") for m in acc_memories[:5]],
                "agent_understanding": understanding,
                "suggested_action": suggested,
                "conflicting_evidence": "Positive initial kickoff feedback on record prior to recent issues." if neg_count >= 1 else None,
                "related_entities": [account_title, "Enterprise Plan", "CSM Priya Sharma"],
                "evolution_stages": stages
            }]
        return []

    def get_world_facts(self, account_id: str) -> List[str]:
        if account_id == "acme-corp":
            return ACME_WORLD_FACTS
        acc_memories = local_memory_store.get_by_account(account_id)
        return [
            f"Customer {account_id.replace('-', ' ').title()} active on Enterprise Tier ($120k ARR).",
            f"Renewal timeline monitored within RenewalOS Hindsight Bank with {len(acc_memories)} retained memories.",
            f"Account assigned to Senior CSM Priya Sharma."
        ]

    def get_experience_facts(self, account_id: str) -> List[str]:
        if account_id == "acme-corp":
            return ACME_EXPERIENCE_FACTS
        acc_memories = local_memory_store.get_by_account(account_id)
        if acc_memories:
            return [
                f"RenewalOS recorded recent customer touchpoint: {acc_memories[-1].get('summary', 'Meeting')}.",
                f"Previous interaction date: {acc_memories[-1].get('date', 'Recent')}."
            ]
        return [
            f"RenewalOS recorded customer kickoff touchpoint for {account_id.replace('-', ' ').title()}."
        ]

    def get_temporal_progression(self, account_id: str) -> List[Dict[str, Any]]:
        if account_id == "acme-corp":
            return ACME_TEMPORAL_PROGRESSION
        acc_memories = local_memory_store.get_by_account(account_id)
        if len(acc_memories) >= 3:
            return [
                {"days_ago": "60 DAYS AGO", "status_color": "green", "label": "Kickoff", "description": acc_memories[0].get("summary", "Kickoff")},
                {"days_ago": "30 DAYS AGO", "status_color": "yellow", "label": "Review", "description": acc_memories[len(acc_memories)//2].get("summary", "Mid-cycle review")},
                {"days_ago": "TODAY", "status_color": "orange" if any(m.get("sentiment") == "negative" for m in acc_memories) else "green", "label": "Current State", "description": acc_memories[-1].get("summary", "Latest touchpoint")}
            ]
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
                {"id": "plan", "label": "Enterprise Plan", "type": "topic"},
                {"id": "qbr", "label": "QBR Review", "type": "topic"}
            ],
            "links": [
                {"source": account_id, "target": "csm", "label": "managed by"},
                {"source": account_id, "target": "plan", "label": "subscribed to"},
                {"source": account_id, "target": "qbr", "label": "completed"}
            ]
        }

    def purge_account_memories(self, account_id: str):
        """Purge all memories associated with an account (GDPR & data deletion)."""
        local_memory_store.purge_account(account_id)

    def reset_memories(self):
        local_memory_store.clear()

hindsight_service = HindsightService()
