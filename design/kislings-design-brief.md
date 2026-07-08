# Kislings — iOS App Design Brief

## Project
Companion app for **Kislings Café & Kaffebar** (Perlegade 49, Sønderborg, DK). A neighborhood specialty coffee bar run by Michael Kisling, ex-roastmaster at Kontra Coffee. The app gives regulars a loyalty card, brew guides, the current coffees, menus, news and practical info.

Design **6 mobile screens (iOS)** as a clickable prototype.

## Brand direction
Mood words: **stylish, simple, homey, slow living, hygge.**
Explicitly NOT: hipster, loud, techy, startup-y. The owner's own words: "no hipster aura." Quality without pretension.

The feeling: sitting by the window with a pour-over on a quiet morning. Calm, warm, unhurried.

## Design tokens

### Color — white on black (fixed, do not deviate)
- `#0D0C0B` — background (soft black, warm undertone — like dark roast, not OLED black)
- `#161412` — raised surfaces / cards
- `#F5F1EA` — primary text (warm off-white)
- `#9B948A` — secondary text
- `#C8A268` — single accent: "crema" gold. Use sparingly — active tab, stamp fill, one CTA per screen
- `#2A2622` — hairline dividers

No gradients. No other colors. Photography provides all additional warmth.

### Typography
- **Display:** a warm, slightly soft serif (Fraunces or similar; New York on iOS). Used for screen titles and coffee names only. Generous size, tight tracking.
- **UI/body:** clean sans (Inter / SF Pro). Regular weight, relaxed line-height.
- Small caps or letterspaced uppercase eyebrows for labels ("PÅ KVÆRNEN", "NYHEDER").

### Layout & feel
- Lots of air. One idea per view. Large touch targets.
- Corner radius 12–16 on cards. Thin 1px hairlines, no shadows.
- Icons: thin line style, monochrome.
- Photography: warm, candid café shots (courtyard, cups, hands, wood) — full-bleed with subtle dark scrim so white text sits on top.
- Motion: minimal. A single soft fade/settle on screen load. Nothing bouncy.

## Signature element
**The stamp card stamps are coffee rings** — circular cup-stains in crema gold that "print" onto the black card one by one. 10 rings; the 10th glows slightly. This is the one memorable flourish; everything else stays quiet.

## Navigation
Bottom tab bar, 5 tabs (Danish labels):
1. **Hjem** 2. **Kort** (loyalty) 3. **Kaffen** 4. **Menukort** 5. **Info**

## Screens

### 1. Hjem
- Greeting + small Kislings wordmark (white logo exists already)
- "PÅ KVÆRNEN" card: the coffee currently in the grinder (name, origin, one tasting note)
- News feed: cards with photo, title, date (e.g. "Gårdhavekoncert på fredag", "Ny kaffe fra Colombia")
- Next event teaser

### 2. Kort (loyalty)
- Full-screen matte-black card, Kislings wordmark top
- Large QR code (customer's ID) centered on a slightly raised surface
- Below: the 10 coffee-ring stamps, e.g. 6 filled / 4 empty, "6 af 10 — 4 kaffer til en gratis"
- Quiet helper text: "Vis koden til baristaen"

### 3. Kaffen
- List of current coffees: name (serif), origin · process, tasting notes, small photo
- One flagged "På kværnen nu"
- Detail view: full-bleed photo, story, notes
- Section below: **Brygguides** — V60, AeroPress, Stempelkande, Moka. Guide detail: ratio/dose/temp as a clean spec block, then numbered steps with timings

### 4. Menukort
- Three large rows: Dansk / English / Deutsch → opens PDF
- Simple, almost typographic-only screen

### 5. Info
- Map snippet + address: Perlegade 49, 6400 Sønderborg
- Opening hours table:
  - Mandag–Torsdag 08–18
  - Fredag 08–21 (køkkenet lukker 16, fredagsmenu fra 17.30)
  - Lørdag 08–18
  - Søndag lukket (åbent 9–17 i december)
- Wi-Fi card: SSID + password with copy button
- Reservation note: "Bordreservation i caféen, min. 4 personer"
- Contact: info@kislings.dk · Instagram @kislings · Facebook /kislings

### 6. Kaffe-detail or News-detail (pick one as the 6th frame)
Show the article/coffee detail layout: full-bleed photo top, serif headline, calm body text.

## Voice
Danish, warm, direct, lowercase-hearted. Short sentences. No exclamation marks, no marketing speak. Example: "Vi rister selv profilerne. Kontra brænder bønnerne. Du drikker resultatet."

## Don't
- No pure #000/#FFF, no blue links, no gradients, no badges/pills everywhere
- No stock-photo gloss, no emoji in UI
- No more than one accent-colored element per screen
