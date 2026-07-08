#!/usr/bin/env bash
# Idempotent PocketBase installer. Run as root (or via sudo) on Debian/Ubuntu.
# Reads config from ../.env — copy .env.example to .env first.
set -euo pipefail

cd "$(dirname "$0")"
[ -f ../.env ] || { echo "Missing ../.env — copy .env.example to .env and fill it in."; exit 1; }
set -a; . ../.env; set +a

: "${PB_VERSION:?set PB_VERSION in .env}"
: "${PB_DATA_DIR:=/opt/pocketbase}"
PB_USER=pocketbase

# --- arch ---
case "$(uname -m)" in
  x86_64)  ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  *) echo "unsupported arch: $(uname -m)"; exit 1 ;;
esac

# --- system user + dirs ---
id -u "$PB_USER" &>/dev/null || useradd --system --home "$PB_DATA_DIR" --shell /usr/sbin/nologin "$PB_USER"
mkdir -p "$PB_DATA_DIR"

# --- fetch binary (only if version differs) ---
CURRENT="$(/usr/local/bin/pocketbase --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)"
if [ "$CURRENT" != "$PB_VERSION" ]; then
  TMP="$(mktemp -d)"
  URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip"
  echo "Downloading $URL"
  curl -fsSL "$URL" -o "$TMP/pb.zip"
  unzip -o "$TMP/pb.zip" -d "$TMP" >/dev/null
  install -m 0755 "$TMP/pocketbase" /usr/local/bin/pocketbase
  rm -rf "$TMP"
else
  echo "PocketBase $PB_VERSION already installed."
fi

chown -R "$PB_USER:$PB_USER" "$PB_DATA_DIR"

# --- systemd ---
sed "s#__DATA_DIR__#$PB_DATA_DIR#g" pocketbase.service > /etc/systemd/system/pocketbase.service
systemctl daemon-reload
systemctl enable pocketbase
systemctl restart pocketbase

echo
echo "Done. PocketBase $PB_VERSION on 127.0.0.1:8090 (behind Caddy)."
echo "Next:"
echo "  1. Create the superuser INTERACTIVELY:"
echo "       sudo -u $PB_USER /usr/local/bin/pocketbase superuser upsert <email> --dir $PB_DATA_DIR/pb_data"
echo "     (check 'pocketbase superuser --help' — subcommand name varies by version)"
echo "  2. Apply migrations from pb_migrations/, then verify /api/realtime streams."
