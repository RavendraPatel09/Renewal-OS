# RenewalOS — AI Customer Success Memory Agent (Hindsight-Native Architecture)

> **Tagline:** *Remember Every Customer. Learn From Every Renewal.*  
> **Built for the AI-Agent Hackathon:** *"AI Agents That Learn Using Hindsight"* (Vectorize.io)  
> **Version:** 2.1.0

---

## 🌟 1. Product Overview

**RenewalOS** is an AI Customer Success memory agent designed to eliminate customer churn and protect recurring revenue. Built natively around **Hindsight** (by Vectorize.io), **FastAPI**, **React 18**, **Tailwind CSS**, and **Groq LLM**, RenewalOS transforms disconnected customer touchpoints (sales calls, support tickets, QBR slides, executive emails) into an evolving, persistent memory bank.

Unlike traditional tools that treat LLM memory as ephemeral context windows or flat vector search over static text chunks, RenewalOS implements Hindsight's native memory lifecycle: **Retain $\rightarrow$ Remember $\rightarrow$ Recall $\rightarrow$ Observe $\rightarrow$ Reflect $\rightarrow$ Act $\rightarrow$ Learn Again**.

---

## 🏗️ 2. Hindsight Memory Architecture

```
                          ┌──────────────────────────────────────┐
                          │         CUSTOMER INTERACTIONS        │
                          │ (Sales, Support, QBR, Email, Meeting) │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────┐
                          │               RETAIN                 │
                          │   Extract Facts & Ingest Memory      │
                          └──────────────────┬───────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │       HINDSIGHT MEMORY BANK (renewal_os_bank)          │
                 │   Mission: Predict renewals & preserve commitments     │
                 │   Directives: Ground in evidence, separate opinions   │
                 └───────────────┬────────────────────────┬───────────────┘
                                 │                        │
                 ┌───────────────┴────────┐     ┌─────────┴──────────────┐
                 ▼                        ▼     ▼                        ▼
           WORLD FACTS             EXPERIENCE FACTS          OBSERVATIONS
         (450 users, Okta SSO)    (Ticket #4821 escalated)   (SSO Dissatisfaction)
                 │                        │                        │
                 └────────────────────────┼────────────────────────┘
                                          │
                                          ▼
                 ┌────────────────────────────────────────────────────────┐
                 │            RECALL  /  TEMPORAL  /  GRAPH               │
                 │   Factual search, 60-day shifts, Entity traversals    │
                 └────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
                 ┌────────────────────────────────────────────────────────┐
                 │                        REFLECT                         │
                 │    Deep multi-memory reasoning & pattern matching     │
                 └────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
                 ┌────────────────────────────────────────────────────────┐
                 │             GROUNDED ACTION & RENEWAL BRIEF            │
                 │   Next steps, open promises, and meeting prep strategy │
                 └────────────────────────────────────────────────────────┘
```

---

## 🧬 3. The Core Memory Loop: Retain, Recall, Reflect & Observations

| Core Concept | Role in RenewalOS | Example in Demo |
| :--- | :--- | :--- |
| **Retain** | Ingests new interaction touchpoints into the persistent memory bank. | Log support ticket `#4821` about Okta SAML timeout. |
| **Recall** | Multi-strategy search for known customer facts. | *"What did Acme say about SAML SSO?"* |
| **Observe** | High-level pattern consolidation across multiple memories. | *"Persistent SSO dissatisfaction across 5 interactions despite QBR promise."* |
| **Temporal** | Chronological progression tracking changes over time. | 60 days ago [Kickoff] $\rightarrow$ 30 days ago [Review] $\rightarrow$ Today [At Risk] |
| **Reflect** | Deep reasoning over accumulated memories and cross-account patterns. | *"Should I be concerned about Acme's renewal?"* |
| **Act** | Grounded recommendations and open commitment enforcement. | Resolve overdue SAML patch before discussing pricing expansion. |

---

## 📊 4. Memory Types: World vs Experience Facts

1. **World Facts:** Durable truths about the customer organization, architecture, scale, and compliance constraints.
   - *Example:* "Acme Corp uses Enterprise Tier with 450 active users and requires Okta SAML SSO."
2. **Experience Facts:** Tactical actions and commitments recorded during specific touchpoints.
   - *Example:* "CSM Priya Sharma committed to engineering patch v2.4 during July QBR."
