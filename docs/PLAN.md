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

**Sims 2:** Deep navy blue surfaces (`#0E1628`) with the signature sunburst
ray pattern, light sky-blue panels (`#7EC8E6`) for cards and action areas,
panel blue (`#2F86C5`) for primary actions, gold trim (`#D8C39A`) for borders
and decorative accents, plumbob green (`#7BC942`) for "on" and active states.
Every color variable HA exposes is overridden — backgrounds, text, header,
sidebar, switches, sliders, status colors, entity icons.

The palette has two modes:
- **Light mode** (default) — the signature Sims 2 navy + sky-blue daytime look
  with the sunburst ray background pattern
- **Dark mode** — deeper midnight navy with muted blue panels and adjusted contrast

| Variable | Normal HA | Sims 2 Light | Sims 2 Dark |
|---|---|---|---|
| `primary-background-color` | `#FFFFFF` | `#0E1628` (navy base) | `#080D18` (deep midnight) |
| `card-background-color` | `#FFFFFF` | `#7EC8E6` (sky-blue panel) | `#4A7A94` (muted blue) |
| `primary-color` | `#03A9F4` | `#2F86C5` (panel blue) | `#9CCBE6` (pale blue) |
| `accent-color` | `#FF4081` | `#7BC942` (plumbob green) | `#7BC942` (plumbob green) |
| `sidebar-background-color` | `#FFFFFF` | `#1A3350` (panel navy) | `#0F2035` (deep navy) |
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
| `custom:sims2-panel` | Sky-blue panel card with gold trim | Sims 2 UI panels (dialog boxes, info windows) |
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

**Sims 2:** Custom scrollbar styling (navy track, gold thumb), themed
text selection (panel blue background, cream text), and rounded focus rings
matching the Sims 2 aesthetic.

### 1.7 Component Overrides

Every Material component HA uses is restyled via CSS variables:
- **Switches:** Sky-blue toggle buttons, plumbob-green track when on
- **Sliders:** Panel-blue fill, sky-blue thumb, gold track
- **Badges:** Sims 2 color scheme and typography
- **Progress bars:** Plumbob-green fill with rounded corners
- **Tabs:** Gold underline for active tab, blue panel background
- **Alerts/Toasts:** Themed backgrounds and borders

### 1.8 Background Pattern — Sunburst Rays

**Normal HA:** Flat solid-color backgrounds.

**Sims 2:** The signature Sims 2 background features radiating sunburst lines
on the navy base, creating a subtle starburst pattern that gives depth and
character to every screen. Implemented as a CSS `radial-gradient` overlay
with alternating ray angles — no images required.

### 1.9 What Does NOT Change

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
- **Blue-dominant palette:** Deep navy backgrounds with lighter blue panels,
  sky-blue action bars, and medium-blue catalog sidebars. Blue is everywhere —
  it is the primary surface color, not an accent.
- **Structured depth:** Layered panels with clear visual hierarchy. The main
  game window has a dark navy base with sunburst rays, while UI panels float
  on top in lighter blues with chunky borders and soft shadows.
- **Rounded friendliness:** Every panel, button, and card has generous rounded
  corners. Nothing is sharp or angular — even the plumbob diamond feels
  friendly through its smooth facets.
- **Gold decoration:** Gold trim appears as borders, dividers, and decorative
  accents on buttons. It never serves as a primary surface.
- **Plumbob green for life:** The iconic green diamond is the universal signal
  for "active" and "healthy." Green replaces the standard Material Design
  "on" state throughout the interface.
- **Readability:** Despite the playful style, information is always scannable.
  The game manages hundreds of UI elements without visual chaos. Cream text on
  dark navy, dark brownish-navy text on blue panels.

### 2.2 Mapping to Home Assistant

| Sims 2 Concept | HA Equivalent | Rationale |
|---|---|---|
| Navy sunburst background | Page background | The main game window has a deep navy base with radiating lighter rays |
| Sky-blue panels | Card backgrounds | Dialog boxes, info windows, and the bottom action bar use light blue surfaces |
| Panel blue header bar | App header, sidebar | The iconic deep blue of the top bar and side navigation panels |
| Gold trim / borders | Dividers, card borders | Decorative gold lines separate sections and frame buttons |
| Plumbob diamond | Status indicator | The floating green diamond above every Sim's head = system status |
| Need meters | Gauges | The eight Sim needs (hunger, energy, etc.) with colored bars = power/energy gauges |
| Simoleon symbol | Currency display | The green `$` symbol = energy cost tracking |
| Buy mode categories | Entity groupings | Lighting, appliances, electronics = domain groupings |
| Live mode bottom bar | Dashboard navigation | The sky-blue action bar with gold-highlighted icons = dashboard controls |
| Build mode catalog | Tile cards | The grid of placeable items in a blue sidebar = climate/entity tiles |
| Loading screen tips | Splash card | "Reticulating splines" with rotating humorous tips |

