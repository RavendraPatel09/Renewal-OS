# RenewalOS — Database Backup & Disaster Recovery Guide

## 1. Overview

RenewalOS persists relational state (Users, Workspaces, Accounts, Commitments, Audit Events) in PostgreSQL (production) or SQLite (development). Customer interactions and consolidated observations are synchronized with Hindsight Memory Banks (`renewal_os_bank`).

---

## 2. Automated Backup Procedure

### Running Backups
To create an instantaneous, compressed snapshot of the database:
```bash
# Automated SQLite or PostgreSQL backup
./scripts/backup_db.sh
```

### Environment Overrides
- `DATABASE_URL`: Target database connection string (e.g., `postgresql://user:pass@host:5432/renewalos`).
- `BACKUP_DIR`: Directory where timestamped backups are stored (defaults to `./backups`).

---

## 3. Disaster Recovery Procedure

### Scenario 1: SQLite Recovery
```bash
./scripts/restore_db.sh ./backups/renewalos_sqlite_20260928_010000.db
```

### Scenario 2: PostgreSQL Managed Instance Recovery
```bash
./scripts/restore_db.sh ./backups/renewalos_pg_20260928_010000.sql.gz "postgresql://user:pass@host:5432/renewalos"
```

---

## 4. Hindsight Memory Bank Synchronization

If the primary database is restored from a historical snapshot:
1. Start the FastAPI backend: `uvicorn app.main:app --port 8000`.
2. The `lifespan` handler automatically verifies memory bank alignment.
3. For individual accounts requiring reconciliation, invoke:
   ```http
   POST /api/accounts/{account_id}/interactions/{interaction_id}/resync
   ```
