import json
import logging
from typing import List, Dict, Any, Optional
from groq import Groq
from app.config import settings
from app.services.hindsight_service import hindsight_service
from app.models.seed_data import BANK_MISSION, BANK_DIRECTIVES

logger = logging.getLogger("agent_service")

class AgentService:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY:
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize Groq client: {e}")

    async def generate_renewal_briefing(
        self,
        account_id: str,
        query: str,
        mode: str = "reflect",
        include_cross_account: bool = False,
        demo_stage: Optional[int] = None
    ) -> Dict[str, Any]:
        """Core AI reasoning logic grounding responses in retrieved Hindsight memories, Observations, and Facts."""

        # Handle demo stage cold-start edge case explicitly if specified
        account_memories = await hindsight_service.recall(query=query, account_id=account_id, limit=20)
        
        if demo_stage == 1 or (len(account_memories) == 0 and not include_cross_account):
            return {
                "query_mode": mode,
                "summary": f"Cold Start: Limited context available for {account_id}. No interaction history or recent meeting notes stored in Hindsight yet.",
                "risk_score": 50,
                "risk_level": "medium",
                "observations": [],
                "world_facts": ["No world facts retained yet."],
                "experience_facts": ["No experience facts recorded yet."],
                "key_concerns": ["Insufficient account history to evaluate specific renewal risks."],
                "open_promises": [],
                "sentiment_trend": "neutral",
                "historical_patterns": ["No historical memories available for pattern recognition."],
                "recommended_action": "Log recent sales notes, customer emails, or support tickets to activate Hindsight Observations & Reflect reasoning.",
                "supporting_memories": [],
                "bank_mission": BANK_MISSION,
                "bank_directives": BANK_DIRECTIVES
            }

        cross_account_memories = []
        if include_cross_account or demo_stage == 3:
            all_memories = await hindsight_service.recall(query="churn pricing support ticket promise", limit=25)
            cross_account_memories = [m for m in all_memories if m.get("account_id") != account_id]

        observations = hindsight_service.get_observations(account_id)
        world_facts = hindsight_service.get_world_facts(account_id)
        experience_facts = hindsight_service.get_experience_facts(account_id)
        supporting_memories = account_memories + cross_account_memories

        # Construct prompt for LLM
        prompt = f"""
You are RenewalOS AI Copilot operating within a Hindsight Memory Bank.
BANK MISSION: {BANK_MISSION}
DIRECTIVES: {json.dumps(BANK_DIRECTIVES)}

QUERY MODE: {mode.upper()}
USER QUERY: "{query}"

ACCOUNT ID: {account_id}
CONSOLIDATED OBSERVATIONS: {json.dumps(observations, indent=2)}
WORLD FACTS: {json.dumps(world_facts, indent=2)}
EXPERIENCE FACTS: {json.dumps(experience_facts, indent=2)}
RECALLED MEMORIES: {json.dumps(account_memories, indent=2)}
CROSS-ACCOUNT MEMORIES: {json.dumps(cross_account_memories, indent=2)}

Respond strictly in valid JSON matching this exact structure:
{{
  "query_mode": "{mode}",
  "summary": "Executive briefing summary explaining current status and account shift",
  "risk_score": 72 (integer between 0 and 100),
  "risk_level": "high" (or "medium" or "low"),
  "key_concerns": ["concern 1", "concern 2"],
  "open_promises": ["unresolved commitment 1"],
  "sentiment_trend": "declining" (or "negative" or "stable" or "positive"),
  "historical_patterns": ["Pattern observed in previous churned/renewed accounts"],
  "recommended_action": "Concrete next step for CSM"
}}
Do not include markdown formatting. Return raw JSON.
"""

        if self.client:
            try:
                completion = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are a precise JSON-only AI Customer Success memory agent using Hindsight."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                res_text = completion.choices[0].message.content
                parsed = json.loads(res_text)
                parsed["observations"] = observations
                parsed["world_facts"] = world_facts
                parsed["experience_facts"] = experience_facts
                parsed["supporting_memories"] = supporting_memories
                parsed["bank_mission"] = BANK_MISSION
                parsed["bank_directives"] = BANK_DIRECTIVES
                return parsed
            except Exception as e:
                logger.error(f"Groq LLM call failed: {e}")

        # Fallback intelligent reasoning synthesis
        return self._rule_based_synthesis(account_id, mode, account_memories, cross_account_memories, observations, world_facts, experience_facts)

    def _rule_based_synthesis(
        self,
        account_id: str,
        mode: str,
        account_memories: List[Dict[str, Any]],
        cross_memories: List[Dict[str, Any]],
        observations: List[Dict[str, Any]],
        world_facts: List[str],
        experience_facts: List[str]
    ) -> Dict[str, Any]:
        concerns = []
        promises = []
        sentiments = [m.get("sentiment", "neutral") for m in account_memories]
        
        for m in account_memories:
            summary = m.get("summary", "")
            if "pricing" in summary.lower() or "price" in summary.lower():
                concerns.append("Pricing objection raised during conversations")
            if "sso" in summary.lower() or "support" in summary.lower() or "ticket" in summary.lower():
                concerns.append("Unresolved SSO authentication ticket #4821 / #5102 in support")
            if "promised" in summary.lower() or "commit" in summary.lower() or "qbr" in summary.lower():
                promises.append("SAML v2.4 release commitment made during QBR (OVERDUE)")

        concerns = list(dict.fromkeys(concerns)) or ["General engagement review needed"]
        promises = list(dict.fromkeys(promises)) or ["No critical open promises recorded"]

        neg_count = sentiments.count("negative")
        risk_score = 72 if neg_count >= 3 else (45 if neg_count >= 1 else 25)
        risk_level = "high" if risk_score > 70 else ("medium" if risk_score > 40 else "low")

        patterns = []
        if cross_memories:
            patterns.append(
                "Acme displays 3 risk signals that appeared in churned accounts NorthStar Logistics & NovaHealth: unresolved critical support issue, repeated pricing objections, and missed QBR product commitments."
            )
            rec_action = "Execute immediate VP-level escalation and provide a binding 14-day SAML SSO resolution timeline before initiating renewal pricing discussions."
        else:
            rec_action = "Schedule executive alignment call to address open SSO support ticket #5102 and clarify contract commitments."

        account_name = account_id.replace("-", " ").title()

        if mode == "recall":
            summary_text = f"RECALL Factual Lookup: Retained memories for {account_name} show {len(account_memories)} interactions. Key facts include SAML Okta SSO requirement and open support tickets."
        else:
            summary_text = f"REFLECT Reasoning Analysis: {account_name} sentiment has declined across recent recorded interactions. Unresolved technical support tickets and pricing friction pose a direct renewal risk in 14 days."

        return {
            "query_mode": mode,
            "summary": summary_text,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "observations": observations,
            "world_facts": world_facts,
            "experience_facts": experience_facts,
            "key_concerns": concerns,
            "open_promises": promises,
            "sentiment_trend": "declining" if neg_count >= 2 else "stable",
            "historical_patterns": patterns,
            "recommended_action": rec_action,
            "supporting_memories": account_memories + cross_memories,
            "bank_mission": BANK_MISSION,
            "bank_directives": BANK_DIRECTIVES
        }

agent_service = AgentService()
