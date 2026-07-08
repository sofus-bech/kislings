#!/usr/bin/env bash
# Provision a Debian 12 LXC on Proxmox and install the Kislings PocketBase
# backend into it — same deploy/install.sh + Caddy path as the production VPS.
#
# Run as root ON THE PROXMOX HOST, from a checkout of this repo:
#   cd kislings && ./deploy/proxmox-lxc.sh
#
# Defaults suit a homelab test box; override any of these via env:
#   CTID=201 IP4=192.168.1.50/24 GW4=192.168.1.1 ./deploy/proxmox-lxc.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# --- config (override via env) ---
CTID="${CTID:-201}"
CT_HOSTNAME="${CT_HOSTNAME:-kislings-pb}"
STORAGE="${STORAGE:-local-lvm}"            # rootfs storage
TEMPLATE_STORAGE="${TEMPLATE_STORAGE:-local}"
BRIDGE="${BRIDGE:-vmbr0}"
IP4="${IP4:-dhcp}"                         # or CIDR, e.g. 192.168.1.50/24
GW4="${GW4:-}"                             # required when IP4 is static
DISK_GB="${DISK_GB:-8}"
MEMORY_MB="${MEMORY_MB:-1024}"
CORES="${CORES:-1}"
PB_VERSION="${PB_VERSION:-0.39.6}"         # keep in sync with .env.example
PB_DATA_DIR="${PB_DATA_DIR:-/opt/pocketbase}"
PB_DOMAIN="${PB_DOMAIN:-pb.kislings.dk}"
# 1 = Caddy self-signed cert (homelab testing, default).
# 0 = real Let's Encrypt — only works if PB_DOMAIN publicly resolves to this
#     container and ports 80/443 are forwarded to it.
TLS_INTERNAL="${TLS_INTERNAL:-1}"

command -v pct >/dev/null || { echo "pct not found — run this on the Proxmox host."; exit 1; }
[ -f "$REPO_ROOT/deploy/install.sh" ] || { echo "deploy/install.sh not found — run from a repo checkout."; exit 1; }

if pct status "$CTID" &>/dev/null; then
  echo "CT $CTID already exists. Pick a free ID: CTID=<id> $0"
  exit 1
fi

# --- template ---
echo "==> Locating Debian 12 template"
TEMPLATE="$(pveam available --section system 2>/dev/null | awk '{print $2}' | grep '^debian-12-standard' | sort -V | tail -1 || true)"
[ -n "$TEMPLATE" ] || { echo "No debian-12-standard template offered by pveam."; exit 1; }
if ! pveam list "$TEMPLATE_STORAGE" | grep -q "$TEMPLATE"; then
  echo "==> Downloading $TEMPLATE to $TEMPLATE_STORAGE"
  pveam update
  pveam download "$TEMPLATE_STORAGE" "$TEMPLATE"
fi

# --- create + start ---
echo "==> Creating CT $CTID ($CT_HOSTNAME)"
NET0="name=eth0,bridge=$BRIDGE,ip=$IP4"
[ -n "$GW4" ] && NET0="$NET0,gw=$GW4"
pct create "$CTID" "$TEMPLATE_STORAGE:vztmpl/$TEMPLATE" \
  --hostname "$CT_HOSTNAME" \
  --unprivileged 1 \
  --features nesting=1 \
  --cores "$CORES" --memory "$MEMORY_MB" --swap 512 \
  --rootfs "$STORAGE:$DISK_GB" \
  --net0 "$NET0" \
  --onboot 1

pct start "$CTID"

echo "==> Waiting for network in CT $CTID"
for i in $(seq 1 30); do
  pct exec "$CTID" -- getent hosts deb.debian.org >/dev/null 2>&1 && break
  [ "$i" = 30 ] && { echo "CT has no DNS/network after 60s — check bridge/IP settings."; exit 1; }
  sleep 2
done

# --- copy repo deploy files in ---
echo "==> Copying deploy files into CT"
TARBALL="$(mktemp)"
tar -C "$REPO_ROOT" -czf "$TARBALL" deploy
pct exec "$CTID" -- mkdir -p /root/kislings
pct push "$CTID" "$TARBALL" /root/kislings.tgz
pct exec "$CTID" -- tar -xzf /root/kislings.tgz -C /root/kislings
pct exec "$CTID" -- rm /root/kislings.tgz
rm -f "$TARBALL"

# --- inside-container setup script ---
SETUP="$(mktemp)"
cat > "$SETUP" <<'INSIDE'
#!/usr/bin/env bash
set -euo pipefail
PB_VERSION="$1"; PB_DATA_DIR="$2"; PB_DOMAIN="$3"; TLS_INTERNAL="$4"
export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y curl unzip ca-certificates gnupg apt-transport-https

# Caddy — official repo
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  > /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y caddy

# .env for install.sh — no secrets in here, just version + data dir
cd /root/kislings
printf 'PB_VERSION=%s\nPB_DATA_DIR=%s\n' "$PB_VERSION" "$PB_DATA_DIR" > .env

bash deploy/install.sh

# Caddyfile: swap in the requested domain; self-signed TLS for homelab
cp deploy/Caddyfile /etc/caddy/Caddyfile
sed -i "1s|^[^ ]*|$PB_DOMAIN|" /etc/caddy/Caddyfile
if [ "$TLS_INTERNAL" = "1" ]; then
  sed -i '1a\	tls internal' /etc/caddy/Caddyfile
fi
caddy validate --config /etc/caddy/Caddyfile
systemctl enable --now caddy
systemctl reload caddy
INSIDE
pct push "$CTID" "$SETUP" /root/kislings-setup.sh
rm -f "$SETUP"

echo "==> Installing PocketBase $PB_VERSION + Caddy inside CT"
pct exec "$CTID" -- bash /root/kislings-setup.sh "$PB_VERSION" "$PB_DATA_DIR" "$PB_DOMAIN" "$TLS_INTERNAL"
pct exec "$CTID" -- rm /root/kislings-setup.sh

CT_IP="$(pct exec "$CTID" -- hostname -I | awk '{print $1}')"
echo
echo "Done. CT $CTID ($CT_HOSTNAME) is up at $CT_IP"
echo
echo "Next steps:"
echo "  1. Create the superuser INTERACTIVELY (never scripted with a literal password):"
echo "       pct exec -it $CTID -- runuser -u pocketbase -- \\"
echo "         /usr/local/bin/pocketbase superuser upsert <email> --dir $PB_DATA_DIR/pb_data"
if [ "$TLS_INTERNAL" = "1" ]; then
  echo "  2. Point $PB_DOMAIN at the container for testing, e.g. on your machine:"
  echo "       echo '$CT_IP $PB_DOMAIN' | sudo tee -a /etc/hosts"
  echo "     then open https://$PB_DOMAIN/_/ (self-signed cert — expect a browser warning)."
else
  echo "  2. Ensure $PB_DOMAIN resolves publicly to this host with 80/443 forwarded,"
  echo "     then open https://$PB_DOMAIN/_/"
fi
echo "  3. Apply migrations from pb_migrations/, then verify /api/realtime streams."
