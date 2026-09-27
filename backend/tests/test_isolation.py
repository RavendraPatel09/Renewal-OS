import pytest
from app.services.hindsight_service import hindsight_service

@pytest.mark.anyio
async def test_workspace_adversarial_isolation():
    hindsight_service.reset_memories()

    # Ingest secret memory into Workspace A
    await hindsight_service.retain(
        account_id="secret-account-alpha",
        content="Confidential contract terms for Alpha Corp in Workspace A: $500k ARR.",
        metadata={"id": "mem-ws-a", "workspace_id": "ws-alpha"},
        workspace_id="ws-alpha"
    )

    # Ingest standard memory into Workspace B
    await hindsight_service.retain(
        account_id="public-account-beta",
        content="Standard Enterprise tier review for Beta Corp in Workspace B.",
        metadata={"id": "mem-ws-b", "workspace_id": "ws-beta"},
        workspace_id="ws-beta"
    )

    # 1. Query from Workspace B attempting to find Alpha Corp's secret
    recalled_ws_b = await hindsight_service.recall(
        query="Confidential contract terms Alpha Corp",
        workspace_id="ws-beta",
        limit=20
    )

    # Must NOT return memories from Workspace A
    assert not any(m.get("account_id") == "secret-account-alpha" for m in recalled_ws_b)
    assert not any("500k" in m.get("content", "") for m in recalled_ws_b)

    # 2. Query from Workspace A CAN find its own memories
    recalled_ws_a = await hindsight_service.recall(
        query="Confidential contract terms Alpha Corp",
        workspace_id="ws-alpha",
        limit=20
    )
    assert any(m.get("account_id") == "secret-account-alpha" for m in recalled_ws_a)
