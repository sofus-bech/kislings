# Handoff: Kislings Café iOS App

## Overview
Companion app for **Kislings Café & Kaffebar** (Perlegade 49, 6400 Sønderborg, DK) — a neighborhood specialty coffee bar. The app gives regulars a loyalty card (QR + stamps), the current coffees, brew guides, menus (PDF), news and practical info. All UI copy is **Danish**, lowercase-hearted, no exclamation marks.

Mood: stylish, simple, homey, slow living, hygge. Explicitly NOT hipster, loud, techy, or startup-y.

## About the Design Files
The files in this bundle are **design references created in HTML** — a clickable prototype showing intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (SwiftUI, React Native, Flutter, etc.) using its established patterns and libraries. If no codebase exists yet, native SwiftUI is the natural choice for an iOS-only café app.

- `Kislings App.dc.html` — the full prototype (all screens + interactions). Open in a browser to click through.
- `kislings-design-brief.md` — the original brief; the source of truth for brand direction.
- `ios-frame.jsx`, `image-slot.js` — prototype scaffolding only (device bezel, image placeholder). Ignore for implementation.

## Fidelity
**High-fidelity.** Colors, typography, spacing and interactions are final intent — recreate pixel-perfectly. The only placeholders are photos (image slots) — real, warm, candid café photography must be supplied (courtyard, cups, hands, wood).

## Design Tokens

