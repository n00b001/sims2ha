# 💎 Sims 2 for Home Assistant

A fan-made tribute that restyles Home Assistant to look and feel like **The
Sims 2** — and installs in **one step**. Parchment panels, the signature
panel-blue, gold trim, a glowing plumbob, nine auto-created dashboards, and a
loading screen that *reticulates your splines*.

> **Fan tribute.** *The Sims 2* is a trademark of Electronic Arts Inc. This
> project is not affiliated with, endorsed by, or sponsored by EA. All Sims
> names and references are parody and homage. No EA assets are bundled.

---

## ✨ What one install gives you

- **The Sims 2 look, applied automatically** — warm parchment surfaces, panel
  blue, gold trim and a plumbob green, wired into Home Assistant's own theme
  variables so it covers the header, sidebar, cards, switches, sliders, badges
  and Material components. It even follows your system light/dark preference.
  **No `configuration.yaml` edit required** — the look is live the moment you
  add the integration.
- **Nine premade dashboards, created for you** — the moment you click *Add
  Integration* they appear in your sidebar. Seven auto-populate from whatever
  entities exist in your instance.
- **A custom icon pack** (`sims2:` — the plumbob, simoleons, the eight Sim
  needs, buy-mode rooms and more — 52 icons).
- **Custom cards** — a Sims 2 loading splash (`custom:sims2-loading`) with
  rotating ridiculous tips, and a status plumbob (`custom:sims2-plumbob`).
- **The Fredoka typeface** and themed scrollbars, focus rings and selection.
- **`auto-entities` is bundled in** — the auto-populating dashboards need no
  separate install.
- **Easter eggs** — Bella Goth, Mortimer Goth, Don Lothario and friends.

---

## 🚀 Install (one step)

1. In Home Assistant, open **HACS → Custom repositories** (three dots, top
   right), add `https://github.com/n00b001/sims2ha`, category **Integration**.
2. Find **Sims 2** → **Install**.
3. **Restart Home Assistant** (HACS needs this once so the integration loads).
4. **Settings → Devices & Services → Add Integration** → search **Sims 2** →
   click. This runs the automatic setup: it serves the bundle, registers it as a
   Lovelace resource, and creates all nine dashboards.
5. **Refresh your browser.** The Sims 2 look is live and the dashboards are in
   your sidebar.

That's it. **No copy/paste, no manual resource registration, no dashboard
import, no editing YAML.** The dashboards, cards, icons, fonts and the theme
look are all delivered automatically.

> 💡 **Optional — Home Assistant's native theme picker.**
> The Sims 2 look is already applied by an injected style layer (above), so this
> step is *not* required. If you'd rather switch themes from your profile page,
> add this once to `configuration.yaml` and the three Sims 2 themes (`sims2`,
> `sims2-light`, `sims2-dark`) become selectable under your profile:
> ```yaml
> frontend:
>   themes:
>     !include_dir_merge_named themes
> ```

---

## 🗺️ The premade dashboards

| Dashboard | What's in it |
|---|---|
| Pleasantview Overview | Splash, plumbob mascot, live household snapshot |
| Lighting Bureau | Every `light.*`, with a Bella Goth Memorial touch |
| Climate Control | Climate, fans, humidifiers, temperature gauges |
| Power & Energy | Power gauges, energy meters, batteries (reticulating) |
| Security Grid | Locks, alarms, doors, windows, motion (Mortimer Goth's) |
| Automation Suite | Automations, scenes, scripts (Don Lothario's) |
| Plumbob Command | Updates, system vitals, connectivity |
| Household Needs | The eight Sim needs mapped to your sensors |
| Pleasantview Starter | A no-dependency static starter dashboard |

Seven of the nine use the bundled `auto-entities` card and populate themselves
from your entities. The starter dashboard needs nothing extra.

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

52 icons are available under the `sims2:` prefix anywhere you'd use `mdi:`. The
full catalogue is in [docs/ICONS.md](docs/ICONS.md).

```yaml
light.kitchen:
  icon: sims2:room-kitchen
sensor.house_mood:
  icon: sims2:plumbob-mood-green
person.bella_goth:
  icon: sims2:sim
```

---

## 🔧 How it works

This is a **custom integration** (not a plain theme repo) because that's the
only HACS category whose setup code can create dashboards and register frontend
resources for you. On *Add Integration* it:

1. serves `sims2-bundle.js` over HTTP,
2. registers it as a Lovelace module resource (so the custom cards resolve),
3. creates the nine storage-mode dashboards with their view configs,
4. copies the theme file into `<config>/themes/` (for the optional native theme
   path) and reloads themes.

Everything is **idempotent** — restarts and reloads never duplicate state, and
shipped dashboard updates refresh automatically. Removing the integration leaves
any dashboards you've edited in place.

---

## 🧪 Development

The served bundle is built from the sources under `src/`:

```
./build.sh
```

It concatenates the icon pack, the two custom cards, the fonts + zero-config
theme + overrides CSS, and the vendored `auto-entities`, into
`custom_components/sims2ha/frontend/sims2-bundle.js`. No build toolchain needed —
only `node` (used to escape the CSS into a JS string).

- **Palette & voice:** [docs/PALETTE.md](docs/PALETTE.md)
- **Icon catalogue:** [docs/ICONS.md](docs/ICONS.md)
- **Optional deep styling** (gradient headers, sidebar rail, settings pages)
  via [card-mod](https://github.com/thomasloven/lovelace-card-mod):
  [docs/CARD-MOD.md](docs/CARD-MOD.md)

---

## ❓ Troubleshooting

- **Cards show "Custom element doesn't exist"** — refresh your browser. The
  resource is registered during setup; a hard refresh picks it up.
- **Dashboards show a red error card** — refresh the browser first; the bundled
  `auto-entities` needs to load. If it persists, confirm you're on Home
  Assistant **2025.8** or newer.
- **Theme look didn't change** — hard-refresh the browser (Ctrl+Shift+R). The
  style layer is injected by the bundle and cached aggressively.
- **Fonts look plain** — the Fredoka web font loads from Google Fonts. If your
  network blocks it, set `--sims2-font-display` to a locally-hosted face.

---

## 🤝 Credits & license

- **`auto-entities`** by Thomas Lovén (MIT) is **vendored into the bundle** so
  the auto-populating dashboards need no separate install — see
  `src/vendor/auto-entities.LICENSE.txt`.
- Fredoka font via Google Fonts (Open Font License).
- Inspired by the r/homeassistant ["Sims 2 inspired dashboard" project of the
  day](https://www.reddit.com/r/homeassistant/comments/1usr3qp/project_of_the_day_a_sims_2_inspired_dashboard/).
- *The Sims 2*, the plumbob, Pleasantview, and all character names are
  trademarks of Electronic Arts Inc., referenced affectionately and without any
  EA assets.

**License:** MIT — see [LICENSE](LICENSE). Pull requests welcome.
May your splines always be fully reticulated. 💎
