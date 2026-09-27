# RenewalOS REST API Reference (v2.1.0)

Base URL: `http://localhost:8000` (Local) / `https://api.renewalos.ai` (Production)

Interactive Documentation (OpenAPI/Swagger): `http://localhost:8000/docs`

---

## 1. Authentication & Security Headers

All protected endpoints require a JWT Bearer Token:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```
Every response returns a unique correlation ID header:
```http
X-Request-ID: 3dd5e635-76ac-4eaf-b281-728f21d76e6c
```

---

## 2. API Endpoints Table

| Method | Endpoint | Description | Rate Limit | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Create user and workspace | 10 req/min | No |
| `POST` | `/api/auth/signin` | Authenticate and obtain JWT | 15 req/min | No |
| `GET` | `/api/auth/me` | Current user profile | 60 req/min | Yes |
| `GET` | `/api/accounts` | List portfolio accounts | 60 req/min | Optional |
| `GET` | `/api/accounts/{id}` | Account detail record | 60 req/min | Optional |
| `DELETE` | `/api/accounts/{id}` | GDPR data deletion & memory purge | 10 req/min | Yes |
| `GET` | `/api/accounts/{id}/interactions` | Account touchpoint history | 60 req/min | Optional |
| `POST` | `/api/accounts/{id}/interactions` | Retain new interaction to Hindsight | 30 req/min | Optional |
| `POST` | `/api/accounts/{id}/interactions/{id}/resync` | Re-sync interaction to Hindsight | 30 req/min | Optional |
| `GET` | `/api/accounts/{id}/renewal-brief` | AI-synthesized renewal brief | 30 req/min | Optional |
| `GET` | `/api/accounts/{id}/meeting-prep` | Meeting preparation brief | 30 req/min | Optional |
| `POST` | `/api/accounts/{id}/meeting-notes` | Add meeting notes & retain memory | 30 req/min | Optional |
| `POST` | `/api/copilot/query` | Recall / Reflect Copilot query | 30 req/min | Optional |
| `GET` | `/api/memories` | List all memory bank records | 60 req/min | Optional |
| `POST` | `/api/feedback` | Submit user feedback | 20 req/min | Optional |
| `POST` | `/api/demo/reset` | Reset demo memory bank cache | 20 req/min | Optional |
| `POST` | `/api/demo/seed` | Seed full 176+ demo memories | 20 req/min | Optional |
| `GET` | `/api/activity` | Live agent audit trail | 60 req/min | Yes |
| `GET` | `/api/health` | Deep health check | Unlimited | No |
| `GET` | `/api/observability/metrics` | System error & token metrics | 60 req/min | No |

---

## 3. Rate Limiting Responses

When rate limits are exceeded, the API responds with `HTTP 429 Too Many Requests`:
```json
{
  "detail": "Rate limit exceeded. Please wait 42 seconds before retrying."
}
```
Header: `Retry-After: 42`