### 2.3 Voice and Tone

The dashboards use Sims 2 humor and references:
- Dashboard names: "Pleasantview Overview", "Lighting Bureau", "Plumbob Command"
- Markdown cards reference Bella Goth, Mortimer Goth, Don Lothario
- Loading screen tips are Sims-themed jokes ("Reticulating your Zigbee mesh")
- Energy dashboard calls watts "simoleons"
- Security dashboard is framed as "Mortimer is watching"

### 2.4 Light Mode vs Dark Mode

**Light mode** (default) represents the signature Sims 2 daytime look — deep
navy backgrounds with sunburst rays, sky-blue panels, bright gold accents,
and the vibrant green plumbob. This is the primary Sims 2 aesthetic.

**Dark mode** represents the nighttime plumbob look — deeper midnight navy
backgrounds, muted blue panels, reduced contrast for comfortable evening use.
The sidebar and header become darker. Gold trim becomes muted bronze.

Both modes share the same structural palette (blue = primary surface and
action, green = active/on, gold = decoration). Only the base surfaces shift.

---

## 3. Design System

### 3.1 Color Tokens

The complete token set, with semantic meaning:

#### Surfaces

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-background-color` | `#0E1628` | `#080D18` | Main page background (navy base + sunburst rays) |
| `secondary-background-color` | `#131C2F` | `#0A0F1C` | Sub-pages, modals backdrop |
| `card-background-color` / `ha-card-background` | `#7EC8E6` | `#4A7A94` | Every card panel (sky-blue) |
| `app-drawer-background-color` | `#1A3350` | `#0F2035` | Sidebar panel (panel navy) |
| `input-fill-color` | `#6AB0D0` | `#2E2947` | Form fields, search boxes (tinted blue) |

#### Brand / Actions

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-color` | `#2F86C5` | `#9CCBE6` | Links, primary buttons, active elements |
| `accent-color` | `#7BC942` | `#7BC942` | Highlights, success highlights (plumbob green) |
| `dark-primary-color` | `#235E8C` | `#1B3A52` | Header bar, strong accents |
| `light-primary-color` | `#9CCBE6` | `#6BA3C7` | Subtle blue elements, hover states |

#### Text

| Token | Light | Dark | Used For |
|---|---|---|---|
| `primary-text-color` | `#4A3320` | `#FFF6E0` | Body text on light panels (dark brownish-navy) / cream on dark |
| `secondary-text-color` | `#5C7A96` | `#C4B696` | Captions, labels, timestamps |
| `text-primary-color` | `#FFF6E0` | `#FFF6E0` | Text on dark surfaces (header/sidebar) — cream |
| `disabled-text-color` | `#6B8299` | `#6B6280` | Placeholder text, disabled elements |

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
| `state-icon-color` | `#5C7A96` | `#8B80A0` | Inactive entity icons |
| `state-icon-active-color` | `#7BC942` | `#7BC942` | Active/on entity icons (plumbob green) |
| `state-icon-unavailable-color` | `#6B8299` | `#5C5470` | Unavailable entity icons |

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
- Card padding: inherited from HA defaults, visually warm due to blue panel surfaces
- Border radius: `--ha-card-border-radius` set to `12px` for the soft, rounded
  Sims 2 feel
- Shadows: `--ha-card-box-shadow` uses a subtle shadow that matches the
  floating-panel aesthetic

### 3.4 Component Patterns

#### Cards
Every card is a sky-blue panel (`#7EC8E6`) with a subtle shadow on the navy
sunburst background (`#0E1628`). Card titles use the display font. No borders —
the surface contrast provides separation. The `custom:sims2-panel` card adds an
explicit gold border (`#D8C39A`) for the full Sims 2 dialog box aesthetic.