3. **Consolidated Observations:** Meta-understanding synthesized over time backed by explicit memory IDs.
   - *Example:* "Acme Corp's renewal is blocked on SSO stability; customer sentiment has declined."

---

## 🛠️ 5. Tech Stack & Production Architecture

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, Pytest
- **AI & Memory:** Hindsight API (Vectorize.io), Groq LLM (`llama-3.3-70b-versatile`) with deterministic rule-based fallback
- **Database:** SQLite (development) / PostgreSQL (production)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router v6
- **Security & Observability:** Bcrypt password hashing, PyJWT bearer token authentication, structured JSON logging with correlation IDs (`X-Request-ID`), sliding window rate limiting

---

## ⚡ 6. Quick Start & Local Setup

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Run automated test suites (14/14 passing)
PYTHONPATH=. pytest -v

# Launch FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps

# Build production bundle
npm run build

# Start Vite dev server on port 5173
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Default Credentials:** `priya@company.com` / `password123`

---

## 🧪 7. Automated Test Suite (14 Tests)

Run the full automated test suite verifying routing, idempotency, isolation, and the complete memory loop:
```bash
cd backend
PYTHONPATH=. venv/bin/pytest -v
```

**Test Coverage Summary:**
- `test_health`: Deep health inspection (Database, Auth, Memory Bank, LLM Engine).
- `test_auth_flow`: User signup, login, JWT token validation, and profile retrieval.
- `test_accounts_api`: Account portfolio retrieval and relationship mapping.
- `test_create_interaction_and_retain`: Database write + Hindsight Retain indexing.
- `test_copilot_recall_and_reflect`: Multi-strategy factual lookup and reflection.
- `test_feedback_api`: Feedback persistence and validation.
- `test_demo_stages`: Multi-stage scenario data injection.
- `test_account_deletion_and_memory_purge`: GDPR account deletion and Hindsight memory purge.
- `test_interaction_write_idempotency`: Duplicate write prevention on double-click.
- `test_workspace_adversarial_isolation`: Strict memory boundary across multi-tenant workspaces.
- `test_full_memory_evolution_loop`: Complete interaction $\rightarrow$ Retain $\rightarrow$ Recall $\rightarrow$ Evolve Observation $\rightarrow$ Reflect $\rightarrow$ Grounded Action loop.
- `test_auth_rate_limiting`: Sliding-window abuse and brute-force protection.
- `test_recall_factual_lookup`: Unit test for factual search routing.
- `test_reflect_reasoning_synthesis`: Unit test for multi-memory reasoning routing.

---

## 🛡️ 8. Enterprise Observability & Reliability

1. **Structured JSON Logging:** Every request is tagged with an `X-Request-ID` correlation header. Latency, event type, and component status are recorded without logging passwords or raw memory bodies.
2. **Rate Limiting:** Sliding-window rate limiting on `/api/auth/*` (15 req/min), `/api/copilot/query` (30 req/min), and demo seed/reset endpoints (20 req/min).
3. **Write Idempotency:** Double-click protection via deduplication cache within a 60-second window.
4. **Disaster Recovery:** Automated backup script (`./scripts/backup_db.sh`) and restore script (`./scripts/restore_db.sh`). Documentation available in [`docs/BACKUP_RECOVERY.md`](./docs/BACKUP_RECOVERY.md).
5. **API Documentation:** Complete endpoint guide available in [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md).

---

## ⚠️ 9. Known Limitations (Honest & Documented)

1. **Rate Limiting Scope:** The current rate limiter uses an in-memory sliding window per application worker. In a horizontally scaled multi-worker cluster, an external Redis instance should back the rate limiter.
2. **Disaster Recovery:** Automated backup scripts (`scripts/backup_db.sh`) are designed for single-node or standard PostgreSQL deployments; managed database point-in-time recovery (PITR) should be configured for high-availability production clusters.
3. **Cross-Account Generalization:** When Cross-Account Learning is enabled, patterns are generalized from historical churn accounts within the tenant, but automated redaction of custom named entities relies on deterministic scrub patterns when an external LLM is not configured.
4. **LLM Fallback:** When `GROQ_API_KEY` is not provided, the backend falls back to its deterministic rule-based reflection engine, which retains full fidelity over the 7-scene demo flow and test suite.

---

## 📄 License & Credits

- Built for the **AI Agents That Learn Using Hindsight Hackathon**.
- Memory architecture powered by [Vectorize.io Hindsight](https://hindsight.vectorize.io/).
- License: [MIT](./LICENSE).
