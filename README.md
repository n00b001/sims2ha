# 💎 Sims 2 for Home Assistant

A fan-made Home Assistant theme system that dresses your smart home in the
warm, ridiculous look and feel of **The Sims 2**: parchment panels, the
signature panel-blue, gold trim, a glowing plumbob, and a loading screen that
*reticulates your splines*.

> **Fan tribute.** *The Sims 2* is a trademark of Electronic Arts Inc. This
> project is not affiliated with, endorsed by, or sponsored by EA. All Sims
> names and references are used for parody and homage. No EA assets are
> bundled.

---

## ✨ Features

- **Three installable themes** in one file:
  - `sims2` — follows your light/dark preference (recommended)
  - `sims2-light` — warm parchment "Pleasantview daytime"
  - `sims2-dark` — deep navy "midnight plumbob"
- **Full UI coverage** via Home Assistant's native theme variables: header,
  sidebar, cards, buttons, switches, sliders, badges, toggles, text, focus,
  selection, scrollbars.
- **A custom loading screen** (`custom:sims2-loading`) — a full-screen Sims 2
  splash with a floating, mood-shifting plumbob and a rotating list of
  ridiculous tips, from *Reticulating splines* to *Convincing the thermostat
  it is happy*.
- **A custom plumbob card** (`custom:sims2-plumbob`) — the diamond above every
  Sim's head, repurposed as a green/yellow/red status indicator bound to any
  entity.
- **A Sims 2 icon pack** (`sims2:`) — 52 original vector icons: the plumbob,
  simoleon coins, the eight Sim needs, and the buy-mode furniture glyphs
  (rooms, types, shopping categories). Use anywhere you'd use `mdi:`.
- **Eight premade dashboards**, auto-built from your entities with jokes
  baked in: the Bella Goth Memorial Lighting Bureau, Pleasantview Climate
  Control, Reticulating Splines: Power & Energy, Mortimer Goth's Security
  Grid, Don Lothario's Automation Suite, Plumbob Command, and a Household
  Needs dashboard that maps your home onto the eight Sim needs.

---

## 📦 What gets installed where

```
sims2ha/
├── hacs.json                      # HACS manifest (this repo is a HACS theme)
├── themes/
│   └── sims2.yaml                  # the three themes (light + dark, via anchors)
├── www/community/sims2ha/          # copy this whole folder into your HA www/
│   ├── sims2-loading-card.js       # custom:sims2-loading
│   ├── sims2-plumbob-card.js       # custom:sims2-plumbob
│   ├── sims2-icons.js             # the sims2: icon pack (52 icons)
│   ├── sims2-fonts.css             # Fredoka font + scrollbar/selection
│   └── sims2-overrides.css         # optional document-level flavour
├── dashboards/                     # premade Lovelace YAML dashboards
│   ├── sims2-overview.yaml
│   ├── sims2-lights.yaml
│   ├── sims2-climate.yaml
│   ├── sims2-power.yaml
│   ├── sims2-security.yaml
│   ├── sims2-automations.yaml
│   ├── sims2-system.yaml
│   ├── sims2-needs.yaml
│   └── static/sims2-starter.yaml   # works with zero extra integrations
├── config-examples/
│   └── configuration.yaml          # copy/paste snippets
└── docs/
    ├── PALETTE.md                  # the design contract (colours, voice, naming)
    ├── ICONS.md                    # the sims2: icon pack catalogue
    └── CARD-MOD.md                 # optional deep styling via card-mod
```

---

## 🚀 Installation

### Step 1 — Install the theme (HACS)

This repository is a **HACS theme**.

1. In Home Assistant, open **HACS → Frontend**.
2. Click the three dots (top right) → **Custom repositories**.
3. Add `https://github.com/n00b001/sims2ha`, category **Theme**, and Add.
4. Find **Sims 2** in the list and **Install** it.
5. Reload themes: **Developer tools → YAML → Reload Themes** (or restart).
6. Pick the theme: **Settings → System → (your profile, top right) → Theme →
   Sims 2**.

At this point your whole UI is already re-skinned using the theme variables.
The next steps add the loading screen, the plumbob, and the dashboards.

### Step 2 — Install the custom cards & fonts

The theme handles colours. The loading screen and plumbob are custom cards
that need to be copied into your `www/` folder and registered as resources.

1. Copy the contents of `www/community/sims2ha/` from this repo into
   `<home-assistant-config>/www/community/sims2ha/` on your server.
   (Create the folders if they do not exist.)
2. Register the files as Lovelace resources. The easiest way is the UI:
   **Settings → Dashboards → Resources → Add resource**, one per file:

   | URL | Resource type |
   |---|---|
   | `/local/community/sims2ha/sims2-loading-card.js` | JavaScript module |
   | `/local/community/sims2ha/sims2-plumbob-card.js` | JavaScript module |
   | `/local/community/sims2ha/sims2-icons.js` | JavaScript module (icon pack) |
   | `/local/community/sims2ha/sims2-fonts.css` | Stylesheet |
   | `/local/community/sims2ha/sims2-overrides.css` | Stylesheet (optional) |

   > **Note:** `/local/...` maps to your `<config>/www/` folder. After copying
   > files, clear your browser cache (or append `?v=2`) so HA re-reads them.

   Alternatively, add them under `frontend:` in `configuration.yaml` — see
   `config-examples/configuration.yaml`.

