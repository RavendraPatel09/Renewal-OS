from typing import List, Dict, Any
from app.models.schemas import CustomerAccount

BANK_MISSION = "You are the persistent customer-success memory for RenewalOS. Maintain an evidence-grounded understanding of customer relationships over time. Prioritize unresolved customer problems, commitments, sentiment changes, product needs, renewal context, and lessons from previous customer interactions. Never invent customer facts."

BANK_DIRECTIVES = [
    "Always distinguish facts from recommendations.",
    "Never invent a customer interaction.",
    "When making a recommendation, identify the memories supporting it.",
    "Prioritize recent evidence when it conflicts with older information.",
    "When information is uncertain or contradictory, explicitly state the uncertainty.",
    "For risk assessments, explain the evidence rather than presenting an unexplained score."
]

SYNTHETIC_ACCOUNTS = [
    CustomerAccount(
        id="acme-corp",
        name="Acme Corp",
        tier="Enterprise",
        renewal_days=14,
        risk_score=72,
        risk_level="high",
        open_issues_count=2,
        unresolved_promises_count=1,
        recent_sentiment="declining",
        status="active",
        mrr=120000,
        csm_name="Priya Sharma"
    ),
    CustomerAccount(
        id="northstar-logistics",
        name="NorthStar Logistics",
        tier="Enterprise",
        renewal_days=45,
        risk_score=85,
        risk_level="high",
        open_issues_count=4,
        unresolved_promises_count=2,
        recent_sentiment="negative",
        status="churned",
        mrr=95000,
        csm_name="Priya Sharma"
    ),
    CustomerAccount(
        id="vantage-retail",
        name="Vantage Retail",
        tier="Mid-Market",
        renewal_days=30,
        risk_score=25,
        risk_level="low",
        open_issues_count=0,
        unresolved_promises_count=0,
        recent_sentiment="positive",
        status="renewed",
        mrr=45000,
        csm_name="Alex Chen"
    ),
    CustomerAccount(
        id="novahealth",
        name="NovaHealth",
        tier="Enterprise",
        renewal_days=60,
        risk_score=78,
        risk_level="high",
        open_issues_count=3,
        unresolved_promises_count=2,
        recent_sentiment="negative",
        status="churned",
        mrr=110000,
        csm_name="Priya Sharma"
    ),
    CustomerAccount(
        id="bluepeak-systems",
        name="BluePeak Systems",
        tier="Enterprise",
        renewal_days=90,
        risk_score=18,
        risk_level="low",
        open_issues_count=0,
        unresolved_promises_count=0,
        recent_sentiment="positive",
        status="renewed",
        mrr=150000,
        csm_name="Sarah Jenkins"
    ),
    CustomerAccount(
        id="orbit-finance",
        name="Orbit Finance",
        tier="Mid-Market",
        renewal_days=20,
        risk_score=64,
        risk_level="medium",
        open_issues_count=1,
        unresolved_promises_count=1,
        recent_sentiment="declining",
        status="active",
        mrr=60000,
        csm_name="Priya Sharma"
    ),
    CustomerAccount(
        id="vertex-manufacturing",
        name="Vertex Manufacturing",
        tier="Enterprise",
        renewal_days=15,
        risk_score=35,
        risk_level="low",
        open_issues_count=1,
        unresolved_promises_count=0,
        recent_sentiment="positive",
        status="active",
        mrr=85000,
        csm_name="Alex Chen"
    ),
    CustomerAccount(
        id="summit-commerce",
        name="Summit Commerce",
        tier="Mid-Market",
        renewal_days=50,
        risk_score=40,
        risk_level="medium",
        open_issues_count=1,
        unresolved_promises_count=0,
        recent_sentiment="neutral",
        status="active",
        mrr=50000,
        csm_name="Sarah Jenkins"
    )
]

ACME_WORLD_FACTS = [
    "Acme Corp uses Enterprise Tier ($120k ARR).",
    "Acme Corp deployment has 450 active users across Engineering and Product.",
    "Acme Corp requires SAML Okta SSO authentication for security compliance.",
    "Acme Corp contract renewal date is in 14 days."
]

ACME_EXPERIENCE_FACTS = [
    "RenewalOS flagged unresolved support ticket #4821 escalated to Tier 3.",
    "Product Team promised dedicated SAML error fix v2.4 during July QBR.",
    "CSM Priya Sharma scheduled executive escalation call with VP Engineering."
]