#### Header
Deep blue bar (`#235E8C`) with cream text. The header is always dark (it
represents the Sims 2 top panel). Selected navigation uses plumbob green
(`#7BC942`) as the highlight.

#### Sidebar
Dark navy panel (`#1A3350`) with cream-colored text and pale blue icons.
Selected items get a blue highlight background with cream text — mimicking the
Sims 2 side panel navigation.

#### Switches
Sky-blue toggle button on a plumbob-green track when on, muted blue-grey track
when off. No Material Design ripple — just the warm, tactile feel of a Sims 2
toggle.

#### Sliders
Panel-blue fill bar, sky-blue thumb knob, gold track. The slider looks like
a Sims 2 need meter being adjusted.

#### Background Pattern
The signature sunburst ray pattern is implemented as a CSS `radial-gradient`
with alternating ray angles on the navy base. No images required. The rays are
subtle — just enough to give depth and character, matching the game's main
window background.

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
Fonts, scrollbars, selection colors, focus rings, and the sunburst background
pattern — these apply to the document and inherit through shadow boundaries
(font-family inherits; scrollbar and selection styles apply at the document
level).

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
5. Overrides CSS (component-specific styling — switches, sliders, badges, sunburst background, etc.)
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
navy background with sunburst rays, gold wordmark, animated progress bar,
rotating humorous tip text. Dismisses by fading out.

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
green_above: 66                # >= 66 -> green plumbob
yellow_above: 33               # >= 33 -> yellow plumbob
                               # < 33  -> red plumbob
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
  green: 2000                  # Value below this -> green arc
  yellow: 5000                 # Value below this -> yellow arc
  red: 8000                    # Value above this -> red arc
```

**Visual:** A circular dial (like a speedometer) with colored arcs — green for
normal, yellow for warning, red for critical. The current value is shown as a
needle and numeric readout. Styled to match the Sims 2 need meter aesthetic.

### 5.4 `custom:sims2-panel`

A sky-blue panel card with gold trim borders — the Sims 2 equivalent of a
dialog box or info window. Wraps standard HA content in the signature Sims 2
panel aesthetic with rounded corners, blue background, and decorative gold
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

**Visual:** A sky-blue panel (`#7EC8E6`) with a gold border (`#D8C39A`), rounded
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

90+ custom icons registered under the `sims2:` prefix, extracted from The Sims 2
game UI reference images and community design study. Every icon is hand-traced
vector art on a 24x24 viewBox grid so it scales cleanly alongside `mdi:` icons.

Use anywhere you'd use `mdi:`:

```yaml
# Entity configuration
light.kitchen:
  icon: sims2:lamplight

sensor.house_mood:
  icon: sims2:plumbob-mood-green

person.bella_goth:
  icon: sims2:sim
```

### 6.1 Icon Extraction Process

Icons were extracted by studying the following reference materials:

1. **Live mode overlay screenshot** (`reference-images/SimDesktop - Overlay.png`) —
   bottom action bar icons (Sim portrait, phone, catalog, computer, career,
   rewards, settings), plumbob above Sim head, need meters on right panel
2. **Active gameplay screenshot**
   (`reference-images/SimDesktop - InGame.png`) — need meter bars at various
   levels, simoleon counter, date/time display, room navigation buttons
3. **Community design study PDF**
   (`reference-images/Sims 2 UI Design Study (Community).pdf`) — community-
   extracted and annotated UI elements: button shapes, pill indicators,
   play/pause controls, need bar gradients, dialog icons, Sim portrait frames

Each icon is drawn as original vector art matching the proportions, color
scheme, and visual style of the game. No EA assets are embedded.

### 6.2 Visual Style — Glossy Buttons with Reflection Overlays

The Sims 2 UI uses a signature glossy, beveled aesthetic throughout. Every
icon and UI element follows these rules:

**Action bar buttons:** Filled icon shapes in cream (`#E8E0D0`) inside
rounded rectangular buttons with a blue gradient
(`#5A9ABF` → `#3A7AA0` → `#2D6888`) and gold borders (`#D8C39A`).
Each button carries a glossy reflection overlay — a semi-transparent white
gradient on the top 45% that creates the glass-like sheen.

