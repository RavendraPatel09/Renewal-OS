import pytest
from app.services.agent_service import agent_service
from app.services.hindsight_service import hindsight_service

@pytest.mark.anyio
async def test_recall_factual_lookup():
    hindsight_service.reset_memories()
    await hindsight_service.retain(
        account_id="acme-corp",
        content="Okta SAML SSO timeout errors on port 443 affecting 450 users.",
        metadata={"id": "mem-sso", "interaction_type": "support_ticket", "fact_type": "world_fact", "date": "2026-07-02"}
    )

    # 1. Recall query (Factual lookup)
    res = await agent_service.generate_renewal_briefing(
        account_id="acme-corp",
        query="What did Acme say about SAML SSO?",
        mode="recall",
        include_cross_account=False
    )
    assert res["query_mode"] == "recall"
    assert "RECALL" in res["summary"] or "factual" in res["summary"].lower()
    assert len(res["supporting_memories"]) >= 1
    assert any("okta" in m["content"].lower() or "sso" in m["content"].lower() for m in res["supporting_memories"])

@pytest.mark.anyio
async def test_reflect_reasoning_synthesis():
    hindsight_service.reset_memories()
    await hindsight_service.retain(
        account_id="acme-corp",
        content="Ticket #4821: Okta SAML SSO timeouts.",
        metadata={"id": "m1", "sentiment": "negative", "fact_type": "experience_fact", "date": "2026-07-02"}
    )
    await hindsight_service.retain(
        account_id="acme-corp",
        content="QBR: CSM promised dedicated SAML fix by Q3, currently overdue.",
        metadata={"id": "m2", "sentiment": "negative", "fact_type": "experience_fact", "date": "2026-07-18"}
    )

    # 2. Reflect query (Strategic synthesis)
    res = await agent_service.generate_renewal_briefing(
        account_id="acme-corp",
        query="Should I be concerned about Acme's renewal?",
        mode="reflect",
        include_cross_account=False
    )
    assert res["query_mode"] == "reflect"
    assert res["risk_score"] > 40
    assert len(res["open_commitments"]) >= 1
    assert len(res["key_concerns"]) >= 1
    assert res["recommended_action"] != ""
