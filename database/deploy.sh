#!/usr/bin/env sh
set -eu

MYSQL_HOST=${MYSQL_HOST:-${MYSQL_ADDON_HOST:-}}
MYSQL_PORT=${MYSQL_PORT:-${MYSQL_ADDON_PORT:-3306}}
MYSQL_DATABASE=${MYSQL_DATABASE:-${MYSQL_ADDON_DB:-}}
MYSQL_USER=${MYSQL_USER:-${MYSQL_ADDON_USER:-}}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-${MYSQL_ADDON_PASSWORD:-}}

: "${MYSQL_HOST:?Define MYSQL_HOST o MYSQL_ADDON_HOST}"
: "${MYSQL_DATABASE:?Define MYSQL_DATABASE o MYSQL_ADDON_DB}"
: "${MYSQL_USER:?Define MYSQL_USER o MYSQL_ADDON_USER}"
: "${MYSQL_PASSWORD:?Define MYSQL_PASSWORD o MYSQL_ADDON_PASSWORD}"

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

echo "Aplicando esquema RutiGo en ${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}..."
MYSQL_PWD="$MYSQL_PASSWORD" mysql \
  --protocol=TCP \
  --host="$MYSQL_HOST" \
  --port="$MYSQL_PORT" \
  --user="$MYSQL_USER" \
  --default-character-set=utf8mb4 \
  "$MYSQL_DATABASE" < "$SCRIPT_DIR/schema.sql"

echo "Esquema aplicado correctamente."