**Need meter bars (cylindrical glass-tube effect):** The bars appear as
transparent cylinders containing colored liquid. Dark beveled track with
outer rim highlight. Each fill uses a three-stop vertical gradient with a
bright center band to simulate light passing through a curved surface, plus
two horizontal reflection bands — a strong white gradient stripe across the
upper 35% and a subtler lower highlight across the bottom 20%. Inset box
shadows add top and bottom cylindrical depth. The result is a glass capsule
appearance matching the game UI.

**Need category icons:** Colored circular backgrounds (radial gradient per
need — green for hunger/comfort, lime-green for energy, orange for fun,
blue for social, teal for hygiene, purple for bladder) with white filled
icon shapes.

**Bottom action bar container:** Sky-blue gradient background
(`#7EC8E6` → `#5AB0D8` → `#4AA0CC`) with gold border and its own
glossy reflection overlay.

### 6.3 Animations

CSS animations bring the icons to life in the gallery and dashboards:

| Animation | Element | Effect |
|---|---|---|
| Plumbob Float + Spin | All plumbob diamonds | Four hand-drawn SVG views at different Y-axis angles (0°, 72°, 144°, 216°) crossfaded sequentially over 6s, each with shifted facet widths and lighting gradients to simulate a true 3D rotating diamond. Combined with vertical bob (up/down 8px). |
| Plumbob Glow | All plumbob diamonds | Pulsing green glow shadow, 3s cycle |
| Meter Fill | Need bars on page load | Bar animates from 0% to target width, 1.5s ease-out |
| Critical Blink | Red-level need bars | Opacity pulse (1.0 → 0.7), 2s cycle — signals urgency |
| Icon Pulse | Active need icons | Scale pulse (1.0 → 1.1), 1.5s cycle |
| Star Spin | Reward star icon | Continuous 360deg rotation, 8s linear |

The gallery page (`artifacts/icons-extracted.html`) demonstrates all
animations in a dedicated section.

### 6.4 Extracted Icon Gallery

#### Plumbob (Faceted Diamond)

The iconic floating diamond above every Sim's head. Five facets with gradient
shading create the 3D crystal appearance. Four mood states extracted from
gameplay screenshots:

| Green (Healthy) | Yellow (Okay) | Orange (Unhappy) | Red (Critical) |
|:---:|:---:|:---:|:---:|
| <svg viewBox="0 0 24 32" width="36" height="48"><defs><linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B8F0A0"/><stop offset="100%" stop-color="#7BC942"/></linearGradient><linearGradient id="pgl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7BC942"/><stop offset="100%" stop-color="#5AA830"/></linearGradient><linearGradient id="pgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6AB838"/><stop offset="100%" stop-color="#4A9428"/></linearGradient><linearGradient id="pgbl" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5AA830"/><stop offset="100%" stop-color="#3D8020"/></linearGradient><linearGradient id="pgr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4A9428"/><stop offset="100%" stop-color="#2E6818"/></linearGradient></defs><polygon points="12,1 20,10 12,11" fill="url(#pg2)"/><polygon points="12,1 4,10 12,11" fill="url(#pgl)"/><polygon points="12,31 4,10 12,11" fill="url(#pgbl)"/><polygon points="12,31 20,10 12,11" fill="url(#pgr2)"/><line x1="12" y1="1" x2="12" y2="11" stroke="#A8E878" stroke-width="0.3" opacity="0.6"/></svg> | <svg viewBox="0 0 24 32" width="36" height="48"><defs><linearGradient id="py2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F8E870"/><stop offset="100%" stop-color="#E6C430"/></linearGradient><linearGradient id="pyl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E6C430"/><stop offset="100%" stop-color="#C4A020"/></linearGradient><linearGradient id="pyr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D4B028"/><stop offset="100%" stop-color="#A88C18"/></linearGradient><linearGradient id="pybl" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C4A020"/><stop offset="100%" stop-color="#887018"/></linearGradient><linearGradient id="pyr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A88C18"/><stop offset="100%" stop-color="#685810"/></linearGradient></defs><polygon points="12,1 20,10 12,11" fill="url(#py2)"/><polygon points="12,1 4,10 12,11" fill="url(#pyl)"/><polygon points="12,31 4,10 12,11" fill="url(#pybl)"/><polygon points="12,31 20,10 12,11" fill="url(#pyr2)"/><line x1="12" y1="1" x2="12" y2="11" stroke="#F0D870" stroke-width="0.3" opacity="0.6"/></svg> | <svg viewBox="0 0 24 32" width="36" height="48"><defs><linearGradient id="po2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F0A850"/><stop offset="100%" stop-color="#E68A2E"/></linearGradient><linearGradient id="pol" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E68A2E"/><stop offset="100%" stop-color="#C06E1E"/></linearGradient><linearGradient id="por" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#CC7E24"/><stop offset="100%" stop-color="#9E5C14"/></linearGradient><linearGradient id="pobl" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C06E1E"/><stop offset="100%" stop-color="#784810"/></linearGradient><linearGradient id="por2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9E5C14"/><stop offset="100%" stop-color="#583408"/></linearGradient></defs><polygon points="12,1 20,10 12,11" fill="url(#po2)"/><polygon points="12,1 4,10 12,11" fill="url(#pol)"/><polygon points="12,31 4,10 12,11" fill="url(#pobl)"/><polygon points="12,31 20,10 12,11" fill="url(#por2)"/><line x1="12" y1="1" x2="12" y2="11" stroke="#F0B860" stroke-width="0.3" opacity="0.6"/></svg> | <svg viewBox="0 0 24 32" width="36" height="48"><defs><linearGradient id="pr2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F07070"/><stop offset="100%" stop-color="#D94040"/></linearGradient><linearGradient id="prl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D94040"/><stop offset="100%" stop-color="#B02828"/></linearGradient><linearGradient id="prr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C03838"/><stop offset="100%" stop-color="#8C2020"/></linearGradient><linearGradient id="prbl" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B02828"/><stop offset="100%" stop-color="#681414"/></linearGradient><linearGradient id="prr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8C2020"/><stop offset="100%" stop-color="#480C0C"/></linearGradient></defs><polygon points="12,1 20,10 12,11" fill="url(#pr2)"/><polygon points="12,1 4,10 12,11" fill="url(#prl)"/><polygon points="12,31 4,10 12,11" fill="url(#prbl)"/><polygon points="12,31 20,10 12,11" fill="url(#prr2)"/><line x1="12" y1="1" x2="12" y2="11" stroke="#F08080" stroke-width="0.3" opacity="0.6"/></svg> |
| `sims2:plumbob-mood-green` | `sims2:plumbob-mood-yellow` | (upcoming) | `sims2:plumbob-mood-red` |

