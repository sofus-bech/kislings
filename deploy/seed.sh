#!/usr/bin/env bash
# Seed the Kislings backend with the prototype's Danish content so the admin UI
# has data and the app has live records to read. Runs INSIDE the PocketBase
# container against 127.0.0.1:8090. Idempotent: skips any collection that
# already has records, so it's safe to re-run.
#
# Superuser email is $1; password is read from stdin (never an argument).
# From the Proxmox host:
#   read -rs -p 'superuser password: ' PB && echo
#   printf '%s' "$PB" | pct exec 201 -- bash /root/kislings/deploy/seed.sh bech@fireatwill.org
set -u

BASE="http://127.0.0.1:8090"
SU_EMAIL="${1:?pass the superuser email as the first argument}"
read -r SU_PASS

jget() { grep -o "\"$1\":\"[^\"]*\"" | head -1 | sed "s/\"$1\":\"\\([^\"]*\\)\"/\\1/"; }

SU_TOKEN=$(curl -s -X POST "$BASE/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$SU_EMAIL\",\"password\":\"$SU_PASS\"}" | jget token)
[ -n "$SU_TOKEN" ] || { echo "could not authenticate superuser — wrong email/password?"; exit 1; }
AUTH="Authorization: $SU_TOKEN"

has_records() {
  local n
  n=$(curl -s "$BASE/api/collections/$1/records?perPage=1" -H "$AUTH" \
    | grep -o '"totalItems":[0-9]*' | grep -o '[0-9]*')
  [ "${n:-0}" -gt 0 ]
}

# create <collection> <json>  → prints a dot on success, X + body on failure
create() {
  local coll="$1" body="$2" out code
  out=$(curl -s -w $'\n%{http_code}' -X POST "$BASE/api/collections/$coll/records" \
    -H "$AUTH" -H "Content-Type: application/json" -d "$body")
  code=$(printf '%s' "$out" | tail -1)
  if [ "$code" = "200" ]; then printf '.'; else printf '\nX %s -> %s\n' "$coll" "$(printf '%s' "$out" | head -1)"; fi
}

seed() {
  local coll="$1"; shift
  if has_records "$coll"; then echo "skip $coll (already has records)"; return; fi
  printf 'seed %s ' "$coll"
  "$@"
  printf ' done\n'
}

# ── settings ──────────────────────────────────────────────────────────────
seed_settings() {
  create settings '{
    "address":"Perlegade 49, 6400 Sønderborg",
    "lat":54.9139,"lng":9.7915,
    "opening_hours":[
      {"day":"mandag–torsdag","time":"08–18","note":""},
      {"day":"fredag","time":"08–21","note":"køkkenet lukker 16 · fredagsmenu fra 17.30"},
      {"day":"lørdag","time":"08–18","note":""},
      {"day":"søndag","time":"lukket","note":"åbent 9–17 i december"}
    ],
    "wifi_ssid":"Kislings Gæst","wifi_password":"kaffetid",
    "instagram":"@kislings","facebook":"/kislings",
    "phone":"","email":"info@kislings.dk"
  }'
}

# ── coffees ───────────────────────────────────────────────────────────────
seed_coffees() {
  create coffees '{"name":"La Esperanza","origin":"Colombia","process":"vasket","tasting_notes":"rød frugt, karamel, ren eftersmag","on_grinder":true,"active":true}'
  create coffees '{"name":"Duromina","origin":"Etiopien","process":"vasket","tasting_notes":"bergamot, abrikos, te-agtig","on_grinder":false,"active":true}'
  create coffees '{"name":"São Silvestre","origin":"Brasilien","process":"natural","tasting_notes":"nødder, mørk chokolade, blød","on_grinder":false,"active":true}'
}

# ── news ──────────────────────────────────────────────────────────────────
seed_news() {
  create news '{"title":"Gårdhavekoncert på fredag","published_at":"2026-07-12 10:00:00.000Z","body":"<p>Fredag åbner vi gårdhaven for en stille aften med trioen fra Alsion. Musik fra 17.30, fredagsmenuen serveres samtidig. Der er plads til omkring 40 — kom i god tid, eller reservér et bord hvis I er fire eller flere.</p>"}'
  create news '{"title":"Ny kaffe fra Colombia","published_at":"2026-07-04 10:00:00.000Z","body":"<p>La Esperanza fra Huila er landet og ligger på kværnen nu. Rød frugt, karamel og en ren eftersmag. Vi rister selv profilerne. Kontra brænder bønnerne. Du drikker resultatet.</p>"}'
}

# ── events ────────────────────────────────────────────────────────────────
seed_events() {
  create events '{"title":"Gårdhavekoncert","starts_at":"2026-07-17 17:30:00.000Z","body":"<p>En stille aften i gårdhaven med trioen fra Alsion. Musik fra 17.30, fredagsmenuen serveres samtidig.</p>"}'
}

# ── recipes ───────────────────────────────────────────────────────────────
seed_recipes() {
  create recipes '{"method":"V60","dose":"15 g","water":"240 ml","ratio":"1:16","grind":"mellemfin","temp":"94°","steps":"<ol><li>Skyl filteret med varmt vand og hæld det ud.</li><li>Tilsæt 15 g mellemfin kaffe. Nulstil vægten.</li><li>Hæld 45 ml vand og lad kaffen blomstre.</li><li>Hæld roligt op til 150 ml i cirkler.</li><li>Fyld op til 240 ml. Lad det løbe igennem.</li><li>Færdig når lejet er fladt.</li></ol>"}'
  create recipes '{"method":"AeroPress","dose":"14 g","water":"210 ml","ratio":"1:15","grind":"fin","temp":"92°","steps":"<ol><li>Saml AeroPressen omvendt. Skyl filteret.</li><li>Tilsæt 14 g fintmalet kaffe og 210 ml vand.</li><li>Rør tre gange. Sæt låget på.</li><li>Vent. Vend den over koppen.</li><li>Pres langsomt — cirka 20 sekunder.</li></ol>"}'
  create recipes '{"method":"Stempelkande","dose":"30 g","water":"450 ml","ratio":"1:15","grind":"grov","temp":"95°","steps":"<ol><li>Tilsæt 30 g groftmalet kaffe.</li><li>Hæld 450 ml vand over. Rør forsigtigt.</li><li>Læg låget løst på. Vent.</li><li>Skum toppen af med en ske.</li><li>Pres stemplet halvt ned og skænk.</li></ol>"}'
  create recipes '{"method":"Moka","dose":"fuld kurv","water":"til ventilen","ratio":"—","grind":"fin","temp":"medium","steps":"<ol><li>Fyld underdelen med varmt vand til ventilen.</li><li>Fyld kurven med fintmalet kaffe. Pres ikke.</li><li>Skru sammen og sæt på medium varme.</li><li>Tag den af, når det begynder at gurgle.</li></ol>"}'
}

# ── menus (no PDF file yet — owner uploads in admin) ──────────────────────
seed_menus() {
  create menus '{"title":"Dansk","sort_order":1}'
  create menus '{"title":"English","sort_order":2}'
  create menus '{"title":"Deutsch","sort_order":3}'
}

seed settings seed_settings
seed coffees  seed_coffees
seed news     seed_news
seed events   seed_events
seed recipes  seed_recipes
seed menus    seed_menus

echo "seed complete."
