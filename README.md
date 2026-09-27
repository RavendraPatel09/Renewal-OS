# RenewalOS — AI Customer Success Memory Agent (Hindsight-Native Architecture)

> **Tagline:** *Remember Every Customer. Learn From Every Renewal.*  
> **Built for the AI-Agent Hackathon:** *"AI Agents That Learn Using Hindsight"* (Vectorize.io)

---

## 🌟 1. Product Overview

**RenewalOS** is an AI Customer Success memory agent designed to eliminate customer churn and protect recurring revenue. Built natively around **Hindsight** (by Vectorize.io), **FastAPI**, **React 18**, **Tailwind CSS**, and **Groq LLM**, RenewalOS transforms disconnected touchpoints (Gong calls, Zendesk support tickets, QBR slides, emails) into an evolving, persistent memory bank.

Unlike traditional tools that treat LLM memory as ephemeral context windows or flat vector search over static PDFs, RenewalOS implements Hindsight's native memory lifecycle: **Retain $\rightarrow$ Remember $\rightarrow$ Recall $\rightarrow$ Observe $\rightarrow$ Reflect $\rightarrow$ Act $\rightarrow$ Learn Again**.

---

## 🎯 2. The Problem

Enterprise Customer Success teams lose high-value accounts because critical context degrades across time and silos:
1. **Broken Promises:** A CSM commits to an engineering bug patch in July; by October's renewal conversation, the promise has been forgotten by the vendor, but not the customer.
2. **Context Amnesia:** Support escalations, Slack syncs, and executive objections live in separate systems without historical consolidation.
3. **No Cross-Account Learning:** The same churn pattern happens repeatedly across accounts without the team recognizing the early warning signals.

---

## 💡 3. The Solution

RenewalOS provides a persistent memory brain for every customer account:
- **Remembers Every Interaction:** Captures notes, calls, and tickets, separating durable **World Facts** from tactical **Experience Facts**.
- **Consolidates Observations:** Automatically connects repeated issues into higher-level understanding backed by verifiable memory evidence.
- **Understands Time (Temporal Recall):** Tracks the 60-day evolution of customer sentiment and relationship health.
- **Cross-Account Churn Recognition:** Identifies early risk patterns by matching against historically lost and renewed accounts.
- **Evidence-First Copilot:** Powers executive renewal briefings and meeting preparations strictly grounded in memory bank records without hallucination.

---

## 🏗️ 4. Hindsight Architecture

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

## 🧬 5. Retain, Recall, Reflect & Observations

| Core Concept | Role in RenewalOS | Example in Demo |
| :--- | :--- | :--- |
| **Retain** | Ingests new interaction touchpoints into the persistent memory bank. | Log support ticket `#4821` about Okta SAML timeout. |
| **Recall** | Multi-strategy search for known customer facts. | *"What did Acme say about SAML SSO?"* |
| **Observe** | High-level pattern consolidation across multiple memories. | *"Persistent SSO dissatisfaction across 5 interactions despite QBR promise."* |
| **Temporal** | Chronological progression tracking changes over time. | 60 days ago 🟢 $\rightarrow$ 45 days ago 🟡 $\rightarrow$ Today 🔴 |
| **Reflect** | Deep reasoning over accumulated memories and cross-account patterns. | *"Should I be concerned about Acme's renewal?"* |
| **Act** | Grounded recommendations and open commitment enforcement. | Resolve overdue SAML patch before discussing pricing expansion. |

---

## 📊 6. Memory Types: World vs Experience Facts

1. **🌐 World Facts:** Durable truths about the customer organization, architecture, scale, and compliance constraints.
   - *Example:* "Acme Corp uses Enterprise Tier with 450 active users and requires Okta SAML SSO."
2. **⚡ Experience Facts:** Tactical actions and commitments recorded during specific touchpoints.
   - *Example:* "CSM Priya Sharma committed to engineering patch v2.4 during July QBR."
