#!/bin/sh
set -eu

DB_PATH="${DATABASE_PATH:-/data/todos.sqlite}"

mkdir -p "$(dirname "$DB_PATH")"
sqlite3 "$DB_PATH" < /docker-entrypoint-initdb.d/init.sql

echo "SQLite database ready at $DB_PATH"
tail -f /dev/null
