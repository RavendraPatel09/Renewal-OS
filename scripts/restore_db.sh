#!/usr/bin/env bash
# RenewalOS Database Recovery Script
set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <backup_file_path> [target_db_url]"
  exit 1
fi

BACKUP_FILE="$1"
DATABASE_URL="${2:-${DATABASE_URL:-sqlite:///./renewalos.db}}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

if [[ "$BACKUP_FILE" == *.db ]]; then
  DB_PATH="${DATABASE_URL#sqlite:///}"
  cp "$BACKUP_FILE" "$DB_PATH"
  echo "Restored SQLite database from $BACKUP_FILE to $DB_PATH"
elif [[ "$BACKUP_FILE" == *.sql.gz ]]; then
  gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
  echo "Restored PostgreSQL database from $BACKUP_FILE"
else
  echo "Unrecognized backup file format: $BACKUP_FILE"
  exit 1
fi