> **Design note:** The plumbob is rendered with six visible facets across three
> horizontal bands — a yellow-green top pair, a mid-green middle band, and a
> dark teal-green bottom pair. Smooth gradient transitions between the bands
> create the elongated 3D crystal appearance. Edge highlights at the equator
> and along the vertical axis reinforce the faceted geometry. The plumbob
> animates with four hand-drawn SVG frames at different Y-axis angles
> (0°, 72°, 144°, 216°), each showing shifted facet widths and lighting
> gradients to simulate a true 3D rotating diamond — not a CSS rotateY on a
> flat image. The frames crossfade sequentially while the whole plumbob bobs
> up and down, simulating a gently spinning, floating crystal.

#### Simoleon Currency

| Simoleon Coin |
|:---:|
| <svg viewBox="0 0 24 24" width="36" height="36"><defs><linearGradient id="cb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F0D478"/><stop offset="50%" stop-color="#D8C39A"/><stop offset="100%" stop-color="#B09868"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#cb)" stroke="#806830" stroke-width="0.5"/><circle cx="12" cy="12" r="9.5" fill="url(#cb)"/><path d="M12.5,6.5 C12.5,6.5 12.5,7.5 12,8 C10.5,9.5 10,11 10.5,12.5 C11,14 13,14.5 14.5,13.5" fill="none" stroke="#2D8C28" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="4" x2="12" y2="7" stroke="#2D8C28" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="20" stroke="#2D8C28" stroke-width="1.5" stroke-linecap="round"/></svg> |
| `sims2:simoleon` |

#### Need Meter Bars

Horizontal bars with rounded ends, matching the need panel on the right side
of the game UI. Gradient fills transition through green → yellow → orange → red:

