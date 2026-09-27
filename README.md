# RenewalOS — AI Customer Success Memory Agent (Hindsight-Native Architecture)

> **Tagline:** Remember Every Customer. Learn From Every Renewal.  
> **Built for the AI-Agent Hackathon:** *"AI Agents That Learn Using Hindsight"*

---

## 🌟 Overview

**RenewalOS** is an AI Customer Success Memory Agent built natively around **Hindsight** (by Vectorize.io), **FastAPI**, **React**, **Tailwind CSS**, and **Groq LLM**. Customer information is normally scattered across sales calls, emails, support tickets, and QBR meetings. 

RenewalOS does not treat memory as "just a vector database." It natively exposes Hindsight's core architectural concepts: **Retain $\rightarrow$ Recall $\rightarrow$ Reflect**, consolidated **Observations**, **World Facts** vs **Experience Facts**, **Temporal Search**, **Customer Knowledge Graphs**, and **Memory Bank Missions & Directives**.

---

## 🚀 Key Hindsight Features & Differentiators

```
                         RENEWALOS
                            │
                    Customer Interaction
                            │
                            ▼
                    ┌───────────────┐
                    │    RETAIN     │ (Sales, Support, QBR, Email, Renewal)
                    └───────┬───────┘
                            │
                            ▼
                     HINDSIGHT BANK (Mission + Directives)
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
         World Facts   Experience Facts  Observations
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ▼
                     RECALL / TEMPORAL / GRAPH
                            │
                            ▼
                         REFLECT (Deep Reasoning Analysis)
                            │
                            ▼
                   Renewal Intelligence & Action
```

1. **Memory Evolution Engine (`Raw Memories → Facts → Observation`):**  
   Consolidates multiple raw interaction memories into a high-level Hindsight Observation (e.g. *"Acme has persistent SSO dissatisfaction across multiple interactions despite a QBR commitment"*), backed by exact memory evidence, timeline range, and status.

2. **Dual Copilot Modes (`RECALL` vs `REFLECT`):**  
   - **`RECALL` (Factual Search):** Answers queries like *"What did Acme say about SAML SSO?"* using Hindsight multi-strategy keyword/semantic lookup.
   - **`REFLECT` (Deep Reasoning):** Answers queries like *"Should I be concerned about Acme's renewal?"* by synthesizing Observations, World Facts, Experience Facts, and cross-account historical churn patterns.

3. **Configured Memory Bank Mission & Directives:**  
   The `renewal_os_bank` memory bank is explicitly configured with a strict mission and directives (*"Always distinguish facts from recommendations", "Prioritize recent evidence", "Explain evidence rather than presenting unexplained score"*).

4. **60-Day Temporal Evolution Timeline (`Temporal Recall`):**  
   Tracks how customer health shifted over time (60 days ago 🟢 $\rightarrow$ 45 days ago 🟡 $\rightarrow$ 30 days ago 🟠 $\rightarrow$ 15 days ago 🔴 $\rightarrow$ Today 🔴).

5. **Customer Knowledge Graph (`Entity Graph Memory`):**  
   Visualizes entity traversals across accounts, topics, tickets, CSMs, and commitments (e.g. `Acme Corp --[requires]--> SAML Okta SSO --[blocked by]--> Ticket #4821`).

6. **Interactive 7-Step Hackathon Demo Flow (`/demo`):**  
   - **1. RETAIN:** Store single interaction memory.
   - **2. RECALL:** Execute factual search.
   - **3. OBSERVE:** Show Hindsight consolidated observation.
   - **4. TEMPORAL:** Inspect 60-day temporal progression.
   - **5. REFLECT:** Generate evidence-grounded strategic briefing.
   - **6 & 7. LEARN & ACT:** Match historical churn patterns against lost accounts (*NorthStar Logistics*, *NovaHealth*).

---

## 🛠 Tech Stack

- **Backend:** Python 3.13, FastAPI, Pydantic, Hindsight Client Service, Groq LLM API, Pytest
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router v6
- **Memory Engine:** Hindsight Memory Bank (Cloud / Local Server API)

---

## ⚡ Quick Start & Setup

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Run Pytest suite
PYTHONPATH=. pytest

# Start Backend Server (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run build

# Start Frontend Dev Server (runs on http://localhost:5173)
npm run dev
```

---

## 🔗 Official Links & References

- **Hindsight Documentation:** [https://hindsight.vectorize.io/](https://hindsight.vectorize.io/)
- **Hindsight GitHub:** [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Groq AI:** [https://groq.com/](https://groq.com/)
