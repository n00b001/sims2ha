# Sims 2 for Home Assistant — Design Contract

This document is the single source of truth for the palette, typography,
voice, and naming used across the theme, custom cards, and dashboards.
Every contributor (human or agent) should match these values.

It is a fan tribute. *The Sims 2* is a trademark of Electronic Arts Inc.
The palette is inspired by the game's UI; no EA assets are bundled.

## Colour palette

### Light mode — "Pleasantview daytime"
Deep navy blue backgrounds with sunburst ray pattern, light sky-blue panels
for cards and dialogs, panel blue for primary actions, gold trim accents,
and bright plumbob green for active states.

| Token | Hex | Used for |
|---|---|---|
| `sims2-navy-base` | `#0E1628` | app background (with sunburst rays) |
| `sims2-sky-blue` | `#7EC8E6` | cards, dialogs, light panels |
| `sims2-panel-blue` | `#2F86C5` | primary actions, active states, sliders |
| `sims2-header-blue` | `#235E8C` | app header |
| `sims2-panel-navy` | `#1A3350` | sidebar |
| `sims2-plumbob-green` | `#7BC942` | accent, "on", success |
| `sims2-gold` | `#E0B66B` | badges, highlights, wordmark |
| `sims2-gold-dark` | `#C29A3C` | pressed gold, dark-mode gold |
| `sims2-espresso` | `#4A3320` | primary text on light panels |
| secondary text | `#5C7A96` | captions, helpers |
| divider / trim | `#D8C39A` | card rims, dividers, gold decoration |
| error | `#C0392B` | errors, danger |
| warning | `#E09A2B` | warnings |

### Dark mode — "midnight plumbob"
Deeper midnight navy with muted blue panels, preserved green for active states.

| Token | Hex | Used for |
|---|---|---|
| app background | `#080D18` | app background |
| card surface | `#4A7A94` | cards, dialogs (muted blue) |
| `sims2-panel-blue` | `#9CCBE6` | primary (pale blue for dark) |
| app header | `#1B3A52` | header |
| sidebar | `#0F2035` | sidebar |
| `sims2-plumbob-green` | `#7BC942` | accent, success |
| gold | `#3D3856` | badges, wordmark (muted bronze) |
| primary text | `#FFF6E0` | text (cream) |
| secondary text | `#C4B696` | captions |
| divider | `#3D3856` | dividers |

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

- **green** — happy / good / on (`#7BC942`)
- **yellow** — neutral / idle / warning (`#F2C14E`)
- **red** — unhappy / bad / off / error (`#E55B45`)

Default numeric thresholds for `custom:sims2-plumbob`:
`>= 66` green, `>= 33` yellow, else red.

## Typography
- **One typeface, two roles:** *Benguiat Gothic* is used for everything —
  display, headers, wordmark, and body text. It is self-hosted as a base64
  `@font-face` in `sims2-fonts.css` (sourced from
  `reference-images/benguiat-gothic-regular/benguiat-gothic-regular.ttf`), so
  no external font fetch is needed. No other font is bundled or loaded.
- **Roles via CSS custom properties:** `--sims2-font-display` and
  `--sims2-font-body` both resolve to Benguiat Gothic and fall back to
  `system-ui, sans-serif` if the web font is unavailable.
- **Letter-spacing:** a hair more than default (`0.005em` body,
  `0.14em` wordmark) to match the slightly airy Sims feel.
- **Corners:** cards use `--ha-card-border-radius: 14px`. Pills/badges are
  fully rounded (`999px`).

The Sims 2 ships its own proprietary fonts ("The Sims Sans" family). We do
not bundle them. Benguiat Gothic is the closest libre approximation of the
Sims 2 display face and is the project's only font. Users may swap
`--sims2-font-display` / `--sims2-font-body` to their own locally-hosted face.

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
- `custom:sims2-loading` -> file `sims2-loading-card.js`,
  element `<sims2-loading>`
- `custom:sims2-plumbob` -> file `sims2-plumbob-card.js`,
  element `<sims2-plumbob>`
- `custom:sims2-gauge` -> file `sims2-gauge-card.js`,
  element `<sims2-gauge>`
- `custom:sims2-panel` -> file `sims2-panel-card.js`,
  element `<sims2-panel>`
- `custom:sims2-divider` -> file `sims2-divider-card.js`,
  element `<sims2-divider>`

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
It blends the classic Maxis-adjacent lines (Reticulating splines and its
kin) with Home-Assistant-flavoured nonsense (Reticulating your Zigbee mesh,
Convincing the thermostat it is happy, etc.). Users can override the list per
card via the `tips:` option.

Add new tips to that array only; do not duplicate them across files.
