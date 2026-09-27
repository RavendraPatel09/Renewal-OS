#!/usr/bin/env bash
# RenewalOS Automated Database Backup Script
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_URL="${DATABASE_URL:-sqlite:///./renewalos.db}"

mkdir -p "$BACKUP_DIR"

if [[ "$DATABASE_URL" == sqlite* ]]; then
  DB_PATH="${DATABASE_URL#sqlite:///}"
  TARGET_BACKUP="$BACKUP_DIR/renewalos_sqlite_$TIMESTAMP.db"
  if [ -f "$DB_PATH" ]; then
    sqlite3 "$DB_PATH" ".backup '$TARGET_BACKUP'"
    echo "SQLite backup successfully created at: $TARGET_BACKUP"
  else
    echo "SQLite database file not found at $DB_PATH"
    exit 1
  fi
elif [[ "$DATABASE_URL" == postgresql* ]] || [[ "$DATABASE_URL" == postgres* ]]; then
  TARGET_BACKUP="$BACKUP_DIR/renewalos_pg_$TIMESTAMP.sql.gz"
  pg_dump "$DATABASE_URL" | gzip > "$TARGET_BACKUP"
  echo "PostgreSQL backup successfully created at: $TARGET_BACKUP"
else
  echo "Unsupported DATABASE_URL scheme: $DATABASE_URL"
  exit 1
fi
