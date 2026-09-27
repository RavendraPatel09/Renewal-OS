# Changelog — RenewalOS

All notable changes to this project are documented in this file.

## [2.1.0] - 2026-09-28
### Added
- **Observability & Logging:** Structured JSON logging with request correlation IDs (`X-Request-ID`), latency tracking, and centralized error monitoring (`ErrorTracker`).
- **Rate Limiting & Abuse Protection:** Sliding window rate limiting on `/api/auth/*`, `/api/copilot/query`, and demo endpoints with `HTTP 429` responses.
- **Write Idempotency:** Duplicate prevention for interaction creation preventing double-click corruptions.
- **Data Rights & GDPR Deletion:** `DELETE /api/accounts/{account_id}` endpoint cascading database cleanup and Hindsight memory bank purging.
- **Disaster Recovery:** Automated database backup script (`scripts/backup_db.sh`), restore script (`scripts/restore_db.sh`), and recovery documentation.
- **Automated Test Coverage:** 14 automated unit and integration tests covering Recall vs Reflect routing, write idempotency, rate limiting, and multi-tenant isolation.
- **CI Pipeline:** GitHub Actions workflow (`.github/workflows/ci.yml`) for automated backend testing and frontend production builds.

## [2.0.0] - 2026-09-28
### Added
- **Full-Stack Hindsight Integration:** Retain, Recall, Reflect, dynamic observation consolidation, temporal retrieval, and cross-account learning.
- **Authentication & Database:** JWT bearer tokens, bcrypt password hashing, SQLAlchemy ORM schema for Users, Workspaces, Accounts, Commitments, Interactions, and Feedback.
- **UI Redesign:** Modern Linear/Raycast minimalist aesthetic, eliminating all generic AI SaaS clichés.

## [1.0.0] - 2026-09-27
### Added
- Initial RenewalOS UI/UX design prototype.