ACME_OBSERVATIONS = [
    {
        "id": "obs-acme-sso",
        "account_id": "acme-corp",
        "title": "Persistent SSO Dissatisfaction & Unresolved Engineering Commitment",
        "description": "Acme Corp has experienced recurring SAML SSO authentication failures across 5 interactions despite an explicit QBR commitment from engineering to resolve it by Q3.",
        "evidence_count": 5,
        "first_detected": "2026-06-15",
        "last_confirmed": "2026-08-14",
        "status": "Active Risk",
        "supporting_memory_ids": ["acme-mem-2", "acme-mem-3", "acme-mem-4", "acme-mem-5", "acme-mem-6"],
        "agent_understanding": "This is no longer an isolated technical support ticket. The repeated unresolved authentication problem directly undermines customer trust and jeopardizes the upcoming $120k ARR renewal in 14 days.",
        "suggested_action": "Execute immediate VP Engineering alignment and provide a binding 14-day SAML SSO fix timeline before initiating renewal commercial terms.",
        "conflicting_evidence": "CSM recorded positive executive feedback during initial kickoff, but sentiment degraded sharply following repeated SSO timeouts.",
        "related_entities": ["SAML Okta SSO", "Support Ticket #4821", "Support Ticket #5102", "Priya Sharma", "VP Engineering (Acme)"],
        "evolution_stages": [
            {
                "date": "2026-06-15",
                "label": "Initial SSO Requirement",
                "detail": "Customer reported Okta SAML SSO is strict mandatory compliance for 450 users.",
                "memory_id": "acme-mem-2"
            },
            {
                "date": "2026-07-02",
                "label": "Support Escalation #4821",
                "detail": "Recurring token timeout errors logged; escalated to Tier 3 engineering.",
                "memory_id": "acme-mem-3"
            },
            {
                "date": "2026-07-18",
                "label": "CSM Commitment at QBR",
                "detail": "Product team promised dedicated v2.4 SSO patch by end of quarter.",
                "memory_id": "acme-mem-4"
            },
            {
                "date": "2026-08-04",
                "label": "Unresolved Commitment",
                "detail": "Customer logged ticket #5102 stating authentication still fails for 40% of team.",
                "memory_id": "acme-mem-5"
            },
            {
                "date": "2026-08-14",
                "label": "Renewal Conditioned on Fix",
                "detail": "VP Engineering stated renewal approval blocked until SSO stability is proven.",
                "memory_id": "acme-mem-6"
            }
        ]
    }
]

ACME_TEMPORAL_PROGRESSION = [
    {
        "days_ago": "60 DAYS AGO",
        "status_color": "green",
        "label": "Stable Relationship",
        "description": "Onboarding kickoff completed. SSO requirement submitted as high priority."
    },
    {
        "days_ago": "45 DAYS AGO",
        "status_color": "yellow",
        "label": "SSO Friction",
        "description": "Support Ticket #4821 opened: Okta SSO token authentication failures in production."
    },
    {
        "days_ago": "30 DAYS AGO",
        "status_color": "orange",
        "label": "QBR Commitment",
        "description": "Engineering promised dedicated v2.4 SSO bug patch by end of quarter."
    },
    {
        "days_ago": "15 DAYS AGO",
        "status_color": "red",
        "label": "Overdue Commitment",
        "description": "Support Ticket #5102 logged: SSO issue remains unresolved for 40% of users."
    },
    {
        "days_ago": "TODAY",
        "status_color": "darkred",
        "label": "Renewal Risk Escalation",
        "description": "VP Engineering Email: Renewal conditioned on immediate SSO stability & price review."
    }
]

ACME_KNOWLEDGE_GRAPH = {
    "nodes": [
        {"id": "acme-corp", "label": "Acme Corp", "type": "account"},
        {"id": "sso", "label": "SAML Okta SSO", "type": "topic"},
        {"id": "priya", "label": "Priya Sharma (CSM)", "type": "person"},
        {"id": "vp-eng", "label": "VP Engineering (Acme)", "type": "person"},
        {"id": "ticket-4821", "label": "Ticket #4821 / #5102", "type": "ticket"},
        {"id": "qbr-promise", "label": "QBR SAML v2.4 Promise", "type": "topic"},
        {"id": "engineering", "label": "Tier 3 Engineering", "type": "department"}
    ],
    "links": [
        {"source": "acme-corp", "target": "sso", "label": "requires"},
        {"source": "acme-corp", "target": "priya", "label": "managed by"},
        {"source": "acme-corp", "target": "vp-eng", "label": "sponsored by"},
        {"source": "sso", "target": "ticket-4821", "label": "blocked by"},
        {"source": "ticket-4821", "target": "engineering", "label": "escalated to"},
        {"source": "qbr-promise", "target": "ticket-4821", "label": "promised fix for"},
        {"source": "vp-eng", "target": "qbr-promise", "label": "demands"}
    ]
}

