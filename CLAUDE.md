# CLAUDE.md — Kislings backend

PocketBase backend for the Kislings café app (loyalty card, coffees, recipes, news, events, menus, info). Single Go binary + SQLite + built-in admin UI. Owner edits all content in the admin UI; the iOS app is a thin REST/realtime client.

## Repo layout
```
deploy/
  install.sh          # idempotent installer (system user, binary, systemd)
  pocketbase.service  # systemd unit
  Caddyfile           # TLS + reverse proxy (SSE-safe)
pb_migrations/        # you create this — schema as migrations
.env.example          # copy to .env, fill in, never commit .env
```

## Task (definition of done)
1. Provision the host (see Hosting below) and run `deploy/install.sh`.
2. Pin PocketBase to a specific version in `.env` — do **not** float on `latest`.
3. Create the schema (see Schema) as migrations in `pb_migrations/`.
4. Bring it up behind Caddy on `https://pb.kislings.dk`, verify TLS and that SSE (`/api/realtime`) streams without buffering.
5. Smoke test: public read on content collections, staff-only write on `stamps`, realtime event fires when `coffees.on_grinder` flips.

## Hosting
**Primary target: VPS** (Hetzner CX22, Falkenstein/Nuremberg — close to DK, ~€4/mo). Public IP + Caddy handles TLS via Let's Encrypt. Chosen over the homelab so a power/internet cut at home can't take down the café's loyalty card.

**Homelab variant:** skip Caddy, expose via Cloudflare Tunnel (`cloudflared`) → `127.0.0.1:8090`. Note: Cloudflare buffers by default; SSE still works but confirm events aren't delayed. Ask me before switching to this.

**Testing:** happens on a homelab Proxmox VM (Debian/Ubuntu) treated exactly like the VPS — same `deploy/install.sh` + Caddy path, NOT the Cloudflare Tunnel variant. For TLS in testing, use Caddy's `tls internal` (self-signed) or a LAN hostname unless ports 80/443 are forwarded and `pb.kislings.dk` points at it; production Let's Encrypt needs the domain publicly reachable.

DNS: `pb.kislings.dk` A-record → VPS IP, managed on Simply.com. Keep fireatwill.org where it is.

## Schema
PocketBase collections. **Content = public read.** `users`/`stamps` = locked down.

```
settings   (single record; App = auth-none read)
  address, lat, lng, opening_hours(json),
  wifi_ssid, wifi_password, instagram, facebook, phone, email

news       title, body(rich), image(file), published_at(date)
events     title, body(rich), image(file), starts_at(date)
menus      title, file(pdf), sort_order(number)
coffees    name, origin, process, tasting_notes,
           image(file), on_grinder(bool), active(bool)
recipes    method(select: V60/AeroPress/Stempelkande/Moka),
           dose, water, ratio, grind, temp, steps(rich)

users      (built-in auth)  role(select: customer/staff)
stamps     user(rel→users), staff(rel→users),
           action(select: stamp/redeem), created(auto)
```

### API rules
- `news, events, menus, coffees, recipes, settings`: List/View = public (`""`), Create/Update/Delete = admin only.
- `stamps`: Create/List/View = `@request.auth.role = "staff"`; Update/Delete = admin only. Never client-writable by customers.
- `users`: default auth rules; a customer can read only their own record.

### Loyalty logic (no counter field — derive it)
Stamps since the user's last `redeem` = current count. Hit 10 → staff creates a `redeem` row → count resets. Full audit trail for free. Don't store a mutable `count`.

## Realtime (must not regress)
The app opens one SSE stream on `/api/realtime`, subscribes to `coffees` (later `news`, `events`). Any change → app re-fetches. For this to be instant:
- Caddy: `reverse_proxy` with `flush_interval -1` (disables buffering). Already in the Caddyfile — keep it.
- Content collections must have public List rules or the subscription silently receives nothing.

## Migrations — read before writing
PocketBase's migration JS API differs across versions. **Check `pocketbase --version` and that version's docs; do not write the migration from memory.** This file is the authoritative schema spec — translate it to whatever API the pinned version uses. Generate an initial migration with the CLI where possible rather than hand-writing collection IDs.

## Security constraints
- Secrets (superuser email/password, any tokens) live in `.env` or are set interactively — **never hardcode them in tracked files, and never commit `.env`**.
- Do not create the superuser non-interactively with a literal password in a script. Set it via the CLI/first-run and let the human enter it.
- Firewall: expose only 80/443 publicly; PocketBase binds `127.0.0.1:8090`, reached only through Caddy.
- SSH: key auth only, disable password login and root SSH after setup.

## App (iOS + Android)
- **React Native + Expo**, one codebase for both platforms. Decided over native SwiftUI/Compose because the design is fully custom-drawn (no native chrome) and the prototype logic is already React.
- Lives in `app/` in this repo (monorepo).
- Design source of truth: `design/README.md` (handoff) + `design/Kislings App.dc.html` (prototype — reuse its Danish copy verbatim). Ignore the handoff's "SwiftUI is the natural choice" line; that assumed iOS-only.
- Backend client: official PocketBase JS SDK (REST + realtime subscriptions).
- Fonts via expo-google-fonts (Fraunces + Inter). QR, clipboard, PDF viewing via Expo modules. Builds/submission via EAS.

## Conventions
- Content is **Danish**. Field names/code English, seed/sample data Danish.
- Keep it boring and reproducible: pinned version, systemd, one reverse proxy. No Docker unless asked.