| Level | Bar | Key |
|---|---|---|
| Full (Green) | <svg width="120" height="16" viewBox="0 0 200 20"><defs><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A8F080"/><stop offset="100%" stop-color="#50C828"/></linearGradient></defs><rect x="1" y="1" width="198" height="18" rx="9" fill="#3A4048" stroke="#5A6068" stroke-width="0.5"/><rect x="3" y="3" width="194" height="14" rx="7" fill="url(#ng)"/></svg> | `sims2:need-*` (100%) |
| Medium (Yellow) | <svg width="120" height="16" viewBox="0 0 200 20"><defs><linearGradient id="ny" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F8E870"/><stop offset="100%" stop-color="#D4B020"/></linearGradient></defs><rect x="1" y="1" width="198" height="18" rx="9" fill="#3A4048" stroke="#5A6068" stroke-width="0.5"/><rect x="3" y="3" width="100" height="14" rx="7" fill="url(#ny)"/></svg> | (50%) |
| Critical (Red) | <svg width="120" height="16" viewBox="0 0 200 20"><defs><linearGradient id="nr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F07070"/><stop offset="100%" stop-color="#C03030"/></linearGradient></defs><rect x="1" y="1" width="198" height="18" rx="9" fill="#3A4048" stroke="#5A6068" stroke-width="0.5"/><rect x="3" y="3" width="20" height="14" rx="7" fill="url(#nr)"/></svg> | (10%) |

#### Need Category Icons

Extracted from the right-side need panel in the game UI:

| Hunger | Comfort | Fun | Social |
|:---:|:---:|:---:|:---:|
| <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="13" r="6" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><path d="M12,7 C12,7 13,5 14,5.5 C15,6 13.5,8 13.5,8" fill="none" stroke="#E0E8F0" stroke-width="1"/><line x1="12" y1="7" x2="12" y2="9" stroke="#E0E8F0" stroke-width="0.8"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><path d="M6,12 L6,8 C6,7 7,6 8,6 L16,6 C17,6 18,7 18,8 L18,12" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><rect x="6" y="12" width="12" height="5" rx="1" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><line x1="8" y1="17" x2="8" y2="19" stroke="#E0E8F0" stroke-width="1.2"/><line x1="16" y1="17" x2="16" y2="19" stroke="#E0E8F0" stroke-width="1.2"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="8" cy="17" r="3" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><circle cx="16" cy="15" r="3" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><rect x="10" y="6" width="2" height="11" fill="#E0E8F0"/><rect x="16" y="4" width="2" height="8" fill="#E0E8F0"/><rect x="10" y="4" width="8" height="3" fill="#E0E8F0"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="9" cy="8" r="3" fill="none" stroke="#E0E8F0" stroke-width="1.2"/><path d="M3,21 C3,17 6,15 9,15 C12,15 15,17 15,21" fill="none" stroke="#E0E8F0" stroke-width="1.2"/><circle cx="16" cy="9" r="2.5" fill="none" stroke="#E0E8F0" stroke-width="1"/><path d="M13,21 C13,18 15,16 17,16 C19,16 21,18 21,21" fill="none" stroke="#E0E8F0" stroke-width="1"/></svg> |
| `need-hunger` | `need-comfort` | `need-fun` | `need-social` |

| Hygiene | Bladder | Energy |
|:---:|:---:|:---:|
| <svg viewBox="0 0 24 24" width="32" height="32"><rect x="8" y="3" width="2" height="18" rx="0.5" fill="#E0E8F0"/><line x1="9" y1="7" x2="14" y2="9" stroke="#E0E8F0" stroke-width="1.2" stroke-linecap="round"/><line x1="9" y1="11" x2="15" y2="13" stroke="#E0E8F0" stroke-width="1.2" stroke-linecap="round"/><line x1="9" y1="15" x2="14" y2="17" stroke="#E0E8F0" stroke-width="1.2" stroke-linecap="round"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="13" r="7" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><line x1="12" y1="9" x2="12" y2="13" stroke="#E0E8F0" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="13" x2="15" y2="15" stroke="#E0E8F0" stroke-width="1.2" stroke-linecap="round"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="14,3 6,13 11,13 10,21 18,11 13,11" fill="#E0E8F0"/></svg> |
| `need-hygiene` | `need-bladder` | `need-energy` |

#### Bottom Action Bar Icons

Extracted from the game's bottom action bar overlay:

