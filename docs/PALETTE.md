# Sims 2 for Home Assistant — Design Contract

This document is the single source of truth for the palette, typography,
voice, and naming used across the theme, custom cards, and dashboards.
Every contributor (human or agent) should match these values.

It is a fan tribute. *The Sims 2* is a trademark of Electronic Arts Inc.
The palette is inspired by the game's UI; no EA assets are bundled.

## Colour palette

### Light mode — "Pleasantview daytime"
Warm parchment surfaces, the signature Sims 2 panel blue, gold trim, and a
bright plumbob green for active states.

| Token | Hex | Used for |
|---|---|---|
| `sims2-parchment` | `#F3E9D2` | app background |
| `sims2-cream` | `#FBF4DF` | cards, dialogs |
| `sims2-panel-blue` | `#2F86C5` | primary actions, active states, sliders |
| `sims2-panel-blue-dark` | `#235E8C` | app header |
| `sims2-panel-blue-deep` | `#173A52` | sidebar |
| `sims2-plumbob-green` | `#7BC942` | accent, "on", success |
| `sims2-gold` | `#E0B66B` | badges, highlights, wordmark |
| `sims2-gold-dark` | `#C29A3C` | pressed gold, dark-mode gold |
| `sims2-espresso` | `#4A3320` | primary text |
| secondary text | `#7A5A38` | captions, helpers |
| divider / frame | `#D8C39A` | card rims, dividers |
| error | `#C0392B` | errors, danger |
| warning | `#E09A2B` | warnings |

### Dark mode — "midnight plumbob"
Deep Pleasantview-at-night navy with a glowing neon plumbob.

| Token | Hex | Used for |
|---|---|---|
| app background | `#0C1A2B` | app background |
| card surface | `#13283F` | cards, dialogs |
| `sims2-panel-blue` | `#3FA0D8` | primary (brighter for dark) |
| app header | `#0E2A45` | header |
| sidebar | `#0A1E33` | sidebar |
| `sims2-plumbob-green` | `#8BD64A` | accent, success |
| gold | `#C29A3C` | badges, wordmark |
| primary text | `#EAF2FB` | text |
| secondary text | `#9FB6CE` | captions |
| divider | `#1F3E5E` | dividers |

### Loading-screen sky (both modes)
| Role | Hex |
|---|---|
| sky top | `#1E5C92` (light theme) / `#0E2A45` (dark) |
| sky mid | `#1E5C92` |
| sky bottom | `#0E2C4D` (light) / `#050D17` (dark) |
| wordmark gold | `#F4D886` |
| tip text | `#EAF4FF` |

## Plumbob moods
The plumbob is the diamond above every Sim's head. We reuse it as a status
light.

- **green** — happy / good / on (`#7BC942`, dark `#8BD64A`)
- **yellow** — neutral / idle / warning (`#F2C14E`)
- **red** — unhappy / bad / off / error (`#E55B45`)

Default numeric thresholds for `custom:sims2-plumbob`:
`>= 66` green, `>= 33` yellow, else red.

## Typography
- **Display / headers / wordmark:** *Fredoka* (Google Fonts), weights 500–700.
  Loaded by `www/community/sims2ha/sims2-fonts.css` and exposed as
  `--sims2-font-display`.
- **Body:** same family at weight 400 for cohesion; falls back to the system
  sans (`Segoe UI`, system-ui) if the web font is unavailable.
- **Letter-spacing:** a hair more than default (`0.005em` body,
  `0.14em` wordmark) to match the slightly airy Sims feel.
- **Corners:** cards use `--ha-card-border-radius: 14px`. Pills/badges are
  fully rounded (`999px`).

The Sims 2 ships its own proprietary fonts ("The Sims Sans" family). We do
not bundle them. Fredoka is the closest libre approximation of the friendly
tone; users may swap `--sims2-font-display` to their own locally-hosted face.

## Voice & copy
- Tone: warm, a little ridiculous, gently fourth-wall-breaking — exactly like
  the loading tips. Never mean.
- Easter eggs are affectionate nods to Sims 2 lore: Bella Goth's disappearance,
  Mortimer Goth, Don Lothario, the Pleasants, the Brokes, the plumbob,
  simoleons, llamas, and of course *reticulating splines*.
- Keep jokes subtle: titles and section captions, not plastered over every
  control. Accessibility and usability always win.

## Naming conventions (locked)
These identifiers are referenced by dashboards and docs and must not drift.

**Custom cards**
- `custom:sims2-loading` → file `www/community/sims2ha/sims2-loading-card.js`,
  element `<sims2-loading>`
- `custom:sims2-plumbob` → file `sims2-plumbob-card.js`,
  element `<sims2-plumbob>`

**Themes** (all in `themes/sims2.yaml`)
- `sims2` (light + dark auto)
- `sims2-light`
- `sims2-dark`

**Dashboard files** (in `dashboards/`)
| File | Sidebar title | Domain focus |
|---|---|---|
| `sims2-overview.yaml` | Pleasantview Overview | mixed overview + plumbob mascot |
| `sims2-lights.yaml` | Lighting Bureau | `light.*` |
| `sims2-climate.yaml` | Climate Control | `climate.*`, `fan.*`, humidifiers |
| `sims2-power.yaml` | Power & Energy | power/energy/battery sensors |
| `sims2-security.yaml` | Security Grid | `lock.*`, `alarm_control_panel.*`, `binary_sensor.*` |
| `sims2-automations.yaml` | Automation Suite | `automation.*`, `scene.*`, `script.*` |
| `sims2-system.yaml` | Plumbob Command | system monitors, network, updates |
| `sims2-needs.yaml` | Household Needs | joke: entities mapped to Sim needs |

## Loading-tip corpus
The canonical tip list lives in `sims2-loading-card.js` (`SIMS2_DEFAULT_TIPS`).
It blends the classic Maxis/Maxis-adjacent lines (Reticulating splines and its
kin) with Home-Assistant-flavoured nonsense (Reticulating your Zigbee mesh,
Convincing the thermostat it is happy, etc.). Users can override the list per
card via the `tips:` option.

Add new tips to that array only; do not duplicate them across files.