### Step 3 — Add the premade dashboards (optional, but fun)

The premade dashboards auto-populate from your entities. They use the free
**[auto-entities](https://github.com/thomasloven/lovelace-auto-entities)**
integration (install via HACS → Frontend). Register the dashboards by adding
the `lovelave:` block from `config-examples/configuration.yaml`, then reload.
The sidebar fills up with Pleasantview.

> No auto-entities? Start with `dashboards/static/sims2-starter.yaml` — it
> needs nothing extra and still shows the splash, the plumbob, and the jokes.

---

## 🎛️ Using the custom cards

### Loading screen

```yaml
type: custom:sims2-loading
wordmark: PLEASANTVIEW        # the gold wordmark text
duration: 6                    # seconds before auto-dismiss (0 = forever)
fullscreen: true               # overlay the whole viewport
tips:                          # optional: override the built-in tip list
  - Reticulating your Zigbee mesh
  - Convincing the thermostat it is happy
```

Drop it in as the only card on a dedicated view for a true splash screen, or
at the top of any dashboard. Click the plumbob for a fresh task. Bind
`dismiss_entity` to a sensor to hide it when a load completes.

### Plumbob

```yaml
# Numeric sensor: >= 66 green, >= 33 yellow, else red
type: custom:sims2-plumbob
title: Household Morale
entity: sensor.house_mood_score
green_above: 66
yellow_above: 33

# Or map explicit states
type: custom:sims2-plumbob
title: Bella Goth
entity: person.bella_goth
state_map:
  home: green
  not_home: red
```

---

## 🖼️ Icon pack

Once `sims2-icons.js` is registered (Step 2), **52 icons** become available under
the `sims2:` prefix and recolour automatically with the theme. The full catalogue
lives in [docs/ICONS.md](docs/ICONS.md); the highlights:

```yaml
# Entity icons
light.kitchen:
  icon: sims2:room-kitchen
sensor.house_mood:
  icon: sims2:plumbob-mood-green
person.bella_goth:
  icon: sims2:sim

# Any card or dashboard
- type: entity
  entity: light.living_room
  icon: sims2:type-lighting
```

Groups included: `plumbob` (+ mood variants), `simoleon`/`simoleon-stack`,
`sim`/`sim-head`, `aspiration-star`, `want-bubble`, the game-mode marks
(`live-mode`, `buy-mode`, `build-mode`, `cas-mode`, `story-mode`), the eight Sim
needs (`need-hunger` … `need-room`), rooms (`room-kitchen` … `room-hallway`),
buy-mode types (`type-comfort` … `type-toys`), and shopping controls
(`shop-tag`, `shop-cart`, `sort-rooms`, `sort-price`, …).

---

## 🎨 Customising

- **Palette & voice:** `docs/PALETTE.md` is the single source of truth. Edit
  the colour tokens in `themes/sims2.yaml` to retune the whole UI.
- **Loading tips:** edit `SIMS2_DEFAULT_TIPS` in
  `www/community/sims2ha/sims2-loading-card.js`, or pass `tips:` per card.
- **Deep styling** (gradient panel headers, sidebar rail, settings pages):
  install [card-mod](https://github.com/thomasloven/lovelace-card-mod) and
  apply the snippet in `docs/CARD-MOD.md`. Optional — the theme looks correct
  without it.

---

## ❓ Troubleshooting

- **Card shows "Custom element doesn't exist: custom:sims2-loading"** — the JS
  module is not registered as a resource (Step 2) or the URL is wrong. URLs
  start with `/local/...`, files live under `<config>/www/...`.
- **Theme did not change** — reload themes (Developer tools → YAML → Reload
  Themes) and confirm the theme is selected in your profile.
- **Dashboards show a red error card** — install the **auto-entities**
  integration (HACS → Frontend), or use the static starter dashboard.
- **Fonts look plain** — the Fredoka web font loads from Google Fonts. If your
  network blocks it, set `--sims2-font-display` to a locally-hosted face.
- **Changed files, nothing happened** — Home Assistant caches Lovelace
  resources aggressively. Clear your browser cache or bump the resource URL
  with `?v=2`.

---

## 🧪 Compatibility

- Home Assistant **2024.4** or newer (the `tile` card and modern theme
  variables are used). Older versions mostly work; the `tile` cards fall back
  gracefully.
- Optional: [auto-entities](https://github.com/thomasloven/lovelace-auto-entities),
  [card-mod](https://github.com/thomasloven/lovelace-card-mod).

---

## 🤝 Credits & license

- **License:** MIT — see [LICENSE](LICENSE).
- **Inspired by** the r/homeassistant ["Sims 2 inspired dashboard" project of
  the day](https://www.reddit.com/r/homeassistant/comments/1usr3qp/project_of_the_day_a_sims_2_inspired_dashboard/).
- *The Sims 2*, the plumbob, Pleasantview, and all character names (Bella Goth,
  Mortimer Goth, Don Lothario, et al.) are trademarks of Electronic Arts Inc.,
  referenced here affectionately and without any EA assets.

Pull requests welcome. May your splines always be fully reticulated. 💎