| Sim Portrait | Phone | Catalog | Computer | Career | Rewards | Settings |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="9" r="5.5" fill="none" stroke="#E0E8F0" stroke-width="1.5"/><path d="M5,22 C5,17 8,15 12,15 C16,15 19,17 19,22" fill="none" stroke="#E0E8F0" stroke-width="1.5"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><path d="M8,15.5 C8,15.5 9.5,16 11,15.5 C13,15 16,14 18,12 C20,10 20.5,7.5 20.5,6.5 L18.5,6 C18.5,6 18.5,5 17.5,4.5 L13.5,2 C12.5,1.5 11.5,2 11.5,2 L9.5,3.5 C9.5,3.5 9,4 9.5,5 L11,8 C11,8 10.5,9 9.5,9.5 C8.5,10 7,10.5 7,10.5 Z" fill="none" stroke="#E0E8F0" stroke-width="1.2"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><rect x="4" y="6" width="16" height="14" rx="1.5" fill="none" stroke="#E0E8F0" stroke-width="1.5"/><line x1="4" y1="10" x2="20" y2="10" stroke="#E0E8F0" stroke-width="1"/><path d="M7,6 L7,4 C7,3 8,3 8,3 L16,3 C16,3 17,3 17,4 L17,6" fill="none" stroke="#E0E8F0" stroke-width="1.2"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><rect x="4" y="4" width="16" height="11" rx="1.5" fill="none" stroke="#E0E8F0" stroke-width="1.5"/><line x1="9" y1="18" x2="15" y2="18" stroke="#E0E8F0" stroke-width="1.5"/><line x1="7" y1="19" x2="17" y2="19" stroke="#E0E8F0" stroke-width="1.5"/><rect x="8" y="6" width="8" height="5" rx="0.5" fill="#E0E8F0" opacity="0.3"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><path d="M8,10 L8,7 C8,6 9,5.5 10,5.5 L14,5.5 C15,5.5 16,6 16,7 L16,10" fill="none" stroke="#E0E8F0" stroke-width="1.3"/><line x1="7" y1="10" x2="17" y2="10" stroke="#E0E8F0" stroke-width="1.5"/><line x1="9" y1="10" x2="9" y2="18" stroke="#E0E8F0" stroke-width="1.2"/><line x1="15" y1="10" x2="15" y2="18" stroke="#E0E8F0" stroke-width="1.2"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="12,3 14.5,9 21,9.5 16,14 17.5,21 12,17.5 6.5,21 8,14 3,9.5 9.5,9" fill="none" stroke="#E0E8F0" stroke-width="1.3"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="12" r="4" fill="none" stroke="#E0E8F0" stroke-width="1.5"/></svg> |
| `sim-portrait` | `phone` | `catalog` | `computer` | `career` | `rewards` | `settings` |

#### UI Control Icons

Extracted from the community design study — dialog buttons, navigation controls:

| Check | Close | Play | Back | Heart |
|:---:|:---:|:---:|:---:|:---:|
| <svg viewBox="0 0 24 24" width="32" height="32"><polyline points="5,12 10,17 19,7" fill="none" stroke="#E0E8F0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><line x1="6" y1="6" x2="18" y2="18" stroke="#E0E8F0" stroke-width="2.5" stroke-linecap="round"/><line x1="18" y1="6" x2="6" y2="18" stroke="#E0E8F0" stroke-width="2.5" stroke-linecap="round"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="7,5 19,12 7,19" fill="#50C828" stroke="#3DA020" stroke-width="0.5"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><polygon points="17,5 5,12 17,19" fill="#D94040" stroke="#B02828" stroke-width="0.5"/></svg> | <svg viewBox="0 0 24 24" width="32" height="32"><path d="M12,20 C12,20 4,14 4,8.5 C4,5.5 6.5,3 9,3 C10.5,3 12,4 12,4 C12,4 13.5,3 15,3 C17.5,3 20,5.5 20,8.5 C20,14 12,20 12,20 Z" fill="none" stroke="#E0E8F0" stroke-width="1.3"/></svg> |
| `check` | `close` | `play` | `back` | `heart` |

### 6.5 Icon Categories and Keys

**Plumbob:** `sims2:plumbob`, `sims2:plumbob-mood-green`, `sims2:plumbob-mood-yellow`, `sims2:plumbob-mood-red`

**Currency:** `sims2:simoleon`, `sims2:simoleon-stack`

**Needs:** `sims2:need-hunger`, `sims2:need-energy`, `sims2:need-comfort`, `sims2:need-fun`, `sims2:need-social`, `sims2:need-hygiene`, `sims2:need-bladder`, `sims2:need-room`