ACME_DEMO_MEMORIES = [
    {
        "id": "acme-mem-1",
        "account_id": "acme-corp",
        "interaction_type": "sales_call",
        "fact_type": "world_fact",
        "date": "2026-06-04",
        "summary": "Pricing objection raised during initial close.",
        "content": "Customer expressed hesitation regarding price-to-value ratio for Enterprise tier and requested custom SLAs.",
        "sentiment": "negative",
        "importance": "medium",
        "source": "Salesforce Gong Import"
    },
    {
        "id": "acme-mem-2",
        "account_id": "acme-corp",
        "interaction_type": "meeting",
        "fact_type": "world_fact",
        "date": "2026-06-18",
        "summary": "Onboarding kickoff: Requested SAML/Okta SSO support.",
        "content": "CTO specified SAML Okta integration as a mandatory requirement for company-wide deployment.",
        "sentiment": "neutral",
        "importance": "high",
        "source": "Zoom Meeting Transcript"
    },
    {
        "id": "acme-mem-3",
        "account_id": "acme-corp",
        "interaction_type": "support_ticket",
        "fact_type": "experience_fact",
        "date": "2026-07-02",
        "summary": "Support Ticket #4821: SSO configuration failing in production.",
        "content": "Users unable to authenticate via Okta SSO. Ticket escalated to Tier 3 engineering.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Zendesk"
    },
    {
        "id": "acme-mem-4",
        "account_id": "acme-corp",
        "interaction_type": "qbr",
        "fact_type": "experience_fact",
        "date": "2026-07-15",
        "summary": "QBR Review: Promised dedicated SSO fix by end of quarter.",
        "content": "Product team committed during QBR to release patch v2.4 with enhanced SAML error handling by end of Q3.",
        "sentiment": "neutral",
        "importance": "high",
        "source": "Notion QBR Notes"
    },
    {
        "id": "acme-mem-5",
        "account_id": "acme-corp",
        "interaction_type": "support_ticket",
        "fact_type": "experience_fact",
        "date": "2026-08-04",
        "summary": "Support Ticket #5102: SSO issue remains unresolved.",
        "content": "Customer reported repeated SSO token expiration errors still blocking 40% of active users.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Zendesk"
    },
    {
        "id": "acme-mem-6",
        "account_id": "acme-corp",
        "interaction_type": "email",
        "fact_type": "experience_fact",
        "date": "2026-08-11",
        "summary": "VP Engineering Email: Frustration over repeated delays.",
        "content": "Email from VP Engineering: 'We are reconsidering our upcoming renewal if SSO stability and contract pricing aren't resolved immediately.'",
        "sentiment": "negative",
        "importance": "high",
        "source": "Gmail Integration"
    }
]

HISTORICAL_CHURN_MEMORIES = [
    {
        "id": "northstar-mem-1",
        "account_id": "northstar-logistics",
        "interaction_type": "support_ticket",
        "fact_type": "experience_fact",
        "date": "2026-02-10",
        "summary": "Unresolved API timeout ticket #3109 left open 45 days.",
        "content": "NorthStar logged critical API timeouts. Support failed to patch within SLA timeline.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Zendesk"
    },
    {
        "id": "northstar-mem-2",
        "account_id": "northstar-logistics",
        "interaction_type": "email",
        "fact_type": "world_fact",
        "date": "2026-03-01",
        "summary": "CFO email objecting to tier renewal price increase.",
        "content": "CFO cited missed feature commitments and refused renewal terms without discount.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Gmail Integration"
    },
    {
        "id": "novahealth-mem-1",
        "account_id": "novahealth",
        "interaction_type": "qbr",
        "fact_type": "experience_fact",
        "date": "2026-04-12",
        "summary": "HIPAA compliance integration promise missed by engineering.",
        "content": "NovaHealth was promised custom HIPAA audit log exports by April QBR. Deliverable was delayed twice.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Notion QBR Notes"
    },
    {
        "id": "novahealth-mem-2",
        "account_id": "novahealth",
        "interaction_type": "email",
        "fact_type": "experience_fact",
        "date": "2026-05-20",
        "summary": "Notice of non-renewal due to unfulfilled product promises.",
        "content": "NovaHealth officially cancelled renewal stating unresolved security ticket and missed commitments.",
        "sentiment": "negative",
        "importance": "high",
        "source": "Gmail Integration"
    }
]

HISTORICAL_RENEWED_MEMORIES = [
    {
        "id": "vantage-mem-1",
        "account_id": "vantage-retail",
        "interaction_type": "meeting",
        "fact_type": "experience_fact",
        "date": "2026-05-10",
        "summary": "Executive escalation meeting with VP of Product resolved blocker.",
        "content": "VP of CS met with Vantage VP of Tech, agreed on a 14-day dedicated engineering sprint which fixed inventory sync.",
        "sentiment": "positive",
        "importance": "high",
        "source": "Zoom Call"
    },
    {
        "id": "bluepeak-mem-1",
        "account_id": "bluepeak-systems",
        "interaction_type": "renewal_call",
        "fact_type": "experience_fact",
        "date": "2026-04-15",
        "summary": "Signed 2-year expansion contract following clear escalation roadmap.",
        "content": "BluePeak renewed early with +20% seat expansion after exec sponsor intervention.",
        "sentiment": "positive",
        "importance": "high",
        "source": "Gong"
    }
]
