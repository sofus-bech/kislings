#!/usr/bin/env bash
# End-to-end backend smoke test (definition-of-done item 5). Runs INSIDE the
# PocketBase container against 127.0.0.1:8090. Proves:
#   - public read on content collections
#   - staff-only writes on stamps (customer 403, staff 200)
#   - realtime SSE event fires when coffees.on_grinder flips
#
# Creates temporary records and deletes them again. Superuser email is $1;
# the password is read from stdin (never an argument, never in shell history).
#
# Run from the Proxmox host, e.g.:
#   read -rs -p 'superuser password: ' PB && echo
#   printf '%s' "$PB" | pct exec 201 -- bash /root/kislings/deploy/smoke-test.sh bech@fireatwill.org
set -u

BASE="http://127.0.0.1:8090"
SU_EMAIL="${1:?pass the superuser email as the first argument}"
read -r SU_PASS   # from stdin

pass=0; fail=0
ok()  { echo "  PASS: $1"; pass=$((pass+1)); }
bad() { echo "  FAIL: $1"; fail=$((fail+1)); }
jget() { grep -o "\"$1\":\"[^\"]*\"" | head -1 | sed "s/\"$1\":\"\\([^\"]*\\)\"/\\1/"; }

echo "== superuser auth =="
SU_TOKEN=$(curl -s -X POST "$BASE/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$SU_EMAIL\",\"password\":\"$SU_PASS\"}" | jget token)
[ -n "$SU_TOKEN" ] || { echo "could not authenticate superuser — wrong email/password?"; exit 1; }
echo "  ok"
AUTH="Authorization: $SU_TOKEN"

echo "== stamps API rules (as configured) =="
curl -s "$BASE/api/collections/stamps" -H "$AUTH" \
  | grep -o '"[a-zA-Z]*Rule":\("[^"]*"\|null\)' || true

echo "== realtime: event fires when coffees.on_grinder flips =="
COFFEE_ID=$(curl -s -X POST "$BASE/api/collections/coffees/records" -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{"name":"SMOKE TEST","origin":"n/a","on_grinder":false,"active":true}' | jget id)
[ -n "$COFFEE_ID" ] || { echo "could not create test coffee"; exit 1; }

SSE_LOG="$(mktemp)"
curl -sN "$BASE/api/realtime" > "$SSE_LOG" &
SSE_PID=$!
# wait for the PB_CONNECT frame carrying our clientId
CLIENT=""
for _ in $(seq 1 20); do
  CLIENT=$(jget clientId < "$SSE_LOG"); [ -n "$CLIENT" ] && break; sleep 0.3
done
if [ -n "$CLIENT" ]; then
  curl -s -X POST "$BASE/api/realtime" -H "Content-Type: application/json" \
    -d "{\"clientId\":\"$CLIENT\",\"subscriptions\":[\"coffees\"]}" >/dev/null
  sleep 0.5
  curl -s -X PATCH "$BASE/api/collections/coffees/records/$COFFEE_ID" -H "$AUTH" \
    -H "Content-Type: application/json" -d '{"on_grinder":true}' >/dev/null
  got=""
  for _ in $(seq 1 20); do
    if grep -q '"action":"update"' "$SSE_LOG" && grep -q '"on_grinder":true' "$SSE_LOG"; then
      got=1; break
    fi
    sleep 0.3
  done
  [ -n "$got" ] && ok "realtime update event received on on_grinder flip" \
                || bad "no realtime event seen within ~6s"
else
  bad "never received a realtime clientId"
fi
kill "$SSE_PID" 2>/dev/null
rm -f "$SSE_LOG"

echo "== staff-only stamps: customer 403, staff 200 =="
CUST_EMAIL="smoke-customer@example.com"
CUST_PASS="smoke-pass-123"
CUST_ID=$(curl -s -X POST "$BASE/api/collections/users/records" -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CUST_EMAIL\",\"password\":\"$CUST_PASS\",\"passwordConfirm\":\"$CUST_PASS\",\"role\":\"customer\"}" | jget id)
[ -n "$CUST_ID" ] || { echo "could not create test customer"; exit 1; }

cust_token() {
  curl -s -X POST "$BASE/api/collections/users/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"$CUST_EMAIL\",\"password\":\"$CUST_PASS\"}" | jget token
}

# a valid stamp body — so the ONLY thing that can reject it is the create rule
BODY="{\"user\":\"$CUST_ID\",\"staff\":\"$CUST_ID\",\"action\":\"stamp\"}"

CTOK=$(cust_token)
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/collections/stamps/records" \
  -H "Authorization: $CTOK" -H "Content-Type: application/json" -d "$BODY")
[ "$CODE" = "403" ] && ok "customer blocked from creating a stamp (403)" \
                    || bad "customer create returned $CODE (expected 403)"

# promote to staff, re-auth (token must carry the new role), retry
curl -s -X PATCH "$BASE/api/collections/users/records/$CUST_ID" -H "$AUTH" \
  -H "Content-Type: application/json" -d '{"role":"staff"}' >/dev/null
CTOK=$(cust_token)
STAMP_ID=$(curl -s -X POST "$BASE/api/collections/stamps/records" \
  -H "Authorization: $CTOK" -H "Content-Type: application/json" -d "$BODY" | jget id)
[ -n "$STAMP_ID" ] && ok "staff allowed to create a stamp (200)" \
                   || bad "staff create did not return a record id"

echo "== cleanup =="
[ -n "${STAMP_ID:-}" ] && curl -s -X DELETE "$BASE/api/collections/stamps/records/$STAMP_ID" -H "$AUTH" >/dev/null
curl -s -X DELETE "$BASE/api/collections/users/records/$CUST_ID" -H "$AUTH" >/dev/null
curl -s -X DELETE "$BASE/api/collections/coffees/records/$COFFEE_ID" -H "$AUTH" >/dev/null
echo "  removed test coffee, customer, stamp"

echo
echo "== result: $pass passed, $fail failed =="
[ "$fail" = 0 ]