**Game Modes:** `sims2:live-mode`, `sims2:buy-mode`, `sims2:build-mode`, `sims2:cas-mode`, `sims2:story-mode`

**Buy Mode Rooms:** `sims2:room-kitchen`, `sims2:room-bathroom`, `sims2:room-bedroom`, `sims2:room-living`, `sims2:room-dining`, `sims2:room-outside`, `sims2:room-study`, `sims2:room-kids`, `sims2:room-garage`, `sims2:room-hallway`

**Buy Mode Types:** `sims2:type-comfort`, `sims2:type-surfaces`, `sims2:type-storage`, `sims2:type-beds`, `sims2:type-electronics`, `sims2:type-appliances`, `sims2:type-plumbing`, `sims2:type-decorative`, `sims2:type-lighting`, `sims2:type-skills`, `sims2:type-toys`

**Shopping:** `sims2:shop-tag`, `sims2:shop-cart`, `sims2:shop-window`

**Sorting:** `sims2:sort-rooms`, `sims2:sort-type`, `sims2:sort-function`, `sims2:sort-name`, `sims2:sort-price`

**HA Entity Domains:** `sims2:lamplight`, `sims2:brightness`, `sims2:chandelier`, `sims2:toggle`, `sims2:breaker`, `sims2:gauge`, `sims2:eye`, `sims2:motion`, `sims2:door-sensor`, `sims2:thermometer`, `sims2:fan-blades`, `sims2:winter`, `sims2:curtain`, `sims2:garage-door`, `sims2:lock-circular`, `sims2:camera-eye`, `sims2:speaker`, `sims2:music-note`, `sims2:broom`, `sims2:shield`, `sims2:bell`, `sims2:gears`, `sims2:robot`

**Security & Automation:** `sims2:lock`, `sims2:script`

**Aspiration & Wants:** `sims2:aspiration-star`, `sims2:want-bubble`

**Sim Characters:** `sims2:sim`, `sims2:sim-head`, `sims2:user`

**Utility:** `sims2:scroll`, `sims2:book-open`, `sims2:sparkle`, `sims2:magic-wand`, `sims2:map-pin`, `sims2:compass`, `sims2:sun`, `sims2:moon`, `sims2:cloud`, `sims2:raindrop`, `sims2:sunrise`, `sims2:radar`, `sims2:hourglass`, `sims2:stopwatch`

**UI Controls:** `sims2:slider-horiz`, `sims2:text-line`, `sims2:calendar-grid`, `sims2:bubble-chat`, `sims2:bell-ring`, `sims2:number-increment`, `sims2:dropdown-arrow`, `sims2:dial-knob`, `sims2:push-button`, `sims2:arrow-up-circle`, `sims2:eye-scanned`, `sims2:grid`, `sims2:layout`, `sims2:hook`, `sims2:chart-line`, `sims2:sprout`, `sims2:leaf`, `sims2:clipboard-check`, `sims2:tag-round`, `sims2:doorbell`, `sims2:warning-triangle`

Full rendered preview: [artifacts/icons-extracted.html](../artifacts/icons-extracted.html)
Full catalogue: [docs/ICONS.md](ICONS.md)

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
navy + sky-blue daytime look and the midnight navy nighttime look.

### 8.2 `sims2-light`
Forces the signature Sims 2 daytime look — deep navy backgrounds, sky-blue
panels, bright gold accents, vibrant green plumbob.

### 8.3 `sims2-dark`
Forces the deep midnight navy look. Lower contrast, preserved green for active
states, muted blue panels throughout.

### 8.4 Theme Selection

The look is applied automatically by the injected style layer (no configuration
needed). For the native HA theme picker:

```yaml
# configuration.yaml
frontend:
  themes:
    !include_dir_merge_named themes
```

Then select under **Profile -> Theme**.

---

## 9. Installation Flow

### 9.1 Prerequisites
- Home Assistant 2025.8 or newer
- HACS (Home Assistant Community Store)
- No `configuration.yaml` edits required for basic use

### 9.2 Steps
1. **HACS -> Custom repositories** -> add `https://github.com/n00b001/sims2ha`,
   category **Integration**
2. **Find Sims 2 -> Install**
3. **Restart Home Assistant** (required once for HACS)
4. **Settings -> Devices & Services -> Add Integration** -> search **Sims 2** -> click
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
