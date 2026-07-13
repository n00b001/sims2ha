# Sims 2 for Home Assistant — Integration Plan

> A fan-made tribute that restyles Home Assistant to look and feel like **The
> Sims 2** — and installs in one step. Not affiliated with Electronic Arts.

---

## Table of Contents

1. [What Changes Compared to Normal Home Assistant](#1-what-changes-compared-to-normal-home-assistant)
2. [Design Language](#2-design-language)
3. [Design System](#3-design-system)
4. [Architecture](#4-architecture)
5. [Custom Cards](#5-custom-cards)
6. [Icon Pack](#6-icon-pack)
7. [Dashboard Catalogue](#7-dashboard-catalogue)
8. [Theme Modes](#8-theme-modes)
9. [Installation Flow](#9-installation-flow)
10. [Examples](#10-examples)
11. [What We Will Not Do](#11-what-we-will-not-do)

---

## 1. What Changes Compared to Normal Home Assistant

This integration modifies every visible layer of the Home Assistant frontend.
Nothing is patched or monkey-pil — it uses only official HA extension points
(theme variables, Lovelace resources, static paths, dashboard creation).

### 1.1 Colors — Every Surface Restyled

**Normal HA:** Material Design defaults — white backgrounds, indigo accents,
grey dividers, green for "on", red for errors.

**Sims 2:** Warm parchment surfaces (`#FBF4DF`), signature Sims 2 panel blue
(`#2F86C5`) for primary actions, gold trim (`#D8C39A`) for borders and
dividers, plumbob green (`#7BC942`) for "on" and active states. Every color
variable HA exposes is overridden — backgrounds, text, header, sidebar,
switches, sliders, status colors, entity icons.

The palette has two modes:
- **Light mode** (default) — warm parchment "daytime Pleasantview" look
- **Dark mode** — deep navy "midnight plumbob" look with darkened surfaces
  and adjusted contrast

| Variable | Normal HA | Sims 2 Light | Sims 2 Dark |
|---|---|---|---|
| `primary-background-color` | `#FFFFFF` | `#F3E9D2` (parchment) | `#1A1632` (deep navy) |
| `card-background-color` | `#FFFFFF` | `#FBF4DF` (light cream) | `#231F3D` (dark indigo) |
| `primary-color` | `#03A9F4` | `#2F86C5` (panel blue) | `#9CCBE6` (pale blue) |
| `accent-color` | `#FF4081` | `#7BC942` (plumbob green) | `#7BC942` (plumbob green) |
| `sidebar-background-color` | `#FFFFFF` | `#173A52` (panel navy) | `#0F2A3D` (deep navy) |
| `app-header-background-color` | `#03A9F4` | `#235E8C` (header blue) | `#1B3A52` (dark header) |
| `sidebar-selected-text-color` | `#03A9F4` | `#FFF6E0` (cream text) | `#FFF6E0` (cream text) |
| `divider-color` | `#E0E0E0` | `#D8C39A` (gold trim) | `#3D3856` (dark gold) |

### 1.2 Typography — Two Sims 2 Fonts

**Normal HA:** System fonts (Roboto on Android, San Francisco on iOS, Segoe UI
on Windows). Clean, modern, generic.

**Sims 2:**
- **Display font:** `Benguiat Gothic` — the authentic Sims 2 display face,
  self-hosted as a base64 data URI in the bundle. No external network request.
  Used for headings, titles, and the wordmark on the loading screen.
- **Body font:** `Fredoka` — a rounded, friendly typeface loaded from Google
  Fonts. Matches the Sims 2 UI's soft, approachable character.

Both fonts inherit through shadow DOM boundaries (font-family is one of the
few CSS properties that does), so they reach every card, dialog, and component
without piercing.

### 1.3 Icons — 52 Custom Sims 2 Icons

**Normal HA:** Material Design Icons (`mdi:`) — the standard HA icon set.

**Sims 2:** A custom icon pack registered under the `sims2:` prefix. 52 icons
covering:
- The plumbob (diamond, green/yellow/red mood variants)
- Simoleons (currency symbol)
- Eight Sim needs (hunger, energy, comfort, fun, social, hygiene, bladder, room)
- Buy-mode categories (lighting, appliances, electronics, furniture, walls, flooring)
- Live mode icons (phone, catalog, career, rewards)
- Build mode icons (wall tool, paint bucket, terrain)
- Aspiration icons (star, crown)
- Shop icons (window, cart)

These icons replace `mdi:` in all dashboard YAML and entity configuration.

### 1.4 Cards — Three Custom Card Types

**Normal HA:** Standard Lovelace cards (`entities`, `glance`, `tile`, `grid`,
`picture-entity`, `markdown`).

**Sims 2:** Adds five custom cards on top of the standard ones:

| Card | Purpose | Sims 2 Equivalent |
|---|---|---|
| `custom:sims2-loading` | Loading splash screen with rotating tips | Sims 2 "Reticulating Splines" boot screen |
| `custom:sims2-plumbob` | Animated plumbob mascot, entity-driven mood | The floating diamond above every Sim's head |
| `custom:sims2-gauge` | Circular gauge with Sims 2 color bands | Need meters and skill bars from the game |
| `custom:sims2-panel` | Parchment panel card with gold trim | Sims 2 UI panels (dialog boxes, info windows) |
| `custom:sims2-divider` | Themed horizontal divider with decorative element | Gold separator lines in Sims 2 menus |

Plus the vendored `auto-entities` card (bundled in the JS, no separate HACS
install needed) for auto-populating dashboards from entity filters.

### 1.5 Dashboards — Nine Premade Screens

**Normal HA:** Users create dashboards manually or import YAML.

**Sims 2:** Nine storage-mode dashboards are created automatically on install.
They appear in the sidebar with Sims 2 naming, icons, and themed content.
Seven auto-populate from the user's entities using `auto-entities`.

### 1.6 Scrollbars, Selection, Focus Rings

**Normal HA:** Browser default scrollbars. Blue text selection. Standard focus
outlines.

**Sims 2:** Custom scrollbar styling (parchment track, gold thumb), themed
text selection (panel blue background, cream text), and rounded focus rings
matching the Sims 2 aesthetic.

### 1.7 Component Overrides

Every Material component HA uses is restyled via CSS variables:
- **Switches:** Parchment toggle buttons, plumbob-green track when on
- **Sliders:** Panel-blue fill, parchment thumb, gold track
- **Badges:** Sims 2 color scheme and typography
- **Progress bars:** Plumbob-green fill with rounded corners
- **Tabs:** Gold underline for active tab, parchment background
- **Alerts/Toasts:** Themed backgrounds and borders

### 1.8 What Does NOT Change

- **No core HA code is modified.** Everything uses official extension points.
- **No state machines or entity logic is altered.** This is purely visual.
- **No backend services are added.** The integration only touches the frontend
  layer (static paths, Lovelace resources, dashboards, themes).
- **Standard HA cards still work.** The custom cards supplement, not replace.
- **Users can still use the default HA theme.** Remove the integration and
  everything reverts.

---

## 2. Design Language

The Sims 2 UI (circa 2003–2008) has one of the most distinctive desktop game
aesthetics ever produced. This integration captures that aesthetic by mapping
every HA element to its Sims 2 equivalent.

### 2.1 The Sims 2 UI Philosophy

The Sims 2 interface is characterized by:
- **Warmth:** Parchment textures, cream backgrounds, never sterile or clinical
- **Friendliness:** Rounded corners everywhere, soft shadows, no sharp edges
- **Hierarchy:** Clear visual weight — headings are bold and dark, body text is
  lighter and smaller, actions are blue with gold accents
- **Character:** Every element has personality — even a scrollbar feels like it
  belongs in a Sim's world
- **Readability:** Despite the playful style, information is always scannable.
  The game manages hundreds of UI elements without visual chaos.

### 2.2 Mapping to Home Assistant

| Sims 2 Concept | HA Equivalent | Rationale |
|---|---|---|
| Parchment panels | Card backgrounds | Every UI panel in Sims 2 uses a warm cream surface |
| Panel blue header bar | App header, sidebar | The iconic deep blue of the top bar and side panels |
| Gold trim / borders | Dividers, card borders | Decorative gold lines separate sections |
| Plumbob diamond | Status indicator | The floating diamond above every Sim's head = system status |
| Need meters | Gauges | The eight Sim needs (hunger, energy, etc.) = power/energy gauges |
| Simoleon symbol | Currency display | The green `$` symbol = energy cost tracking |
| Buy mode categories | Entity groupings | Lighting, appliances, electronics = domain groupings |
| Live mode UI | Dashboard layout | The bottom-bar action icons = dashboard navigation |
| Build mode palette | Tile cards | The grid of placeable items = climate/entity tiles |
| Loading screen tips | Splash card | "Reticulating splines" with rotating humorous tips |

### 2.3 Voice and Tone

The dashboards use Sims 2 humor and references:
- Dashboard names: "Pleasantview Overview", "Lighting Bureau", "Plumbob Command"
- Markdown cards reference Bella Goth, Mortimer Goth, Don Lothario
- Loading screen tips are Sims-themed jokes ("Reticulating your Zigbee mesh")
- Energy dashboard calls watts "simoleons"
- Security dashboard is framed as "Mortimer is watching"

### 2.4 Light Mode vs Dark Mode

**Light mode** (default) represents the daytime Pleasantview look — warm,
inviting, parchment surfaces with the signature blue header. This is the
primary Sims 2 aesthetic.

**Dark mode** represents the nighttime plumbob look — deep navy backgrounds,
reduced contrast, preserved green for active states. The sidebar and header
become darker navy. Parchment becomes dark indigo. Gold trim becomes muted
bronze.

Both modes share the same structural palette (blue = primary action, green =
active/on, gold = decoration). Only the base surfaces shift.

---

## 3. Design System

### 3.1 Color Tokens

The complete token set, with semantic meaning:

#### Surfaces

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-background-color` | `#F3E9D2` | `#1A1632` | Main page background |
| `secondary-background-color` | `#EADFC2` | `#15122A` | Sub-pages, modals backdrop |
| `card-background-color` / `ha-card-background` | `#FBF4DF` | `#231F3D` | Every card panel |
| `app-drawer-background-color` | `#173A52` | `#0F2A3D` | Sidebar panel |
| `input-fill-color` | `#EFE3C6` | `#2E2947` | Form fields, search boxes |

#### Brand / Actions

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-color` | `#2F86C5` | `#9CCBE6` | Links, primary buttons, active elements |
| `accent-color` | `#7BC942` | `#7BC942` | Highlights, success highlights |
| `dark-primary-color` | `#235E8C` | `#1B3A52` | Header bar, strong accents |
| `light-primary-color` | `#9CCBE6` | `#6BA3C7` | Subtle blue elements, hover states |

#### Text

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-text-color` | `#4A3320` | `#FFF6E0` | Body text on light surfaces |
| `secondary-text-color` | `#7A5A38` | `#C4B696` | Captions, labels, timestamps |
| `text-primary-color` | `#FFF6E0` | `#FFF6E0` | Text on dark surfaces (header/sidebar) |
| `disabled-text-color` | `#A98C5C` | `#6B6280` | Placeholder text, disabled elements |

#### Status / Feedback

| Token | Value | Used For |
|---|---|---|
| `error-color` | `#C0392B` | Errors, failures, critical alerts |
| `warning-color` | `#E09A2B` | Warnings, cautions |
| `success-color` | `#5BA82C` | Success states, confirmations |
| `info-color` | `#2F86C5` | Informational messages |

#### State Icons

| Token | Light | Dark | Used For |
|---|---|---|---|
| `state-icon-color` | `#7A5A38` | `#8B80A0` | Inactive entity icons |
| `state-icon-active-color` | `#7BC942` | `#7BC942` | Active/on entity icons |
| `state-icon-unavailable-color` | `#A98C5C` | `#5C5470` | Unavailable entity icons |

#### Component-Specific

| Token | Light | Dark | Used For |
|---|---|---|---|
| `switch-checked-color` | `#7BC942` | `#7BC942` | Toggle switch "on" track |
| `slider-color` | `#2F86C5` | `#9CCBE6` | Slider fill bar |
| `slider-track-color` | `#D8C39A` | `#3D3856` | Slider empty track |
| `divider-color` | `#D8C39A` | `#3D3856` | Horizontal rules, card separators |

### 3.2 Typography Tokens

| Token | Value | Used For |
|---|---|---|
| `--sims2-font-display` | `"Benguiat Gothic", serif` | Headings, titles, wordmark |
| `--sims2-font-body` | `"Fredoka", sans-serif` | Body text, labels, descriptions |

Benguiat Gothic is self-hosted (base64 data URI in the bundle). Fredoka loads
from Google Fonts. Both inherit through shadow DOM boundaries.

### 3.3 Spacing and Radius

The Sims 2 UI uses generous padding and rounded corners:
- Card padding: inherited from HA defaults, visually warm due to parchment surfaces
- Border radius: `--ha-card-border-radius` set to `12px` for the soft, rounded
  Sims 2 feel
- Shadows: `--ha-card-box-shadow` uses a warm, subtle shadow that matches the
  parchment aesthetic

### 3.4 Component Patterns

#### Cards
Every card is a cream panel (`#FBF4DF`) with a subtle shadow on a parchment
background (`#F3E9D2`). Card titles use the display font. No borders — the
surface contrast provides separation. The `custom:sims2-panel` card adds an
explicit gold border (`#D8C39A`) for the full Sims 2 dialog box aesthetic.

#### Header
Deep blue bar (`#235E8C`) with cream text. The header is always dark (it
represents the Sims 2 top panel). Selected navigation uses plumbob green
(`#7BC942`) as the highlight.

#### Sidebar
Dark navy panel (`#173A52`) with parchment-colored text and pale blue icons.
Selected items get a blue highlight background with cream text — mimicking the
Sims 2 side panel navigation.

#### Switches
Parchment toggle button on a plumbob-green track when on, grey-brown track
when off. No Material Design ripple — just the warm, tactile feel of a Sims 2
toggle.

#### Sliders
Panel-blue fill bar, parchment thumb knob, gold track. The slider looks like
a Sims 2 need meter being adjusted.

### 3.5 Theming Architecture

The theme works at three levels:

**Level 1 — CSS Variables (primary mechanism)**
All HA color variables are overridden in the theme YAML file. This covers
everything HA exposes through its theming API: backgrounds, text, header,
sidebar, switches, sliders, status colors, entity icons.

**Level 2 — Shadow DOM Variables**
`--ha-card-*` variables (`--ha-card-background`, `--ha-card-border-radius`,
`--ha-card-box-shadow`) are set on `:root` and inherited by cards in shadow
DOM. This restyles card containers without piercing.

**Level 3 — Document-Level Styles**
Fonts, scrollbars, selection colors, focus rings — these apply to the document
and inherit through shadow boundaries (font-family inherits; scrollbar and
selection styles apply at the document level).

For deeper surgical styling (inside HA shadow trees like the app header or
sidebar internals), card-mod is optionally recommended. The integration itself
does not require card-mod.

---

## 4. Architecture

### 4.1 Integration Structure

```
custom_components/sims2ha/
├── __init__.py          # Setup entry point — serves bundle, registers resource,
│                        # creates dashboards, installs theme
├── config_flow.py       # Single-click config flow (no user input needed)
├── const.py             # Constants: domain, file paths, dashboard specs
├── manifest.json        # HA integration manifest (HACS compatible)
├── strings.json         # Config flow localization strings
├── frontend/
│   └── sims2-bundle.js  # Single JS module — icons, cards, CSS, fonts, auto-entities
├── dashboards/          # Nine premade dashboard YAML configs
│   ├── sims2-overview.yaml
│   ├── sims2-lights.yaml
│   ├── sims2-climate.yaml
│   ├── sims2-power.yaml
│   ├── sims2-security.yaml
│   ├── sims2-automations.yaml
│   ├── sims2-system.yaml
│   ├── sims2-needs.yaml
│   └── static/sims2-starter.yaml
└── themes/
    └── sims2.yaml       # Three HA themes: sims2, sims2-light, sims2-dark
```

### 4.2 Setup Flow

When the user adds the integration (one click, no form):

1. **Serve bundle** — Register `/sims2ha/bundle.js` as a static HTTP path
   pointing to `frontend/sims2-bundle.js`. Cached by the browser.

2. **Register Lovelace resource** — Create a module-type resource at
   `/sims2ha/bundle.js` so HA loads it on every Lovelace page. Idempotent
   (deduplicated by URL).

3. **Create dashboards** — For each of the nine dashboard specs, create a
   storage-mode dashboard with the YAML config from `dashboards/`. Idempotent
   (skips existing, refreshes views on update).

4. **Install theme** — Copy `themes/sims2.yaml` into `<config>/themes/` if
   not already present. Call `frontend/reload_themes`. Does not overwrite
   user-edited copies.

All four steps are idempotent. Repeated setup (restarts, entry reloads) never
duplicates state.

### 4.3 Bundle Composition

`sims2-bundle.js` is a single module built by `build.sh`:
1. Icon pack registration (`sims2:` prefix via MDI icon API)
2. Custom cards (`sims2-loading`, `sims2-plumbob`, `sims2-gauge`, `sims2-panel`, `sims2-divider`)
3. Fonts CSS (Benguiat Gothic data URI + Fredoka Google Fonts import)
4. Theme CSS (CSS variable overrides for light/dark mode)
5. Overrides CSS (component-specific styling — switches, sliders, badges, etc.)
6. Vendored `auto-entities` card (Thomas Lovén, MIT licensed)

The bundle is served once and cached by the browser. No build toolchain needed
— only `node` (used to escape CSS into a JS string).

### 4.4 Dependencies

- **Runtime:** `homeassistant.components.http`, `frontend`, `lovelace`
- **Optional:** `auto-entities` is vendored in the bundle (no separate install)
- **Optional:** `card-mod` for advanced styling (documented, not required)
- **No external APIs or services** — everything runs locally

---

## 5. Custom Cards

Five custom element cards are registered by the bundle. They use the
`window.customElements.set()` prefix to bypass Home Assistant's duplicate
definition guard (HA registers standard card names; our prefixed names never
conflict).

### 5.1 `custom:sims2-loading`

The Sims 2 loading splash screen — "Reticulating Splines" with a rotating
tip and configurable wordmark. Auto-dismisses after the specified duration.

**Configuration:**
```yaml
type: custom:sims2-loading
wordmark: PLEASANTVIEW        # Gold wordmark text (display font)
duration: 6                    # Seconds before auto-dismiss (0 = never dismiss)
fullscreen: true               # Overlay the entire viewport
tips:                          # Optional: override the built-in tip list
  - Reticulating your Zigbee mesh
  - Convincing the thermostat it is happy
  - Teaching the lights to dance
```

**Visual:** Full-screen overlay with the Sims 2 loading screen aesthetic —
parchment background, gold wordmark, animated progress bar, rotating humorous
tip text. Dismisses by fading out.

### 5.2 `custom:sims2-plumbob`

An animated plumbob (the floating diamond above every Sim's head). Colors
itself based on a bound entity or static mood.

**Configuration — Static:**
```yaml
type: custom:sims2-plumbob
title: Household Morale
subtitle: The diamond knows
mood: green                    # green | yellow | red
size: 76                       # Pixel size of the plumbob
```

**Configuration — Numeric Entity:**
```yaml
type: custom:sims2-plumbob
title: Kitchen Temperature
entity: sensor.kitchen_temperature
green_above: 66                # >= 66 → green plumbob
yellow_above: 33               # >= 33 → yellow plumbob
                               # < 33  → red plumbob
```

**Configuration — State Map:**
```yaml
type: custom:sims2-plumbob
title: Bella Goth
entity: person.bella_goth
state_map:
  home: green
  not_home: red
  away: yellow
```

**Visual:** A 3D-rendered diamond shape (CSS transforms) that floats with a
subtle vertical oscillation animation. Green = happy/active, yellow = warning,
red = critical/unhappy. Title and subtitle appear below in the display font.

### 5.3 `custom:sims2-gauge`

A circular gauge card with Sims 2 color bands — green/yellow/red severity
zones rendered as colored arcs on a circular dial.

**Configuration:**
```yaml
type: custom:sims2-gauge
entity: sensor.living_room_power
name: Living Room              # Optional override title
unit: "W"                      # Unit label
min: 0                         # Gauge minimum
max: 10000                     # Gauge maximum
severity:
  green: 2000                  # Value below this → green arc
  yellow: 5000                 # Value below this → yellow arc
  red: 8000                    # Value above this → red arc
```

**Visual:** A circular dial (like a speedometer) with colored arcs — green for
normal, yellow for warning, red for critical. The current value is shown as a
needle and numeric readout. Styled to match the Sims 2 need meter aesthetic.

### 5.4 `custom:sims2-panel`

A parchment panel card with gold trim borders — the Sims 2 equivalent of a
dialog box or info window. Wraps standard HA content in the signature Sims 2
panel aesthetic with rounded corners, cream background, and decorative gold
border.

**Configuration:**
```yaml
type: custom:sims2-panel
title: Neighbourhood Noticeboard    # Panel title in display font
card:                                # Standard HA card to wrap
  type: entities
  entities:
    - light.kitchen
    - switch.coffee_maker
```

**Visual:** A cream panel (`#FBF4DF`) with a gold border (`#D8C39A`), rounded
corners, and a title bar in the display font. The inner card content inherits
the themed styling. Mimics the Sims 2 dialog box aesthetic.

### 5.5 `custom:sims2-divider`

A themed horizontal divider with a decorative element — a gold line with an
optional center ornament (plumbob icon, simoleon, or text label). Replaces
plain HA dividers with Sims 2-style section separators.

**Configuration:**
```yaml
type: custom:sims2-divider
label: Power & Energy               # Optional center label text
ornament: plumbob                   # plumbob | simoleon | none
thickness: 2                        # Line thickness in pixels
color: "#D8C39A"                    # Gold trim color (default)
```

**Visual:** A horizontal gold line spanning the card width with an optional
center ornament (small plumbob diamond, simoleon symbol, or text label).
Matches the decorative separator lines used in Sims 2 menus and dialogs.

---

## 6. Icon Pack

52 icons registered under the `sims2:` prefix. Use anywhere you'd use `mdi:`:

```yaml
# Entity configuration
light.kitchen:
  icon: sims2:room-kitchen

sensor.house_mood:
  icon: sims2:plumbob-mood-green

person.bella_goth:
  icon: sims2:sim
```

**Icon categories:**
- **Plumbob:** `sims2:plumbob`, `sims2:plumbob-mood-green`, `sims2:plumbob-mood-yellow`, `sims2:plumbob-mood-red`
- **Currency:** `sims2:simoleon`
- **Needs:** `sims2:need-hunger`, `sims2:need-energy`, `sims2:need-comfort`, `sims2:need-fun`, `sims2:need-social`, `sims2:need-hygiene`, `sims2:need-bladder`, `sims2:need-room`
- **Buy Mode:** `sims2:type-lighting`, `sims2:type-appliances`, `sims2:type-electronics`, `sims2:type-furniture`, `sims2:type-walls`, `sims2:type-flooring`
- **Live Mode:** `sims2:live-mode`, `sims2:phone`, `sims2:catalog`, `sims2:career`, `sims2:rewards`
- **Build Mode:** `sims2:build-mode`, `sims2:wall-tool`, `sims2:paint-bucket`, `sims2:terrain`
- **Aspiration:** `sims2:aspiration-star`, `sims2:aspiration-crown`
- **Shop:** `sims2:shop-window`, `sims2:shop-cart`

Full catalogue in [docs/ICONS.md](ICONS.md).

---

## 7. Dashboard Catalogue

### 7.1 Pleasantview Overview (`sims2-overview`)
The landing dashboard. Loading splash, plumbob mascot, live snapshot of
everything currently switched on (lights, switches, media players, vacuums),
and quick jump links to the other dashboards.

**Cards used:** `sims2-loading`, `sims2-plumbob`, `auto-entities` + `entities`, `markdown`

### 7.2 Lighting Bureau (`sims2-lights`)
Every `light.*` entity in tile layout. Named after Bella Goth's famous line
about the lighting in her house.

**Cards used:** `auto-entities` + `grid` of `tile` cards

### 7.3 Climate Control (`sims2-climate`)
All climate entities as tiles, fans and humidifiers as entity list,
temperature sensors as circular Sims 2 gauges.

**Cards used:** `auto-entities` + `grid` of `tile` cards, `auto-entities` + `entities`, `auto-entities` + `sims2-gauge`

### 7.4 Power & Energy (`sims2-power`)
Power sensors as circular gauges, energy meters as entity list, battery levels
as entity list. Every watt is a simoleon.

**Cards used:** `auto-entities` + `sims2-gauge`, `auto-entities` + `entities`

### 7.5 Security Grid (`sims2-security`)
Locks, alarms, doors, windows, motion sensors. Mortimer Goth's surveillance
network.

**Cards used:** `auto-entities` + `grid` of `tile` cards, `auto-entities` + `entities`

### 7.6 Automation Suite (`sims2-automations`)
All automations, scenes, and scripts. Don Lothario's automation empire.

**Cards used:** `auto-entities` + `entities` for each domain

### 7.7 Plumbob Command (`sims2-system`)
System vitals — updates, connectivity, supervisor status. The mission control
dashboard.

**Cards used:** `auto-entities` + `entities`, `markdown`

### 7.8 Household Needs (`sims2-needs`)
The eight Sim needs as plumbobs in a 4-column grid. Static by default — wire
any need to a real sensor by adding `entity:` plus `green_above:`/`yellow_above:`
or a `state_map:`.

**Cards used:** `sims2-plumbob` (9 instances), `markdown`

### 7.9 Pleasantview Starter (`sims2-starter`)
A no-dependency static starter dashboard. Uses only standard HA cards with
Sims 2 styling. Safe for any installation.

**Cards used:** Standard HA cards (`entities`, `glance`, `markdown`)

---

## 8. Theme Modes

### 8.1 `sims2` (Recommended)
Follows your system light/dark preference. Automatically switches between the
parchment daytime look and the navy nighttime look.

### 8.2 `sims2-light`
Forces the warm parchment "daytime Pleasantview" look regardless of system
preference. Maximum Sims 2 authenticity.

### 8.3 `sims2-dark`
Forces the deep navy "midnight plumbob" look. Lower contrast, preserved green
for active states, darkened surfaces throughout.

### 8.4 Theme Selection

The look is applied automatically by the injected style layer (no configuration
needed). For the native HA theme picker:

```yaml
# configuration.yaml
frontend:
  themes:
    !include_dir_merge_named themes
```

Then select under **Profile → Theme**.

---

## 9. Installation Flow

### 9.1 Prerequisites
- Home Assistant 2025.8 or newer
- HACS (Home Assistant Community Store)
- No `configuration.yaml` edits required for basic use

### 9.2 Steps
1. **HACS → Custom repositories** → add `https://github.com/n00b001/sims2ha`,
   category **Integration**
2. **Find Sims 2 → Install**
3. **Restart Home Assistant** (required once for HACS)
4. **Settings → Devices & Services → Add Integration** → search **Sims 2** → click
5. **Refresh browser** — the look is live, dashboards are in the sidebar

### 9.3 What Happens on Click

The single config flow click triggers four automatic steps:
1. Bundle served at `/sims2ha/bundle.js` (static path, cached)
2. Bundle registered as Lovelace module resource
3. Nine storage-mode dashboards created with sidebar entries
4. Theme file copied to `<config>/themes/`, themes reloaded

All idempotent. No duplicates on restart or reload.

### 9.4 Uninstall

Remove the integration via HACS. The dashboards and theme persist as user data
(a user may have edited them). In-process bookkeeping is cleared. Manually
delete `<config>/themes/sims2.yaml` if desired.

---

## 10. Examples

### 10.1 Complete Loading Screen
```yaml
# First card in any dashboard for the full Sims 2 boot experience
type: custom:sims2-loading
wordmark: MY HOME
duration: 5
fullscreen: true
tips:
  - Reticulating your Zigbee mesh
  - Teaching the lights to dance
  - Convincing the thermostat it is happy
  - Updating the neighbourhood reputation
```

### 10.2 Plumbob Status Monitor
```yaml
# Bind a plumbob to any sensor for live mood display
type: custom:sims2-plumbob
title: System Health
entity: sensor.home_assistant_health_score
green_above: 80
yellow_above: 50
```

### 10.3 Gauge Dashboard View
```yaml
# Circular gauges for power monitoring
type: custom:sims2-gauge
entity: sensor.solar_power
name: Solar Array
unit: "W"
min: 0
max: 5000
severity:
  green: 1000
  yellow: 3000
  red: 4000
```

### 10.4 Needs-Style Sensor Grid
```yaml
# Four plumbobs monitoring different aspects
type: grid
columns: 4
square: false
cards:
  - type: custom:sims2-plumbob
    title: CPU Load
    entity: sensor.cpu_load
    green_above: 70
    yellow_above: 40
    size: 54
  - type: custom:sims2-plumbob
    title: Memory
    entity: sensor.memory_usage
    green_above: 60
    yellow_above: 30
    size: 54
  - type: custom:sims2-plumbob
    title: Disk Space
    entity: sensor.disk_free_percent
    green_above: 20
    yellow_above: 10
    size: 54
  - type: custom:sims2-plumbob
    title: Network
    entity: sensor.ping_latency
    green_above: 0
    yellow_above: 50
    size: 54
```

### 10.5 Entity Icons with Sims 2 Pack
```yaml
# Replace Material icons with Sims 2 icons
type: entities
entities:
  - entity: light.kitchen
    icon: sims2:room-kitchen
  - entity: climate.living_room
    icon: sims2:type-appliances
  - entity: sensor.power_total
    icon: sims2:type-electronics
  - entity: person.bella
    icon: sims2:sim
  - entity: lock.front_door
    icon: sims2:shop-window
```

---

## 11. What We Will Not Do

- **No EA assets.** No images, sounds, or fonts from The Sims 2 game files.
  All visuals are CSS-rendered or self-hosted licensed fonts.
- **No core HA modifications.** Only official extension points (themes,
  Lovelace resources, static paths, dashboards).
- **No backend services.** No APIs, no data collection, no external calls
  (except Google Fonts for Fredoka, which is optional and cached).
- **No breaking changes to standard cards.** Custom cards supplement; they
  never replace or override HA's built-in cards.
- **No mandatory card-mod dependency.** The integration works without card-mod.
  card-mod is documented as an optional enhancement for deeper styling.
- **No automatic theme selection.** Becoming a selectable theme in the HA
  picker requires the user's one-time `frontend: themes:` block — this is a
  hard limit of Home Assistant itself, not a limitation we work around.

---

*May your splines always be fully reticulated.*