3. **✨ Consolidated Observations:** Meta-understanding synthesized over time backed by explicit memory IDs.
   - *Example:* "Acme Corp's renewal is blocked on SSO stability; customer sentiment has declined."

---

## 🛠️ 7. Tech Stack

- **Backend:** Python 3.13, FastAPI, SQLAlchemy, Pydantic v2, Pytest
- **AI & Memory:** Hindsight API (Vectorize.io), Groq LLM (`llama-3.3-70b-versatile`) with deterministic rule-based fallback
- **Database:** SQLite (development) / PostgreSQL (production)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router v6
- **Security:** Bcrypt password hashing, PyJWT bearer token authentication

---

## 🔐 8. Authentication & Authorization

- Secure JWT authentication (`/api/auth/signup`, `/api/auth/signin`, `/api/auth/me`).
- Protected Route Guards (`<ProtectedRoute>`) ensuring private access to workspace assets.
- Workspace-level data isolation preventing cross-tenant data leakage.

---

## ⚡ 9. Quick Start & Local Setup

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- (Optional) Groq API key for live LLM reasoning

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Run automated test suites (8/8 passing)
PYTHONPATH=. pytest

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

## 🎬 10. The 7-Scene Hackathon Demo Flow (`/demo`)

Navigate to `/demo` in the application to experience the step-by-step scenario:

1. **Scene 1 (Cold Start):** Account begins with zero memories; Copilot reports baseline lack of context.
2. **Scene 2 (RECALL):** Retains initial memories; factual lookup retrieves exact SAML SSO requirements.
3. **Scene 3 (OBSERVE):** Ingests 5 interactions; consolidates the high-level observation *"Persistent SSO Dissatisfaction"*.
4. **Scene 4 (TEMPORAL):** Queries 60-day progression showing health shift from Kickoff to Overdue Escalation.
5. **Scene 5 (REFLECT):** Executes deep reasoning synthesis answering *"What should I do before renewal?"*.
6. **Scene 6 (ACT):** Matches cross-account churn patterns from *NorthStar Logistics* & *NovaHealth* and outputs a VP-level escalation plan.
7. **Scene 7 (LEARN AGAIN):** Retains a new executive sync note; future Copilot reasoning immediately adapts with updated timeline context.

---

## 🧪 11. Automated Verification Suite

Run the full automated test suite verifying the memory loop:
```bash
cd backend
PYTHONPATH=. venv/bin/pytest -v
```

**Verified Test Cases:**
- `test_auth_flow`: User signup, login, JWT token validation, and profile retrieval.
- `test_create_interaction_and_retain`: Database write + Hindsight Retain indexing.
- `test_copilot_recall_query`: Multi-strategy factual memory retrieval.
- `test_copilot_reflect_query`: Evidence-first deep multi-memory reasoning.
- `test_full_memory_evolution_loop`: Interaction $\rightarrow$ Retain $\rightarrow$ Recall $\rightarrow$ Evolve Observation $\rightarrow$ Reflect $\rightarrow$ Grounded Action.
- `test_health`: Deep health inspection (Database, Auth, Memory Bank, LLM Engine).

---

## 🛡️ 12. Security & Production Deployment

- **Database:** Switch `DATABASE_URL` to managed PostgreSQL (`postgresql://...`).
- **Environment Secrets:** Pass `JWT_SECRET`, `HINDSIGHT_API_KEY`, `GROQ_API_KEY` via secure environment variables.
- **CORS:** Configure `CORS_ORIGINS` to your production domain.
- **Audit Logging:** Built-in `AuditEvent` recording captures memory ingestion, reflection queries, and commitment updates without logging sensitive passwords.

---

## 📄 License & Credits

Built for the **AI Agents That Learn Using Hindsight Hackathon**.  
Memory architecture powered by [Vectorize.io Hindsight](https://hindsight.vectorize.io/).