### Color (fixed — do not deviate)
- `#0D0C0B` — app background (soft warm black; never pure #000)
- `#161412` — raised surfaces / cards
- `#F5F1EA` — primary text (warm off-white; never pure #FFF)
- `#9B948A` — secondary text, inactive tab icons/labels
- `#C8A268` — single accent, "crema" gold. Used ONLY for: active tab, filled stamp rings, "PÅ KVÆRNEN" eyebrows. Max one accent element per screen (tab bar excluded).
- `#2A2622` — hairline dividers and card borders (always 1px)

No gradients (except photo scrims), no shadows, no other colors, no emoji in UI, no blue links.

### Typography
- **Display serif:** Fraunces (Google Fonts) — or **New York** on native iOS. Weight 500, letter-spacing -0.01em. Screen titles, coffee names, card headlines, menu languages, spec values only.
- **UI sans:** Inter — or **SF Pro** on native iOS. Weights 400–600.
- **Eyebrows/labels:** 10–11px, uppercase, letter-spacing 0.14–0.16em, sans.

Scale used: 32–34px screen titles/detail headlines, 26–28px card titles/menu rows, 19–20px list item names, 13–15px body, 10–12px meta/eyebrows.

### Shape & spacing
- Card radius 14px (16px on loyalty cards/QR surface), 1px `#2A2622` border, no shadow.
- Screen padding: 20–24px horizontal, 76px top (below status bar), ~120px bottom (above tab bar).
- Section gap ~32px; card gaps 14–16px.
- Touch targets ≥ 44px.
- Icons: thin line style (1.5px stroke), monochrome.

### Motion
Minimal. One soft fade/settle on screen appearance: opacity 0→1 + translateY 6px→0, 0.35–0.4s ease. The home-card slider animates translateX 0.35s ease. Nothing bouncy.

## Navigation
Bottom tab bar, 5 tabs: **Hjem · Kort · Kaffen · Menukort · Info**.
- Bar: `rgba(13,12,11,.92)` + backdrop blur 14px, 1px top hairline.
- Tabs: 23px line icon + 10px label. Active = gold `#C8A268`, inactive = `#9B948A`.
- Icons: house, card (rect + line), coffee cup with handle, three horizontal lines, info circle.
- Detail views (coffee / news / brew guide) open as full-screen covers above the tab bar with a back button; back returns to the originating tab. Opening a tab dismisses any detail.

## Screens

### 1. Hjem
- **Header row:** left — eyebrow "GODMORGEN" (secondary) over customer first name in serif 32px; right — "KISLINGS" wordmark, serif 17px, letter-spacing 0.16em. (A white logo asset exists; use it instead of the text wordmark.)
- **PÅ KVÆRNEN card** (tappable → coffee detail): gold eyebrow "PÅ KVÆRNEN", serif coffee name 26px, secondary origin line ("Colombia · vasket"), one tasting-note line 14px.
- **Condensed loyalty card** (tappable → Kort tab): eyebrow header showing current pane name ("KAFFE" / "BØNNER · 250 G"); a horizontal slider with ‹ › chevrons on either side; each pane = row of mini stamp rings (16px) + count right-aligned ("6 af 10" / "2 af 6", 12px secondary). **Swipeable** (horizontal drag > 30px switches pane; a swipe must not trigger the card tap). Chevron dims to `#2A2622` when its direction is unavailable.
- **NYHEDER:** exactly ONE news card — photo (150px, top of card), serif title 19px, date 12px secondary. Tap → news detail.
- **Next event teaser:** hairline-top row, eyebrow "NÆSTE ARRANGEMENT" + one line ("Gårdhavekoncert · fredag kl. 17.30").

### 2. Kort (loyalty)
Centered column on the black background:
- "KISLINGS" wordmark top, serif 19px, letter-spacing 0.18em.
- **QR code** (customer ID) on a raised `#161412` surface, radius 16, padding 24. Modules in `#F5F1EA`.
- Helper: "vis koden til baristaen" (13px secondary).
- **Two stamp cards**, each a raised card (radius 16, padding 20, centered eyebrow):
  1. **KAFFE** — 10 coffee-ring stamps in a 5×2 grid (38px rings, 44px cells). Status line: "6 af 10 — 4 kaffer til en gratis".
  2. **BØNNER · 250 G** — 6 stamps in one row. Status line: "2 af 6 — 4 poser til en gratis"; full: "6 af 6 — din næste pose er gratis".
- Footer: "stemplet ved kassen — kop for kop, pose for pose" (12px secondary).

**Signature element — the coffee-ring stamps.** Filled: 3px solid `#C8A268` ring with a faint inner ring (inset 1.5px at 30% gold), organic irregular border-radius (e.g. `46% 54% 52% 48%` — vary per stamp) and a small random rotation (−18°…20°) so they look hand-stamped, opacity 0.92. Empty: 1px solid `#2A2622` circle. The LAST empty stamp (the free one): 1px dashed gold at 55% + a soft outer glow (`0 0 14px rgba(200,162,104,.22)`). When a new stamp is earned it should "print" on with a soft settle — this is the one memorable flourish.

### 3. Kaffen
- Title "Kaffen" serif 32px.
- **Coffee list** (3 cards, tappable → detail): 64px rounded photo left; right: optional gold eyebrow "PÅ KVÆRNEN NU" (on exactly one coffee), serif name 20px, origin · process 12px secondary, tasting notes 13px.
- **BRYGGUIDES** eyebrow + 2×2 grid of cards (tappable → guide detail): serif name 19px + meta line 12px secondary ("1:16 · ca. 2.45 min").

### 4. Menukort
Typographic-only screen:
- Title "Menukort" serif 32px, sub "vælg sprog — åbner som pdf".
- Three large hairline-separated rows: serif 28px **Dansk / English / Deutsch**, sub-line ("menukort · pdf" / "menu · pdf" / "speisekarte · pdf"), thin `→` right. Tap opens the corresponding PDF menu.
- Bottom-anchored quiet note: "fredagsmenu serveres fra 17.30. / køkkenet lukker kl. 16."

### 5. Info
- Title "Info" serif 32px.
- **Map snippet** (150px, radius 14 — real map tile or photo) + "Perlegade 49, 6400 Sønderborg" and secondary sub-line. Tapping should open Maps.
- **ÅBNINGSTIDER** — hairline rows, day left / hours right:
  - mandag–torsdag 08–18
  - fredag 08–21 — note: "køkkenet lukker 16 · fredagsmenu fra 17.30"
  - lørdag 08–18
  - søndag lukket — note: "åbent 9–17 i december"
- **Wi-Fi card:** eyebrow "WI-FI", SSID "Kislings Gæst", password "kaffetid" in monospace, and a pill-shaped hairline **kopiér** button — copies password to clipboard, label flips to "kopieret" for ~1.8s.
- Reservation note: "bordreservation i caféen, min. 4 personer — ring eller skriv."
- **KONTAKT** — hairline rows: mail `info@kislings.dk`, instagram `@kislings`, facebook `/kislings` (tap → mail/app links).

### 6. Detail views (full-screen covers)
- **Coffee detail:** full-bleed photo top (320px) with scrim (dark at very top for the back button, fading to `#0D0C0B` at the bottom edge); circular back button (36px, `rgba(13,12,11,.55)` + blur, hairline border) top-left; optional gold "PÅ KVÆRNEN NU" eyebrow; serif name 34px; origin · process secondary; tasting notes in a hairline-framed band; story paragraph 15px / 1.7 line-height.
- **News detail:** same pattern — photo 300px, date eyebrow, serif headline 30px, body 15px / 1.7.
- **Brew guide detail:** back button, eyebrow "BRYGGUIDE", serif title 34px; **spec block** — hairline-bordered rounded box, 4 columns (RATIO / DOSIS / VAND / TEMP) with eyebrow labels and serif values; **numbered steps** — hairline rows: serif step number (secondary), step text 14px, right-aligned monospace timing ("0.45").

## Interactions & Behavior
- Tab switch: swaps screen, resets any open detail, plays the fade-in.
- Cards/rows: pressed state = opacity ~0.8 (no scale, no bounce).
- Condensed loyalty slider: chevron tap or horizontal swipe (>30px) switches pane; plain tap navigates to Kort tab; a swipe must suppress the tap.
- Wi-Fi copy: clipboard write + temporary label change ("kopiér" → "kopieret", ~1.8s).
- Menukort rows: open PDF (in-app viewer or share sheet).
- Detail covers scroll independently; back dismisses.

## State Management
- `activeTab` (hjem | kort | kaffen | menukort | info)
- `detail` (none | coffee | news | guide, with selected item) — cleared on tab change
- `homeCardPane` (0 = kaffe, 1 = bønner)
- `wifiCopied` (transient, auto-resets)
- Data to fetch/serve: customer (name, ID for QR, coffeeStamps 0–10, beanStamps 0–6), coffees (name, origin, process, notes, story, photo, onGrinder flag), news (title, date, photo, body), events, brew guides (static), opening hours, Wi-Fi credentials, menu PDFs per language.
- QR in the prototype is a decorative fake — generate a real QR from the customer ID.

## Assets
- Kislings white logo/wordmark (client has it; prototype uses a letterspaced text stand-in).
- Photography: all photo areas are drag-and-drop placeholders in the prototype. Needs warm, candid café shots — full-bleed with subtle dark scrim so light text sits on top. No stock-photo gloss.
- Menu PDFs (Dansk / English / Deutsch).
- Fonts: Fraunces + Inter via Google Fonts, or New York + SF Pro natively.

## Files
- `Kislings App.dc.html` — complete prototype: all 5 tabs, 3 detail views, tab bar, loyalty slider, stamps, QR, copy interaction. All styles are inline on the elements; all data and handlers are in the `Component` class at the bottom of the file (Danish copy for coffees, news, guides, hours and contacts lives there — reuse it verbatim).
- `kislings-design-brief.md` — original brief (brand direction, voice, don'ts).
- `ios-frame.jsx`, `image-slot.js` — prototype-only scaffolding; do not port.

## Don't
- No pure #000/#FFF, no gradients (outside photo scrims), no shadows, no badges/pills everywhere
- No more than one accent-colored element per screen
- No emoji, no marketing speak, no exclamation marks in copy
