# Sims 2 for Home Assistant — Comprehensive Implementation Plan

> A complete, detailed plan to transform Home Assistant into a faithful recreation of The Sims 2 user interface using only official Home Assistant extension points and HACS capabilities.

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Phase 1: Foundation - Theme System](#2-phase-1-foundation---theme-system)
3. [Phase 2: Login & Loading Screens](#3-phase-2-login---loading-screens)
4. [Phase 3: UI Enhancement - Custom Cards](#4-phase-3-ui-enhancement---custom-cards)
5. [Phase 4: Sidebar & Built-in Elements](#5-phase-4-sidebar---built-in-elements)
6. [Phase 5: Visual Language - Icon Set](#6-phase-5-visual-language---icon-set)
7. [Phase 6: User Experience - Dashboards & Navigation](#7-phase-6-user-experience---dashboards---navigation)
8. [Phase 7: Polish & Integration](#8-phase-7-polish---integration)
9. [Phase 8: Documentation & Release](#9-phase-8-documentation---release)
10. [Technical Specifications](#10-technical-specifications)
11. [Risk Assessment & Mitigation](#11-risk-assessment---mitigation)
12. [Appendix: Reference Assets](#12-appendix-reference-assets)
13. [Implementation Timeline](#13-implementation-timeline)

---

## 1. Project Overview

### 1.1 Vision
Create a Home Assistant frontend that evokes the nostalgic, playful aesthetic of The Sims 2 (2004) Live Mode and Buy Mode interfaces, characterized by:
- **Blue-dominant color palette**: Deep navy backgrounds, sky-blue panels, gold accents, and plumbob-green for active states
- **Bubbly rounded UI**: Generous border-radius (12-24px) on all interactive elements
- **Glossy highlights**: Subtle reflective overlays on panels and buttons
- **Sunburst background**: Radiating light rays on the main application background
- **Cream text on dark surfaces**: For header and sidebar readability
- **Iconic plumbob feedback**: Green diamond indicator for active/on states
- **Custom login and loading screens**: Themed authentication and startup experiences

### 1.2 Scope & Constraints
- **Official HA extensions only**: No core modifications; uses themes, lovelace resources, panel integrations, and custom cards
- **HACS distributable**: Designed for publication as a HACS integration
- **Fallback gracefully**: Degrades gracefully if optional dependencies (card-mod, browser-mod) are missing
- **Dual theme support**: Light (daytime) and dark (nighttime) Sims 2 variants
- **Accessibility compliant**: Maintains WCAG 2.1 AA contrast ratios where possible
- **Complete theming**: Covers login screen, loading screens, sidebar, menus, and all built-in UI elements

### 1.3 Success Criteria
- [ ] Complete theme variable coverage (>200 CSS variables overridden)
- [ ] Themed login screen with Sims 2 aesthetics
- [ ] Themed loading/connecting screens (pre and post-authentication)
- [ ] Themed sidebar, menus, and built-in icons
- [ ] Minimum 5 custom Sims 2-themed lovelace cards
- [ ] Complete icon set covering core HA domains
- [ ] 3+ pre-configured dashboards demonstrating the theme
- [ ] HACS-installable with one-click setup
- [ ] Documented installation and customization guide

---

## 2. Comprehensive Theme Variable Coverage Matrix

This matrix maps **every** Home Assistant CSS variable category from `docs/HA_THEMING_CAPABILITIES.md` to its Sims 2 implementation status. Each row is one variable group — if the status is anything other than "done", the Phase 1 theme YAML must be extended.

> **Implementation status (complete).** Every variable flagged `missing` below has since been added to `custom_components/sims2ha/themes/sims2.yaml`. The live audit (`uv run python scripts/audit_theme_variables.py`) reports **131 documented / 284 themed / 0 missing**. The per-row `missing` labels are retained as the historical pre-implementation gap audit, not the current state.

### 2.1 Core Interface & Brand Colors
| Variable Group | Status | Planned Value | Where |
|---|---|---|---|
| `--primary-color`, `--accent-color` | done | `#2F86C5` / `#7BC942` | `sims2.yaml` |
| `--dark-primary-color`, `--light-primary-color` | done | `#235E8C` / `#9CCBE6` | `sims2.yaml` |
| `--primary-text-color`, `--secondary-text-color` | done | `#4A3320` / `#7A5A38` (light) | `sims2.yaml` |
| `--text-primary-color` | done | `#FFF6E0` | `sims2.yaml` |
| `--disabled-text-color` | done | `#A98C5C` (light) | `sims2.yaml` |
| `--card-background-color` | done | sky-blue gradient / midnight navy | `sims2.yaml` + CSS |
| `--primary-background-color` | done | `#0E1628` navy sunburst | `sims2.yaml` + CSS |
| `--secondary-background-color` | done | `#131C2F` / `#102338` | `sims2.yaml` |
| `--divider-color`, `--outline-color` | done | `#D8C39A` gold trim | `sims2.yaml` |
| `--shadow-color` | **missing** | `rgba(14,22,40,X)` | add to theme |

### 2.2 State / Entity Domain Colors
*(Format: `--state-{domain}-{device_class}-{state}-color`)*

| State Variable | Status | Sims 2 Value |
|---|---|---|
| `--state-active-color` | done | `#7BC942` plumbob green |
| `--state-inactive-color` | done | `#9C8458` / `#5F84A8` |
| `--state-unavailable-color` | **missing** | muted grey `#6B6280` |
| `--state-light-on-color` | **missing** | `#7BC942` |
| `--state-switch-on-color` | **missing** | `#7BC942` |
| `--state-binary_sensor-on-color` | **missing** | `#7BC942` |
| `--state-climate-heat-color` | **missing** | `#E09A2B` warm gold |
| `--state-climate-cool-color` | **missing** | `#2F86C5` panel blue |
| `--state-climate-idle-color` | **missing** | `#9CCBE6` sky blue |
| `--state-device_tracker-home-color` | **missing** | `#7BC942` |
| `--state-device_tracker-not_home-color` | **missing** | `#C0392B` |
| `--state-locked-color` | **missing** | `#7BC942` |
| `--state-unlocked-color` | **missing** | `#E09A2B` |
| `--state-alarm_control_panel-armed_away-color` | **missing** | `#C0392B` |
| `--state-alarm_control_panel-disarmed-color` | **missing** | `#7BC942` |
| `--state-alarm_control_panel-pending-color` | **missing** | `#E09A2B` |
| `--state-alert-on-color` | **missing** | `#E09A2B` |
| `--state-siren-active-color` | **missing** | `#C0392B` |
| `--state-humidifier-on-color` | **missing** | `#2F86C5` |
| `--state-fan-on-color` | **missing** | `#2F86C5` |
| `--state-vacuum-on-color` | **missing** | `#7BC942` |
| `--state-weather-sunny-color` | **missing** | `#F2C14E` sun gold |
| `--state-weather-cloudy-color` | **missing** | `#8BA4BE` muted blue |
| `--state-weather-rainy-color` | **missing** | `#5C7A96` steel blue |
| `--state-weather-snowy-color` | **missing** | `#D8E8F0` ice blue |
| `--state-update-in_progress-color` | **missing** | `#E09A2B` |
| `--state-script-running-color` | **missing** | `#7BC942` |
| `--state-automation-triggered-color` | **missing** | `#F2C14E` |

### 2.3 Energy Dashboard Colors
| Variable | Status | Value |
|---|---|---|
| `--energy-grid-consumption-color` | **missing** | `#C0392B` error red |
| `--energy-grid-return-color` | **missing** | `#7BC942` plumbob green |
| `--energy-solar-color` | **missing** | `#F2C14E` sun gold |
| `--energy-non-fossil-color` | **missing** | `#7BC942` |
| `--energy-battery-out-color` | **missing** | `#E09A2B` warning |
| `--energy-battery-in-color` | **missing** | `#7BC942` |
| `--energy-gas-color` | **missing** | `#D8C39A` gold trim |
| `--energy-water-color` | **missing** | `#2F86C5` panel blue |

### 2.4 Typography Variables
| Variable | Status | Value |
|---|---|---|
| `--ha-font-family` | **missing** | `"Benguiat Gothic", system-ui, sans-serif` |
| `--ha-font-size-xs` through `--ha-font-size-xxl` | **missing** | scale from `10px` to `28px` |
| `--ha-font-weight-light` through `--ha-font-weight-bold` | **missing** | `300` / `400` / `500` / `600` / `700` |
| `--ha-line-height-*` | **missing** | `1.3` / `1.5` / `1.7` scale |
| `--ha-letter-spacing-*` | **missing** | `0.01em` / `0.04em` / `0.08em` |

### 2.5 Spacing Variables
| Variable | Status | Value |
|---|---|---|
| `--ha-space-0` through `--ha-space-12` | **missing** | `0px` to `48px` in `4px` steps (keep HA defaults, no override needed unless adjusting) |

### 2.6 Shadow / Elevation Variables
| Variable | Status | Value |
|---|---|---|
| `--ha-box-shadow-*` (security-card, dialog, menu) | **missing** | navy-tinted shadows `rgba(14,22,40,X)` |
| `--ha-card-box-shadow` | done | `0 2px 6px rgba(74,51,32,0.18)` |

### 2.7 Border Radius Variables
| Variable | Status | Value |
|---|---|---|
| `--ha-border-radius-xs` | **missing** | `4px` |
| `--ha-border-radius-sm` | **missing** | `8px` |
| `--ha-border-radius-md` | **missing** | `12px` |
| `--ha-border-radius-lg` | **missing** | `16px` |
| `--ha-border-radius-xl` | **missing** | `20px` |
| `--ha-border-radius-circle` | **missing** | `50%` |
| `--ha-card-border-radius` | done | `14px` |
| `--ha-sidebar-expanded-item-width` | **missing** | `248px` (or custom `280px`) |

### 2.8 Animation / Transition Variables
| Variable | Status | Value |
|---|---|---|
| `--ha-animation-duration-short` | **missing** | `0.15s` |
| `--ha-animation-duration-medium` | **missing** | `0.3s` |
| `--ha-animation-duration-long` | **missing** | `0.5s` |
| `--ha-animation-timing-function` | **missing** | `cubic-bezier(0.2, 0, 0, 1)` |

### 2.9 Graph / Calendar Color Palette
| Variable | Status | Value |
|---|---|---|
| `--color-1` through `--color-54` | **missing** | Map to Sims 2 palette: blues, golds, greens, navy and sky-blue tones |
| `--history-unavailable-color` | **missing** | `#6B6280` muted grey |

### 2.10 RGB Variant Variables
| Variable Group | Status | Notes |
|---|---|---|
| `--rgb-primary-color` | done | used for rgba() overlays |
| `--rgb-accent-color` | **missing** | need `123,201,66` |
| `--rgb-primary-text-color` | **missing** | need `74,51,32` |
| `--rgb-secondary-text-color` | **missing** | need `122,90,56` |
| `--rgb-text-primary-color` | **missing** | need `255,246,224` |
| `--rgb-card-background-color` | **missing** | need `126,200,230` |
| `--rgb-warning-color` | **missing** | need `224,154,43` |
| `--rgb-error-color` | **missing** | need `192,57,43` |
| `--rgb-success-color` | **missing** | need `91,168,44` |
| `--rgb-info-color` | **missing** | need `47,134,197` |

### 2.11 Scrollbar Color
| Variable | Status | Value |
|---|---|---|
| `--scrollbar-thumb-color` | **missing** | `#D8C39A` gold trim |

### 2.12 Input Component Colors
| Variable | Status | Where |
|---|---|---|
| `--input-fill-color` | done | `#EFE3C6` (light) / `#17304C` (dark) |
| `--input-ink-color` | done | `#2A2320` / `#EAF2FB` |
| `--input-label-ink-color` | **missing** | `#7A5A38` / `#9FB6CE` |
| `--input-idle-line-color` | **missing** | `#D8C39A` |
| `--input-hover-line-color` | **missing** | `#2F86C5` |
| `--input-disabled-line-color` | **missing** | `#A98C5C` |

### 2.13 Label Badge Colors
| Variable | Status | Where |
|---|---|---|
| `--label-badge-grey` | done | `#9C8458` |
| `--label-badge-red` | done | `#C0392B` |
| `--label-badge-green` | done | `#5BA82C` |
| `--label-badge-yellow` | done | `#E0B66B` |
| `--label-badge-blue` | done | `#2F86C5` |

### 2.14 State Icon Colors
| Variable | Status | Value |
|---|---|---|
| `--state-icon-color` | done | `#7A5A38` (light) / `#9FB6CE` (dark) |
| `--state-icon-active-color` | done | `#7BC942` |
| `--state-icon-unavailable-color` | done | `#A98C5C` |

### 2.15 Theme Implementation Plan

1. **Add missing state colors** to `sims2.yaml`: create a `state-colors:` mapping section with all per-domain and per-device_class values from sections 2.2–2.14 above.
2. **Add energy palette** to `sims2.yaml` using the mappings in 2.3.
3. **Add typography scale** to `sims2.yaml`: `--ha-font-family`, `--ha-font-size-*`, `--ha-font-weight-*`, `--ha-line-height-*`, `--ha-letter-spacing-*`.
4. **Add shadow/elevation** overrides: `--ha-box-shadow-*` variables.
5. **Add border radius scale**: `--ha-border-radius-*` variables.
6. **Add animation timing**: `--ha-animation-duration-*` and `--ha-animation-timing-function`.
7. **Add graph/calendar colors**: `--color-1` through `--color-54` mapped to Sims 2 palette.
8. **Add missing RGB variants** for all color variables.
9. **Add scrollbar color**: `--scrollbar-thumb-color`.
10. **Add input state colors**: `--input-label-ink-color`, `--input-idle-line-color`, `--input-hover-line-color`.
11. **Verify** coverage with a script that parses `HA_THEMING_CAPABILITIES.md` and checks each variable against `sims2.yaml`, reporting any gaps.

### 2.16 Night Mode Considerations
- Every color variable listed above must have both light and dark mode values.
- Dark mode uses deeper navy backgrounds (`#080D18`), muted blue cards (`#4A7A94`), and slightly dimmed gold/green accent tones.
- Reference the existing dark mode block in `sims2.yaml` for the established pattern.
- Ensure state colors remain visually distinct in dark mode (green → brighter `#8BD64A`, red → brighter `#E55B45`, yellow → `#E8A23C`).

---

## 3. Phase 1: Foundation - Theme System

### 2.1 Theme Architecture
Create a comprehensive theme YAML file (`sims2-theme.yaml`) that overrides **all** exposed Home Assistant CSS variables to match the Sims 2 palette.

#### 2.1.1 Color System Implementation
| Category | Variables to Override | Sims 2 Values (Light/Dark) | Implementation Notes |
|----------|----------------------|----------------------------|----------------------|
| **Base Surfaces** | `--primary-background-color`, `--secondary-background-color` | Light: `#0E1628` / `#131C2F`<br>Dark: `#080D18` / `#0A0F1C` | Base gets sunburst overlay via background-image |
| **Card Surfaces** | `--card-background-color`, `--dialog-background-color` | Light: `#7EC8E6` (sky-blue gradient)<br>Dark: `#4A7A94` (muted blue) | Use linear gradients for depth |
| **Primary Actions** | `--primary-color`, `--accent-color` | Light: `#2F86C5` / `#7BC942`<br>Dark: `#9CCBE6` / `#7BC942` | Primary = panel-blue, Accent = plumbob-green |
| **Text System** | `--primary-text-color`, `--text-primary-color`, `--disabled-text-color` | Light: `#4A3320` (espresso) / `#FFF6E0` (cream)<br>Dark: `#FFF6E0` / `#FFF6E0` / `#6B6280` | Cream text on dark surfaces, espresso on light |
| **Sidebar System** | `--sidebar-text-color`, `--sidebar-icon-color`, `--sidebar-selected-text-color` | Light: `#C4D8E8` / `#9CCBE6` / `#FFF6E0`<br>Dark: `#8BA4BE` / `#6BA3C7` / `#FFF6E0` | Cream text when selected |
| **State Indicators** | `--state-icon-active-color`, `--state-icon-color` | Light/Dark: `#7BC942` (plumbob green) / `#5C7A96` | Active states always plumbob green |
| **Feedback States** | `--error-color`, `--warning-color`, `--success-color`, `--info-color` | Light/Dark: `#C0392B` / `#E09A2B` / `#5BA82C` / `#2F86C5` | Maintain semantic meanings |
| **Input Controls** | `--input-fill-color`, `--input-ink-color` | Light: `#6AB0D0` / `#2A2320`<br>Dark: `#2E4060` / `#FFF6E0` | Tinted blue fill, appropriate text contrast |
| **Interactive Elements** | `--switch-checked-color`, `--slider-color`, `--slider-track-color` | Light: `#7BC942` / `#2F86C5` / `#D8C39A`<br>Dark: `#7BC942` / `#9CCBE6` / `#4A3A28` | Green for active states, blue tracks |
| **Border System** | `--divider-color`, `--outline-color`, `--ha-card-border-color` | Light/Dark: `#D8C39A` (gold-trim) | Consistent gold borders/dividers |
| **Badge System** | `--label-badge-[color]-background-color` | Light/Dark: Map to Sims 2 palette (red→`#C0392B`, green→`#7BC942`, etc.) | Semantic badge colors |

#### 2.1.2 Background & Effects
- **Sunburst Background**: Implement via `background-image` on `:root` using multiple overlapping radial gradients
- **Gloss Overlays**: Use `::before` pseudo-elements with `background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)` clipped to element borders
- **Inner Shadow Highlights**: `inset 0 1px 0 rgba(255,255,255,0.15)` on buttons/inputs for "plastic" shine
- **Focus Rings**: 3px solid `var(--sims2-plumbob-green)` with 2px offset for interactive elements

#### 2.1.3 Motion & Animation
- Define consistent transition durations via `--ha-animation-duration-*` variables
- Implement signature Sims 2 animations:
  - Plumbob pulse (active entities)
  - Button hover lift + gold glow
  - Card entrance fade/slide
  - Sidebar item shimmer on hover
  - Dialog plumbob-green fade-in
  - Loading spinner as rotating plumbob
  - Tab indicator slide
  - State-change flash on value updates
  - Header gold shimmer

### 2.2 Theme Implementation Steps
1. Create `sims2/sims2-theme.yaml` in the repository root
2. Populate with ALL CSS variables from `HA_THEMING_CAPABILITIES.md` mapped to Sims 2 values
3. Add light/dark mode sections using `modes:` key
4. Include background-image definition for sunburst effect
5. Test theme application via HA UI and `frontend.set_theme` service
6. Verify contrast ratios meet WCAG AA for text pairs
7. Create fallback mechanism for missing variables (log warnings)

### 2.3 Theme Distribution
- Package theme as part of HACS integration
- Provide automatic installation via `lovelace.resources` registration
- Offer manual installation instructions for YAML-mode users
- Include theme preview screenshots in documentation

---

## 3. Phase 2: Login & Loading Screens

### 3.1 Login Screen Customization
The login screen is rendered by `<ha-authorize>` and `<ha-auth-flow>` web components, served as a separate HTML page (`authorize.html`) that is NOT part of the main Home Assistant SPA. Standard theme YAML does NOT apply to the login page.

#### 3.1.1 Customization Approaches
Since the login page is external to the main SPA, we have the following options:

1. **Development Repository Approach**:
   - Fork Home Assistant frontend
   - Modify `authorize.html` directly
   - Maintain custom fork with Sims 2 login
   - *Note: This method requires the ability to run a custom build of Home Assistant, which may not be possible on all installations (for example, Home Assistant OS).*

2. **Reverse Proxy CSS Injection**:
   - Inject custom CSS via nginx/apache/Caddy
   - Target the login HTML directly
   - Apply Sims 2 theme to login elements
   - *Note: This method requires access to a reverse proxy in front of Home Assistant and is the most reliable method.*

3. **Browser Mod Limitation**:
   - Browser Mod cannot style pre-auth login screen (only works post-auth)

#### 3.1.2 Login Screen Implementation
Our approach will provide:
- CSS template for reverse proxy injection
- Documentation for implementation
- Optional development repo instructions

**Login Screen Styling Targets**:
- Background: Sunburst pattern matching main app (`--primary-background-color`)
- Login card: Sky-blue panel with gold border (`--card-background-color`, `--ha-card-border-color`)
- Card border-radius: 24px (bubbly)
- Title: Benguiat Gothic, cream text, gold accent
- Input fields: Tinted blue background, navy border, plumbob-green focus
- Buttons: Bubbly rounded, blue/gold gradient, plumbob-green hover
- Footer text: Cream-colored, subdued

#### 3.1.3 CSS Template for Login Screen
```css
/* Sims 2 Login Screen Customization */
body {
  background-color: #0E1628 !important;
  background-image:
    radial-gradient(ellipse 40% 35% at 50% 30%, rgba(74, 222, 128, 0.10) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232, 180, 77, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 25% 55% at 60% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
    radial-gradient(ellipse 20% 50% at 75% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
    radial-gradient(ellipse 22% 45% at 70% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
    radial-gradient(ellipse 20% 40% at 55% 55%, rgba(56, 120, 180, 0.07) 0%, transparent 100%),
    radial-gradient(ellipse 22% 45% at 35% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
    radial-gradient(ellipse 20% 50% at 25% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
    radial-gradient(ellipse 25% 55% at 40% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
    radial-gradient(ellipse 20% 50% at 50% 15%, rgba(74, 160, 210, 0.08) 0%, transparent 100%),
    radial-gradient(ellipse 22% 50% at 68% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
    radial-gradient(ellipse 22% 50% at 32% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
    radial-gradient(ellipse 18% 40% at 80% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
    radial-gradient(ellipse 18% 40% at 20% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
    radial-gradient(ellipse 75% 75% at 50% 30%, transparent 10%, rgba(14, 22, 40, 0.6) 100%);
  background-attachment: fixed !important;
  font-family: var(--sims2-font-body, "Benguiat Gothic", system-ui, sans-serif) !important;
  color: #2A2320 !important;
}

.login-card,
[class*="login"] {
  background: linear-gradient(
    180deg,
    #A8D8F0 0%,
    var(--sims2-sky-blue, #7EC8E6) 50%,
    #5BB4D8 100%
  ) !important;
  border: 3px solid var(--sims2-panel-blue-deep, #173A52) !important;
  border-radius: 24px !important;
  box-shadow:
    0 8px 48px rgba(26, 26, 62, 0.25),
    0 2px 12px rgba(26, 26, 62, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.7) !important;
}

.login-card h1,
.login-card .login-brand h1 {
  color: var(--sims2-gold, #E8B44D) !important;
  font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif) !important;
  text-shadow: 0 1px 3px rgba(232, 180, 77, 0.4) !important;
  letter-spacing: 0.06em !important;
}

.login-card ha-textfield,
.login-card paper-input-container {
  border-radius: 12px !important;
  --mdc-shape-large: 12px !important;
  --mdc-shape-medium: 12px !important;
  background-color: rgba(126, 200, 230, 0.5) !important;
}

.login-card mwc-button,
.login-card .login-form button {
  background: linear-gradient(
    180deg,
    #6EE7A0 0%,
    var(--sims2-plumbob-green, #7BC942) 40%,
    #22C55E 100%
  ) !important;
  border-radius: 12px !important;
  box-shadow:
    0 2px 8px rgba(74, 222, 128, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  border: 2px solid #16A34A !important;
  font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
}

.login-card mwc-button:hover {
  background: linear-gradient(180deg, #A7F3D0 0%, var(--sims2-plumbob-green, #7BC942) 100%) !important;
  box-shadow: 0 0 16px rgba(74, 222, 128, 0.5) !important;
}
```

### 3.2 Loading Screen Customization (Pre and Post-Authentication)

#### 3.2.1 Pre-Authentication Loading Screen
This appears before the login screen in mobile apps or during initial app load.

**Implementation**: Same approach as login screen - via reverse proxy or development repo.

**Styling**:
- Background: Match login screen sunburst
- Loading indicator: Rotating plumbob (sims2-loading-plum animation)
- Text: "Connecting to Home Assistant..." in Benguiat Gothic, cream color
- Animation: Pulsing glow effect

#### 3.2.2 Post-Authentication Loading Screen
This appears after login while HA loads initial state (rendered by `ha-bootstrap` / `home-assistant.ts`).

**Implementation**: This IS part of the main SPA, so our theme variables will apply directly.

**Styling Targets**:
- Background: `--primary-background-color` (navy sunburst)
- Loading plumbob: Custom animation using plumbob shape
- Status text: Cream-colored with plumbob-green pulsating animation
- Overall container: Semi-transparent navy backdrop

**Implementation Approach**:
1. Create loading-screen enhancement via `extra_module_url`
2. Target `.ha-loading .loading-plumbob` and `[part="loading"] .status`
3. Apply Sims 2 animations and styling

**CSS for Post-Auth Loading**:
```css
/* Sims 2 Loading Screen (Post-Auth) */
.connection-banner:not([hidden])::before,
.ha-loading .loading-plumbob {
  content: "";
  display: block;
  width: 80px;
  height: 80px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  background: linear-gradient(
    105deg,
    #B7F36B 0%,
    var(--sims2-plumbob-green, #7BC942) 35%,
    #22C55E 55%,
    #16A34A 100%
  );
  animation: sims2-loading-plum 3s ease-in-out infinite;
  margin-bottom: 24px;
}

.connection-banner:not([hidden])::after,
.loading-text,
[part="loading"] .status {
  color: var(--sims2-gold, #FFD700) !important;
  font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif) !important;
  font-size: 18px !important;
  letter-spacing: 0.08em !important;
  animation: sims2-loading-pulse 2s ease-in-out infinite;
}

@keyframes sims2-loading-plum {
  0%   { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
  25%  { transform: rotate(90deg) scale(1.15); filter: drop-shadow(0 0 16px rgba(74, 222, 128, 0.8)); }
  50%  { transform: rotate(180deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
  75%  { transform: rotate(270deg) scale(1.15); filter: drop-shadow(0 0 16px rgba(74, 222, 128, 0.8)); }
  100% { transform: rotate(360deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
}

@keyframes sims2-loading-pulse {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 1; text-shadow: 0 0 12px rgba(255, 215, 0, 0.6); }
}
```

---

## 4. Phase 3: UI Enhancement - Custom Cards

### 4.1 Card Development Strategy
Create 5+ custom Lovelace cards as web components (vanilla JS/Lit) that embody Sims 2 UI patterns:
- Encapsulate via Shadow DOM
- Use CSS variables from theme for styling
- Expose standard Lovelace configuration options (entity, name, and so on)
- Include optional parameters for Sims 2-specific features

### 4.2 Core Card Specifications

#### 4.2.1 Sims 2 Plumbob Card
- **Purpose**: Display entity state as iconic plumbob diamond
- **Inspiration**: The floating mood diamond above Sims
- **Features**:
  - **Variable-based 3D implementation**: All geometry derived from `--plumbob-size` CSS custom property for perfect scalability
  - **Diamond shape** via CSS `clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
  - **Color mapping**:
    - Green (`#7BC942`): entity.state === 'on' or equivalent (happy/active)
    - Yellow (`#F2C14E`): intermediate states (for example, climate mid-range) (neutral)
    - Red (`#C0392B`): error/off/critical states (unhappy/critical)
    - Blue (`#2F86C5`): idle/default (ghost/blue)
    - Orange: transitional states (for example, warming/cooling)
  - **Animation**: Continuous 3D rotation with configurable duration (default 8s)
  - **Glow effect**: Radial gradient halo that pulses with the plumbob's energy state
  - **Size variants**: XS (30px), SM (50px), MD (78px), LG (100px), XL (150px) configurable via size property
  - **Tooltip**: Shows entity name and current state on hover/tap
  - **Configurable size**: Default 48px but scalable via CSS custom properties
  - **Tap-to-toggle**: For binary entities (lights, switches, and so on)
- **Implementation**:
  ```javascript
  class SimsPlumbobCard extends LitElement {
    static properties = {
      entity: { type: String },
      size: { type: String },
      color: { type: String },
      animationSpeed: { type: String },
      showGlow: { type: Boolean }
    }

    render() {
      const plumbobColor = this.computePlumbobColor(this._state);
      const sizeValue = this.size || '48px';
      const animationSpeed = this.animationSpeed || '8s';
      const showGlow = this.showGlow !== undefined ? this.showGlow : true;

      return html`
        <div
          class="plumbob-container"
          style=${styleMap({
            '--plumbob-size': sizeValue,
            '--plumbob-duration': animationSpeed,
            '--plumbob-glow': showGlow ?
              `radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 50%)` :
              'transparent',
            '--plumbob-face-top': this.getFaceTopColor(plumbobColor),
            '--plumbob-face-bottom': this.getFaceBottomColor(plumbobColor)
          })}
        >
          <div class="plumbob-scene">
            <div class="plumbob-glow"></div>
            <div class="plumbob-body" style=${styleMap({
              '--plumbob-angle': '22deg',
              '--plumbob-perspective': '600px'
            })}>
              <div class="top">
                <div class="front"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="back"></div>
              </div>
              <div class="bottom">
                <div class="front"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="back"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    computePlumbobColor(state) {
      switch(state) {
        case 'on': case 'open': case 'home': return 'green';
        case 'off': case 'closed': case 'not_home': return 'red';
        case 'idle': case 'standby': case 'unknown': return 'blue';
        default: return this.computeGradientColor(state);
      }
    }

    getFaceTopColor(color) { /* map color to top face rgba */ }
    getFaceBottomColor(color) { /* map color to bottom face rgba */ }
  }
  ```

  **CSS Variables Used**:
  ```css
  :host {
    --plumbob-size: 48px;
    --plumbob-duration: 8s;
    --plumbob-angle: 22deg;
    --plumbob-perspective: 600px;
    --plumbob-glow: radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 50%);
    --plumbob-face-top: rgba(0,150,50,0.3);
    --plumbob-face-bottom: rgba(0,150,50,0.4);
  }

  .plumbob-xs { --plumbob-size: 30px; }
  .plumbob-sm { --plumbob-size: 50px; }
  .plumbob-md { --plumbob-size: 78px; }
  .plumbob-lg { --plumbob-size: 100px; }
  .plumbob-xl { --plumbob-size: 150px; }

  .plumbob-slow { --plumbob-duration: 12s; }
  .plumbob-fast { --plumbob-duration: 4s; }
  ```

#### 4.2.2 Sims 2 Panel Card
- **Purpose**: Container card mimicking Sims 2 dialog/info window
- **Inspiration**: Buy Mode catalog windows and info popups
- **Features**:
  - Sky-blue gradient background (matching `--card-background-color`)
  - 2px gold-trim border (`--ha-card-border-color`)
  - 12px border-radius (bubbly corners)
  - Inner gloss overlay (::before pseudo-element)
  - Drop shadow matching Sims 2 window depth
  - Optional title bar with gold underline
  - Content padding matching card spec
- **Implementation**: Extends `ha-card` base with enhanced styling

#### 4.2.3 Sims 2 Gauge Card
- **Purpose**: Circular gauge or capsule bar showing entity value
- **Inspiration**: Need meters (energy, hunger, and so on) and skill bars
- **Features**:
  - **Capsule-style glossy bar implementation**: Based on the Sims 2 UI need meters:
    - Outer border with subtle shadow (`1.5px solid rgba(0,0,0,0.55)`)
    - Inner glossy highlight creating 3D pill appearance
    - Gradient fill from bright to dark based on value
    - Optional divider line at fill edge
    - Configurable glow intensity (none, subtle, medium, strong)
  - **Multiple size variants**:
    - Extra thin (6px height), Thin (10px), Standard (18px), Thick (26px)
  - **Color variants**: Green, yellow-green, yellow, orange, red for different value ranges
  - **Fill gradient**: Linear gradient from bright to dark based on fill percentage
  - **Value display**: Optional numeric value display alongside the bar
  - **Configurable min/max**: For mapping entity values to 0-100% fill
  - **Animated transitions**: Smooth transitions when values change
- **Implementation**:
  ```javascript
  class SimsGaugeCard extends LitElement {
    static properties = {
      entity: {},
      min: { type: Number },
      max: { type: Number },
      size: { type: String },
      showValue: { type: Boolean },
      showDivider: { type: Boolean },
      glowIntensity: { type: String }
    }

    render() {
      const value = this._state || 0;
      const percent = Math.max(0, Math.min(100,
        ((value - this.min) / (this.max - this.min)) * 100
      ));
      let colorClass = 'green';
      if (percent >= 80) colorClass = percent < 30 ? 'red' :
                          percent < 50 ? 'orange' :
                          percent < 70 ? 'yellow' : 'green';
      return html`
        <div class="need-row">
          <div class="need-icon">${this.getIconForDomain(this.entity)}</div>
          <div class="need-bar ${sizeClass} ${glowClass}">
            <div class="need-bar-fill"
                 style="${styleMap({ width: percent + '%', background: this.getGradientForColor(colorClass) })}">
            </div>
          </div>
          ${this.showValue ? html`<span class="label">${Math.round(value)}${this.unit || ''}</span>` : ''}
        </div>
      `;
    }
  }
  ```

  **CSS Variables Used**:
  ```css
  :host {
    --need-bar-height: 18px;
    --need-bar-border: 1.5px solid rgba(0,0,0,0.55);
    --need-bar-shadow: 0 1px 3px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(0,0,0,0.2);
    --need-bar-fill-radius: 9px;
    --need-bar-divider-width: 2px;
    --need-bar-divider-color: rgba(0,0,0,0.6);
    --need-bar-shadow-band: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%);
  }

  .need-bar--xthin { height: 6px; border-radius: 3px; }
  .need-bar--thin { height: 10px; border-radius: 5px; }
  .need-bar--thick { height: 26px; border-radius: 13px; }

  .need-bar--glow-none { box-shadow: 0 1px 3px rgba(0,0,0,0.35); }
  .need-bar--glow-medium { box-shadow: 0 0 6px rgba(90,190,50,0.4), 0 1px 3px rgba(0,0,0,0.35); }
  .need-bar--glow-strong { box-shadow: 0 0 10px rgba(90,190,50,0.6), 0 0 20px rgba(90,190,50,0.25), 0 1px 3px rgba(0,0,0,0.35); }
  ```

#### 4.2.4 Sims 2 Divider Card
- **Purpose**: Decorative horizontal separator with ornate center
- **Inspiration**: Gold divider lines in Sims 2 menus
- **Features**:
  - Horizontal rule with 2px gold-trim thickness
  - Optional central ornament (plumbob, simoleon, and so on)
  - Configurable ornament type and size
  - Height specification (default 24px)
  - Left/right padding controls
- **Implementation**: Flex container with HR and optional icon

#### 4.2.5 Sims 2 Loading Splash Card
- **Purpose**: Full-screen boot screen mimicking "Reticulating Splines"
- **Inspiration**: Sims 2 loading screen with tips
- **Features**:
  - Full-screen overlay (position: fixed)
  - Navy sunburst background matching main app
  - Retro-style "Reticulating Splines" text
  - Rotating plumbob logo (sims2-loading-plum animation)
  - Random tip cycling from predefined list
  - Fade-out transition when main app loads
  - Automatic removal after homeassistant-connected event
- **Implementation**:
  ```javascript
  this._unsubscribe = bus.subscribe('homeassistant-connected', () => {
    this.remove();
  });
  ```

### 4.3 Card Development Process
1. Create base card template with LitElement
2. Implement core rendering logic
3. Add configuration validation
4. Implement CSS variables mapping to theme
5. Add unit tests for core logic (using @web/test-runner)
6. Create demo lovelace views showcasing each card
7. Document configuration options in README
8. Package as ES module for HACS distribution

### 4.4 Card Registration
- Register cards via `customElements.define()` in main.js
- Export as ES module for HACS consumption
- Provide separate builds for modern (ESM) and legacy bundles
- Include source maps for debugging

---

## 5. Phase 4: Sidebar & Built-in Elements

### 5.1 Sidebar Customization
Transform the sidebar to resemble the Sims 2 Buy/Build mode category navigator:

#### 5.1.1 Structural Changes
- **Background**: Deep navy gradient (`--app-drawer-background-color`)
- **Width**: Expanded to 280px (from default 240px) for better readability
- **Item Shape**:
  - Collapsed: 48x48px circles with navy border, cream icon
  - Expanded: Full-width items with 12px left/right padding
- **Typography**:
  - Section headers: Benguiat Gothic, 11px, uppercase, letter-spacing 0.1em, gold color
  - Item labels: Benguiat Gothic, 14px, cream text
- **Hover Effects**:
  - Item background: rgba(232,180,77,0.06) -> rgba(232,180,77,0.12) on hover
  - Active item: Gold left border (3px), bold weight
- **Icons**: Use Sims 2 icon set with theme-aware coloring
- **Badges**: Circular plumbob-green background with navy text for counters

#### 5.1.2 Implementation
- Create sidebar override via `extra_module_url` (sidebar-enhancement.js)
- Modify `ha-sidebar` component using:
  ```javascript
  customElements.whenDefined('ha-sidebar').then(() => {
    const original = HTMLElement.prototype.attachShadow;
    HTMLElement.prototype.attachShadow = function(options) {
      const shadow = original.call(this, options);
      if (this.tagName === 'HA-SIDEBAR') {
        const style = document.createElement('style');
        style.textContent = `/* Sidebar styles */`;
        shadow.prepend(style);
      }
      return shadow;
    };
  });
  ```
- Alternative: Use card-mod to target sidebar shadow DOM

#### 5.1.3 Sidebar CSS Implementation
```css
/* Sims 2 Sidebar Customization */
app-drawer,
ha-sidebar {
  background: linear-gradient(180deg, #1E3D5A 0%, #1A3350 50%, #0E2240 100%) !important;
  border-right: 3px solid var(--sims2-panel-blue-deep, #173A52) !important;
  width: 280px !important;
}

ha-sidebar .link,
ha-sidebar .title a {
  color: var(--sims2-cream-text, #FFF6E0) !important;
  font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
}

ha-sidebar .link:hover {
  background: rgba(232, 180, 77, 0.15) !important;
}

ha-sidebar .link.active {
  color: var(--sims2-panel-blue-deep, #173A52) !important;
  background: linear-gradient(180deg, rgba(232, 180, 77, 0.3), rgba(232, 180, 77, 0.15)) !important;
  border-left: 3px solid #E8B44D !important;
  font-weight: 700 !important;
}

ha-sidebar .nav-section-entities,
[section="navigation"] {
  color: var(--sims2-gold, #FFD700) !important;
  font-size: 11px !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  padding: 8px 16px 4px !important;
}

ha-sidebar .entity-count,
.sidebar-badge {
  background: var(--sims2-plumbob-green, #7BC942) !important;
  color: #0E1628 !important;
  border-radius: 999px !important;
  font-size: 10px !important;
  padding: 1px 6px !important;
  font-weight: 600 !important;
}

ha-sidebar .icon,
.sidebar-item .icon {
  color: var(--sims2-icon-color, #9CCBE6) !important;
}

ha-sidebar [selected] .icon,
.sidebar-item[active] .icon {
  color: var(--sims2-icon-active-color, #7BC942) !important;
}
```

### 5.2 Built-in Menus & Icons Customization

#### 5.2.1 Menu Customization
Target built-in menus (context menus, dialog menus, and so on) to match Sims 2 aesthetics:

**Menu Items**:
- Background: Tinted blue (`rgba(126,200,230,0.25)`)
- Hover: Enhanced tint (`rgba(126,200,230,0.35)`)
- Selected: Plumbob-green background with navy text
- Border: 1px gold-trim when applicable
- Border-radius: 6px (slightly rounded)

**Menu Dividers**:
- 1px solid gold-trim (`--ha-card-border-color`)
- Margin: 4px vertical padding

#### 5.2.2 Built-in Icon Replacement
While we cannot directly replace built-in MDI icons without modifying core, we can:
1. **Provide alternative icons** via our Sims 2 icon set
2. **Guide users** to manually replace icons in Lovelace config using `icon: sims2:icon-name`
3. **Use card-mod** to target specific MDI icons in Shadow DOM and replace with SVG backgrounds

**Implementation Strategy for Icon Replacement**:
```javascript
customElements.whenDefined('ha-svg-icon').then(() => {
  const original = HTMLElement.prototype.attachShadow;
  HTMLElement.prototype.attachShadow = function(options) {
    const shadow = original.call(this, options);
    if (this.tagName === 'HA-SVG-ICON' && this.icon) {
      const iconName = this.icon;
      const sims2Icon = mapToSims2Icon(iconName);
      if (sims2Icon) {
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('viewBox', '0 0 24 24');
        svgElement.innerHTML = getSims2SVG(sims2Icon);
        svgElement.setAttribute('style', `width: 1em; height: 1em; fill: currentColor;`);
        shadow.innerHTML = '';
        shadow.appendChild(svgElement);
      }
    }
    return shadow;
  };
});

function mapToSims2Icon(mdiIcon) {
  const iconMap = {
    'mdi:lightbulb': 'sims2:light-on',
    'mdi:lightbulb-off': 'sims2:light-off',
    'mdi:thermostat': 'sims2:climate',
    'mdi:lock': 'sims2:lock-locked',
    'mdi:lock-open': 'sims2:lock-unlocked',
  };
  return iconMap[mdiIcon] || null;
}
```

#### 5.2.3 Icon Application Guidance
Provide clear documentation for users to manually apply our icons:
```yaml
- type: entity
  entity: light.living_room
  icon: sims2:light-on
  name: Living Room Light

- type: climate
  entity: climate.house
  icon: sims2:climate
```

### 5.3 Additional Built-in Element Customization

#### 5.3.1 Tooltips
- Background: `--sims2-panel-blue-deep` (navy)
- Text: `--sims2-sky-blue` (sky-blue)
- Border: 2px solid gold-trim
- Border-radius: 6px
- Font: Benguiat Gothic

#### 5.3.2 Dialogs & Modals
- Background: Sky-blue gradient with gloss overlay
- Border: 2px solid gold-trim
- Border-radius: 20px
- Title bar: Gold underline
- Buttons: Bubbly rounded with blue/gold gradients
- Overlay: Semi-transparent navy (`rgba(14,22,40,0.9)`)

#### 5.3.3 Notifications & Toasts
- Background: Navy with gold accent
- Text: Sky-blue or cream depending on type
- Border: 2px solid gold-trim
- Border-radius: 8px
- Icons: Use our Sims 2 icon set
- Animations: Slide-up with fade

#### 5.3.4 Form Elements
- **Inputs/Textareas**:
  - Background: Tinted blue (`rgba(126,200,230,0.5)`)
  - Border: 2px solid navy
  - Border-radius: 8px
  - Focus: 3px solid plumbob-green
  - Text: Appropriate contrast color
- **Selects/Dropdowns**: Similar to inputs with dropdown arrow styling
- **Checkboxes/Radios**:
  - Unchecked: Beige-blue background with navy border
  - Checked: Plumbob-green background with navy checkmark/dot
  - Border-radius: 4-6px
- **Sliders**:
  - Track: Brass effect with gold fill
  - Thumb: Round with shadow
  - Active portion: Plumbob-green gradient

#### 5.3.5 Tables & Data Grids
- Header background: Navy gradient with gold text
- Row background: Alternating sky-blue/very-light-sky-blue
- Hover: Enhanced sky-blue with subtle shimmer
- Borders: 1px solid gold-trim between cells
- Text: Appropriate contrast colors

---

## 6. Phase 5: Visual Language - Icon Set

### 6.1 Icon Set Strategy
Create a comprehensive SVG icon set following Material Design Icons specifications but with Sims 2 aesthetic:
- 24x24 viewBox for consistency with MDI
- Stroke-less, fill-based designs where appropriate
- Single-color icons that adapt to `currentColor` (theme-aware)
- Optional dual-tone variants for complex icons
- Comprehensive coverage of Home Assistant domains

### 6.2 Icon Categories & Specifications

#### 6.2.1 Plumbob Icons
- **Plumbob-Green**: Standard active state diamond
- **Plumbob-Yellow**: Neutral/idle state
- **Plumbob-Red**: Error/critical state
- **Plumbob-Spinning**: Animated variant for loading states
- **Plumbob-With-Sim**: Diamond with tiny Sim figure silhouette

#### 6.2.2 Need Icons (Entity State Indicators)
| Need Type | Icon Description | States |
|-----------|------------------|--------|
| Hunger | Apple/core or stomach | Empty (red), Half (yellow), Full (green) |
| Energy | Battery/bolt | Empty (red), Half (yellow), Full (green) |
| Comfort | Couch/chair | Low (red), Medium (yellow), High (green) |
| Fun | Game controller/music note | Bored (red), Engaged (yellow), Ecstatic (green) |
| Social | Two figures/talking bubbles | Isolated (red), mingling (yellow), popular (green) |
| Hygiene | Soap/shower | Dirty (red), neutral (yellow), clean (green) |
| Bladder | Toilet/drop | Full (red), empty (green) |
| Room | Chair/lamp | ugly (red), okay (yellow), nice (green) |

#### 6.2.3 Domain Icons (Entity Domains)
| Domain | Icon Concept | Style Notes |
|--------|--------------|-------------|
| light | Lamp/bulb with Sims 2 style | Filament detail, warm glow |
| switch | Toggle switch | Brass-rimmed, beige-blue background |
| climate | Thermometer/snowflake | Need-meter style gauge |
| lock | Padlock | Metallic with shackle |
| camera | Camera | Retro webcam style |
| speaker | Speaker cone | Sound wave details |
| fan | Fan blades | Visible rotation indication |
| binary_sensor | Dot/circle | Filled for on, outline for off |
| cover | Window blind | Horizontal slats |
| valve | Pipe valve | Turn-wheel handle |
| humidifier | Water drop + mist | Steam particles |
| dehumidifier | Water drop + arrow down | Condensation |
| vent | Air vent | Louvered grating |
| water_heater | Tank + flame/gas | Pilot light indicator |
| menu-button | Three horizontal lines | Sims 2 menu button style |

#### 6.2.4 UI Control Icons
| Icon | Description | Usage |
|------|-------------|-------|
| check | Checkmark | Confirmation, selection |
| close | X | Dismissal, removal |
| play | Triangle | Media playback |
| back | Arrow | Navigation |
| heart | Outline/solid | Favorites, liking |
| settings | Gear | Configuration, options |
| grid | Square grid | Layout views |
| layout | Rectangle + lines | Dashboard arrangement |
| sort | Arrows up/down | List ordering |
| filter | Funnel | Entry filtering |

### 6.3 Icon Set Implementation
1. Design icons in SVG format adhering to 24x24 viewBox
2. Optimize with SVGO (remove metadata, minimize paths)
3. Create TypeScript definitions for icon names
4. Build icon set as ES module exporting named icons
5. Provide CSS helper for size/color variation:
   ```css
   .sims2-icon {
     width: 1.2em;
     height: 1.2em;
     display: inline-block;
   }
   .sims2-icon--plumbob {
     --sims2-icon-color: var(--sims2-plumbob-green);
   }
   ```
6. Register with Home Assistant via:
   ```javascript
   window.customIcons = {
     name: 'sims2',
     icons: {
       'plumbob-green': /* SVG data */,
       // ... all icons
     }
   };
   ```
7. Document usage in Lovelace:
   ```yaml
   icon: sims2:plumbob-green
   ```

### 6.4 Icon Set Distribution
- Include in main.js bundle for automatic availability
- Provide separate CDN build for external usage
- Create preview gallery showing all icons
- Document contribution guidelines for community additions

---

## 7. Phase 6: User Experience - Dashboards & Navigation

### 7.1 Navigation & Sidebar Design
(Already covered in Phase 4 - Sidebar Customization)

### 7.2 Header & Toolbar Design
Transform the top app bar to match Sims 2 main menu:

#### 7.2.1 Visual Specifications
- **Background**: Deep navy gradient (`--app-header-background-color`)
- **Height**: Increased to 64px (from 56px) for better proportions
- **Content Spacing**:
  - Menu button: 48x48px circle (left)
  - Title: Centered, Benguiat Gothic, 20px, cream text, letter-spacing 0.06em
  - Right-aligned items: User avatar, notifications, and so on
- **Title Effects**:
  - Subtle gold shimmer animation (opacity pulse)
  - Optional shadow text for depth
- **Bottom Border**: 3px solid gold-trim (`--ha-card-border-color`)

#### 7.2.2 Implementation
- Target `ha-app-toolbar` or `mdc-top-app-bar` via extra_module_url
- Apply styles through CSS variables and overrides
- Animate title using keyframes defined in theme

#### 7.2.3 Header CSS Implementation
```css
/* Sims 2 Header Customization */
app-header,
ha-app-toolbar,
.mdc-top-app-bar {
  background: linear-gradient(180deg, #2F6B9A 0%, #235E8C 50%, #1A4A70 100%) !important;
  border-bottom: 3px solid var(--sims2-gold-trim, #D8C39A) !important;
  color: var(--sims2-cream-text, #FFF6E0) !important;
  box-shadow: 0 2px 8px rgba(26, 26, 62, 0.2) !important;
  height: 64px !important;
}

app-header .title,
.mdc-top-app-bar__title {
  color: var(--sims2-cream-text, #FFF6E0) !important;
  font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
  font-weight: 700 !important;
}

app-header .menu-button,
.header-menu-btn {
  border-radius: 50% !important;
  width: 48px !important;
  height: 48px !important;
  background: rgba(232, 180, 77, 0.15) !important;
  border: 2px solid var(--sims2-gold-trim, #D8C39A) !important;
}

app-header .menu-button:hover,
.header-menu-btn:hover {
  background: rgba(232, 180, 77, 0.25) !important;
}

app-header .search-input,
.header-search {
  border-radius: 12px !important;
  background: linear-gradient(180deg, rgba(126, 200, 230, 0.35) 0%, rgba(47, 134, 197, 0.30) 100%) !important;
  border: 2px solid var(--sims2-gold-trim, #D8C39A) !important;
  color: var(--sims2-cream-text, #FFF6E0) !important;
}

@keyframes sims2-header-shimmer {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.85; text-shadow: 0 0 8px rgba(255, 215, 0, 0.2); }
}

app-header .title,
.header-toolbar .title,
[part="title"],
ha-menu-button {
  animation: sims2-header-shimmer 4s ease-in-out infinite;
}
```

### 7.3 Dashboard Templates
Create 3-5 showcase dashboards demonstrating the theme's capabilities:

#### 7.3.1 Overview Dashboard ("Home")
- **Layout**:
  - Top: Large plumbob showing overall system health
  - Middle: Grid of category cards (Lights, Climate, and so on)
  - Bottom: Recent events log in Sims 2 panel style
- **Components**:
  - Plumbob entity (aggregated state)
  - Custom cards for each domain in grid
  - History log styled as Sims 2 console
- **Purpose**: Daily glance at home status

#### 7.3.2 Lights Dashboard
- **Layout**:
  - Top: Light mood indicator (average brightness/color)
  - Main: Entities in adjustable grid (2-4 columns)
  - Each light:
    - Large plumbob showing on/off
    - Icon: Sims 2 light bulb
    - Name: Benguiat Gothic
    - Brightness slider (sims2-gauge style)
    - Color picker (if RGB)
- **Styling**:
  - Card backgrounds: sky-blue panels
  - Active lights: plumbob-green accents
  - Grid spacing: 16px

#### 7.3.3 Climate Dashboard
- **Layout**: Vertical stack of climate entities
- **Each card**:
  - Large temperature display (36pt Benguiat Gothic)
  - Humidity indicator (small plumbob)
  - Mode indicator (heat/cool/fan only icons)
  - Fan speed gauge (mini semicircular gauge)
  - Preset buttons (Home, Away, Sleep)

#### 7.3.4 Energy Dashboard
- **Layout**:
  - Top row: Solar production vs consumption gauges
  - Middle: Current power draw as large analog meter
  - Bottom: Hourly consumption bars (mini bar chart)
- **Special Features**: Sun/moon indicator, cost calculation display

#### 7.3.5 Needs Dashboard (Experimental)
- **Layout**:
  - 3x3 grid of need indicators (Hunger, Energy, and so on)
  - Each need: Large plumbob colored by level, numerical value, mini trend sparkline
  - Center: Overall mood plumbob (weighted average)

### 7.4 Dashboard Implementation
1. Create dashboard YAML files in `dashboards/` directory
2. Use Lovelace UI to craft initial designs
3. Export to YAML for distribution
4. Provide automated installation script:
   ```javascript
   async function installDashboards() {
     const dashboards = await loadDashboardDefinitions();
     for (const [id, config] of Object.entries(dashboards)) {
       try {
         await hivemaster.callApi('POST', `/lovelace/api/dashboards/${id}`, {
           config: JSON.stringify(config)
         });
       } catch (err) {
         if (err.status !== 409) throw err;
       }
     }
   }
   ```
5. Include dashboard preview screenshots in documentation

---

## 8. Phase 7: Polish & Integration

### 8.1 Performance Optimization
- **Lazy Loading**:
  - Only load custom cards when used in a view
  - Code-split dashboard definitions
- **CSS Optimization**:
  - Purge unused theme variables in production build
  - Use CSS variables efficiently to minimize repaints
- **Animation Efficiency**:
  - Use `will-change` and `transform`/opacity for GPU acceleration
  - Respect `prefers-reduced-motion` media query
- **Bundle Size**:
  - Target <50KB gzipped for main.js
  - Separate locale files for i18n

### 8.2 Accessibility Enhancements
- **Contrast Ratios**:
  - Ensure all text/background combinations meet WCAG AA
  - Provide high-alt mode toggle in theme (optional)
- **Focus Management**:
  - Visible focus outlines (plumbob-green)
  - Logical tab order in custom cards
- **Screen Reader Support**:
  - ARIA labels on interactive elements
  - Live regions for dynamic updates
- **Touch Targets**:
  - Minimum 48x48px for interactive elements

### 8.3 Error Handling & Fallbacks
- **Missing Dependencies**:
  - Graceful degradation if card-mod not installed
  - Fallback to standard cards if custom cards fail to load
- **Theme Conflicts**:
  - Namespace all custom variables with `--sims2-`
  - Provide reset mechanism to default theme
- **Browser Compatibility**:
  - Target modern browsers (Chrome/Firefox/Safari Edge)
  - Provide Babel transpiled bundle for legacy support
  - Use feature detection for CSS variables

### 8.4 Configuration Options
Expose user-customizable aspects via Lovelace card configuration:
```yaml
- type: custom:sims2-plumbob-entity
  entity: sensor.temperature
  name: Living Room Temp
  size: 64
  show_label: true
  pulse_active: true
  tap_action:
    action: toggle
```

Global configuration options:
- Animation speed (slow/normal/fast)
- Glass effect intensity
- Sunburst visibility
- Icon set preference (full/minimal)
- Accessibility mode (high contrast, reduced motion)

### 8.5 Installation Flow
1. User installs via HACS
2. Integration automatically:
   - Registers lovelace resource: `/hacsfiles/sims2ha/sims2-bundle.js`
   - Applies default theme (prompt to set as default)
   - Creates starter dashboards (optional)
   - Shows configuration notification
3. User can customize via:
   - Theme selection in UI
   - Lovelace card configuration
   - Dashboard editing

---

## 9. Phase 8: Documentation & Release

### 9.1 Documentation Suite
Create comprehensive documentation:

#### 9.1.1 Installation Guide
- HACS installation method
- Manual installation instructions
- Post-installation steps
- Troubleshooting common issues

#### 9.1.2 Customization Guide
- Theme modification instructions
- Custom card configuration options
- Dashboard creation tips
- Icon usage guide

#### 9.1.3 Developer Guide
- API reference for custom cards
- Extension points for third-party developers
- Contribution guidelines
- Build and release process

#### 9.1.4 Reference Materials
- Complete color palette reference
- Animation specifications and timing
- Typography guidelines
- Icon catalog with meanings
- Sample dashboard layouts

### 9.2 Quality Assurance
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Accessibility auditing (axe-core, Lighthouse)
- Performance testing (Lighthouse, WebPageTest)
- Regression testing against HA core updates
- Screenshot comparison against Sims 2 reference images
- Verify with popular HACS plugins (card-mod, browser-mod)

### 9.3 Release Process
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog generation (KeepACHANGELOG format)
- Automated build and packaging
- HACS submission preparation
- Release announcement templates

### 9.4 Post-Launch Support
- Issue tracking and response process
- Feature request evaluation
- Community contribution management
- Regular update schedule (quarterly)

---

## 10. Technical Specifications

### 10.1 Color Palette
**Primary Colors (Light/Dark Mode)**:
- Navy Base: `#0E1628` / `#080D18`
- Sky Blue: `#7EC8E6` / `#4A7A94`
- Panel Blue: `#2F86C5` / `#9CCBE6`
- Header Blue: `#235E8C` / `#1B3A52`
- Panel Navy: `#1A3350` / `#0F2035`
- Gold Trim: `#D8C39A` / `#C29A3C`
- Plumbob Green: `#7BC942` (both modes)
- Espresso: `#4A3320` / `#FFF6E0`
- Cream Text: `#FFF6E0` (both modes)

**Secondary Colors**:
- Error: `#C0392B`
- Warning: `#E09A2B`
- Success: `#5BA82C`
- Info: `#2F86C5`
- Disabled Text: `#6B8299` / `#6B6280`

### 10.2 Animation Specifications
| Animation | Duration | Easing | Key Properties |
|-----------|----------|--------|----------------|
| Plumbob Pulse | 3s | ease-in-out | filter: drop-shadow(0 0 2-8px) |
| Button Hover | 0.3s | ease | transform: translateY(-1px), box-shadow |
| Card Entrance | 0.4s | ease | opacity: 0->1, translateY(12px->0) |
| Sidebar Shimmer | 0.6s | ease | background-position: -200%->200% |
| Dialog Entrance | 0.25s | cubic-bezier(0.2,0,0,1) | opacity: 0->1, scale(0.97->1) |
| Loading Plumbob | 3s | ease-in-out | rotate(0->360deg), scale(1->1.1->1) |
| Tab Indicator | 0.25s | ease | transform: scaleX(0->1) |
| Header Shimmer | 4s | ease-in-out | opacity: 1->0.85, text-shadow |

### 10.3 Typography Specifications
| Element | Font Family | Size | Weight | Letter Spacing | Text Transform |
|---------|-------------|------|--------|----------------|----------------|
| Display Titles | Benguiat Gothic | 18-24px | 600-700 | 0.04-0.06em | uppercase |
| Body Text | Benguiat Gothic | 14-16px | 400 | 0.005-0.01em | none |
| Labels/Captions | Benguiat Gothic | 11-12px | 600 | 0.08-0.1em | uppercase |
| Numbers/Data | Benguiat Gothic | 12-14px | 600 | 0.02-0.04em | none |
| UI Controls | System UI | 14px | 400 | 0 | none |

### 10.4 Project Structure
```
sims2ha/
├── README.md
├── __init__.py
├── manifest.json
├── tasks/
│   ├── __init__.py
│   └── setup.py
├── custom_components/
│   └── sims2ha/
│       ├── __init__.py
│       ├── manifest.json
│       ├── services.yaml
│       ├── config_flow.py
│       ├── lovelace/
│       │   ├── cards/
│       │   │   ├── sims2-plumbob-card.js
│       │   │   ├── sims2-panel-card.js
│       │   │   ├── sims2-gauge-card.js
│       │   │   ├── sims2-divider-card.js
│       │   │   └── sims2-loading-card.js
│       │   ├── editors/
│       │   └── headers/
│       │       └── sims2-header.js
│       ├── dashboards/
│       │   ├── overview.yaml
│       │   ├── lights.yaml
│       │   ├── climate.yaml
│       │   └── energy.yaml
│       ├── icons/
│       │   ├── sims2-icons.js
│       │   └── svg/
│       ├── themes/
│       │   └── sims2-theme.yaml
│       ├── translations/
│       │   └── en.json
│       ├── src/
│       │   ├── sidebar-enhancement.js
│       │   ├── header-enhancement.js
│       │   ├── loading-enhancement.js
│       │   └── menu-enhancement.js
│       └── websocket_api.py
├── resources/
│   ├── screenshots/
│   └── reference/
├── tests/
│   ├── unit/
│   │   └── card.test.js
│   └── integration/
└── www/
    └── symlink to custom_components/sims2ha/
```

### 10.5 Build System
- **Source**: ES2020 JavaScript (ES modules)
- **Transpilation**: Babel preset-env for IE11 compatibility (optional)
- **Bundling**: Rollup for production builds
- **Linting**: ESLint with Airbnb base + plugin lit
- **Formatting**: Prettier
- **Testing**:
  - Unit: @web/test-runner + chai
  - Visual: Percy.io or manual review
  - End-to-end: Playwright tests

### 10.6 Dependencies
- **Runtime** (automatically installed/configured):
  - Home Assistant Core 2023.12.0+
  - Lit 2.x (for web components)
  - card-mod: ^3.0.0
  - browser-mod: ^4.0.0
- **Development** (automatically installed/configured):
  - rollup, babel, eslint, prettier
  - @web/test-runner, chai
  - sass (for theme preprocessing)

### 10.7 Configuration Schema
Defined in `config_flow.py` for options flow:
```python
DATA_SCHEMA = vol.Schema({
    vol.Optional("theme_mode", default="auto"): vol.In(["auto", "light", "dark"]),
    vol.Optional("enable_animations", default=True): bool,
    vol.Optional("sidebar_width", default=280): vol.All(vol.Coerce(int), vol.Range(min=200, max=350)),
    vol.Optional("dashboard_install", default=True): bool,
    vol.Optional("icon_set_version", default="1.0"): str,
})
```

### 10.8 Extension Points
- **Services**:
  - `sims2ha.reload_theme`: Force theme reload
  - `sims2ha.toggle_animations`: Enable/disable animations
  - `sims2ha.set_sidebar_width`: Adjust sidebar width
- **Entity Attributes** (for advanced integration):
  - `sims2ha_mood`: 0-100 value for overall home "mood"
  - `sims2ha_active_needs`: List of currently deficient needs

---

## 11. Risk Assessment & Mitigation

### 11.1 Technical Risks
| Risk | Mitigation |
|------|------------|
| HA Core updates breaking CSS selectors | Use semantic selectors, monitor breaking changes, provide update scripts |
| Theme variable changes in HA Core | Track @HOMEASSISTANT/frontend releases, update mapping proactively |
| Performance issues on low-end devices | Provide performance mode, lazy loading, reduce animations |
| Accessibility compliance gaps | Regular audits, contrast testing, alternative modes |
| Bundle size exceeding limits | Code splitting, tree shaking, asset optimization |

### 11.2 User Experience Risks
| Risk | Mitigation |
|------|------------|
| Over-theming reducing usability | Follow existing UX patterns, user testing, optional modes |
| Color confusion for colorblind users | Provide alternative modes, pattern-based indicators |
| Icon recognition issues | Include tooltips, maintain semantic meanings |
| Animation discomfort | Respect prefers-reduced-motion, provide disable option |

### 11.3 Mitigation Strategies
1. **Modular Design**: Separate concerns (theme, cards, enhancements) for easier updates
2. **Feature Flags**: Allow disabling specific enhancements
3. **Comprehensive Testing**: Automated visual regression testing
4. **User Configuration**: Extensive options for personalization
5. **Documentation**: Clear guidance on customization and troubleshooting
6. **Community Feedback**: Beta testing program with diverse user base

### 11.4 Future-Proofing
- Use semantic versioning aligned with HA Core releases
- Maintain backward compatibility within major versions
- Monitor HA frontend roadmap for upcoming changes
- Provide migration guides between versions
- Consider optional TypeScript definitions for developers

---

## 12. Appendix: Reference Assets

### A.1 Color Palette Reference
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Sims Navy Base | #0E1628 | 14,22,40 | Main app background |
| Sims Sky Blue | #7EC8E6 | 126,200,230 | Card surfaces, dialogs |
| Sims Panel Blue | #2F86C5 | 47,134,197 | Primary actions, links |
| Sims Header Blue | #235E8C | 35,94,140 | App header background |
| Sims Panel Navy | #1A3350 | 26,51,80 | Sidebar background |
| Sims Gold Trim | #D8C39A | 216,195,154 | Borders, dividers, accents |
| Sims Plumbob Green | #7BC942 | 123,201,66 | Active/on states |
| Sims Espresso | #4A3320 | 74,51,32 | Text on light surfaces |
| Sims Cream Text | #FFF6E0 | 255,246,224 | Text on dark surfaces |

### A.2 Animation Specifications
| Animation | Duration | Easing | Key Properties |
|-----------|----------|--------|----------------|
| Plumbob Pulse | 3s | ease-in-out | filter: drop-shadow(0 0 2px -> 8px) |
| Button Hover | 0.3s | ease | transform: translateY(-1px), box-shadow |
| Card Entrance | 0.4s | ease | opacity: 0->1, translateY(12px->0) |
| Sidebar Shimmer | 0.6s | ease | background-position: -200%->200% |
| Dialog Entrance | 0.25s | cubic-bezier(0.2,0,0,1) | opacity: 0->1, scale(0.97->1) |
| Loading Plumbob | 3s | ease-in-out | rotate(0->360deg), scale(1->1.1->1) |
| Tab Indicator | 0.25s | ease | transform: scaleX(0->1) |

### A.3 Typography Specifications
| Element | Font Family | Size | Weight | Letter Spacing | Text Transform |
|---------|-------------|------|--------|----------------|----------------|
| Display Titles | Benguiat Gothic | 18-24px | 600-700 | 0.04-0.06em | uppercase |
| Body Text | Benguiat Gothic | 14-16px | 400 | 0.005-0.01em | none |
| Labels/Captions | Benguiat Gothic | 11-12px | 600 | 0.08-0.1em | uppercase |
| Numbers/Data | Benguiat Gothic | 12-14px | 600 | 0.02-0.04em | none |
| UI Controls | System UI | 14px | 400 | 0 | none |

### A.4 Icon Naming Convention
- **Format**: `sims2:[category]-[specific][-state]`
- **Examples**:
  - `sims2:plumbob-green`
  - `sims2:need-hungry-full`
  - `sims2:domain-light-on`
  - `sims2:ui-settings`
  - `sims2:ui-back`
- **Categories**: plumbob, need, domain, ui, furniture, room, mode
- **States**: active, inactive, alert (where applicable)

### A.5 Reference Images
Store in `/docs/reference/`:
- `sims2-livemode-reference.png`: Official Sims 2 Live Mode screenshot
- `sims2-buymode-reference.png`: Buy Mode interface
- `sims2-need-meter-reference.png`: Close-up of need meters
- `sims2-plumbob-reference.png`: Plumbob in various states
- `sims2-button-reference.png`: Button states (normal/hover/pressed)
- `sims2-card-reference.png`: Info window/dialog example

---

## 13. Phase 9: Built-in Card Type Coverage

Every Home Assistant built-in card type (catalogued in HA_THEMING_CAPABILITIES.md §4.1) must render with Sims 2 aesthetics. While the theme CSS variables handle base colors, card-specific overrides are needed for card types that use non-standard shadow-DOM structures or have distinct visual patterns (gauges, maps, media players, and so on).

### 13.1 Card Type Coverage Matrix

| Card Type | Coverage Method | Status |
|---|---|---|
| `entities` | Global `ha-card` + entity-row overrides in `sims2-overrides.css` | done |
| `glance` | Inherits ha-card styling | covered by ha-card |
| `picture-entity` | ha-card + image border overrides | done in CSS |
| `markdown` | ha-card + font-family from theme | covered by ha-card |
| `weather-forecast` | ha-card + state colors | partly (needs forecast-specific overrides) |
| `history-graph` | ha-card + `--color-*` palette | **missing** (chart colors) |
| `statistic` | ha-card + gauge overrides | done in CSS |
| `logbook` | ha-card + logbook CSS | done in CSS |
| `alarm-panel` | ha-card + button overrides | covered by button CSS |
| `gauge` | ha-card + pill-shaped fill CSS | done in CSS |
| `clock` | ha-card + font inherit | covered |
| `map` | ha-card + map CSS | done in CSS |
| `calendar` | ha-card + font inherit | done in CSS |
| `plant-status` | ha-card + state colors | covered |
| `shopping-list` | ha-card + checkbox overrides | covered |
| `todo-list` | ha-card + list item CSS | covered |
| `media-control` | ha-card + media player CSS | done in CSS |
| `camera` | ha-card + border overrides | covered |
| `climate` | ha-card + slider/button CSS | covered |
| `light` | ha-card + color control CSS | done in CSS |
| `switch` | ha-card + toggle CSS | covered |
| `humidifier` | ha-card + slider CSS | covered |
| `cover` | ha-card + button/slider CSS | covered |
| `valve` | ha-card + button CSS | covered |
| `water-heater` | ha-card + climate-like controls | covered |
| `vent` | ha-card + fan-like controls | covered |
| `dehumidifier` | ha-card + humidifier-like | covered |
| `update` | ha-card + button CSS | covered |
| `script` | ha-card + button CSS | covered |
| `scene` | ha-card + button CSS | covered |
| `select` | ha-card + input CSS | covered |
| `number` | ha-card + input CSS | covered |
| `entity-filter` | Inherits from filtered card type | covered by child types |
| `conditional` | Inherits from displayed cards | covered by child types |
| `button` | ha-card + button CSS | done in CSS |
| `energy` | ha-card + energy colors | **missing** (needs energy palette) |

### 13.2 Card-Specific CSS Gaps

| Card | What's Missing | Implementation |
|---|---|---|
| **weather-forecast** | Forecast icon tint, temperature text color | Add `.weather-forecast` selectors to `sims2-overrides.css` using sims2 state colors (`--state-weather-*`) |
| **history-graph** | Chart line colors not themed | Map `--color-1` through `--color-54` in theme YAML to Sims 2 palette (blues: `#2F86C5`, greens: `#7BC942`, golds: `#D8C39A`, warm greys) |
| **gauge** | Card-mod needed for gauge arc colors | Document `card_mod: style: ha-gauge: { $: { '--gauge-color': 'var(--sims2-plumbob-green)' } }` |
| **energy** | Chart color variables not set | Add `--energy-*` variables to theme YAML (see section 2.3) |
| **alarm-panel** | Number pad styling | Add `.alarm-number-pad` selectors for bubbly rounded keypad buttons |

---

## 14. Phase 10: Panel Integrations & Sidebar Panels

Home Assistant supports `panel_iframe`, `panel_custom`, and built-in configuration panels that must all render with Sims 2 aesthetics.

### 14.1 Panel Coverage

| Panel | Coverage Method | Status |
|---|---|---|
| **Config panel** (`ha-panel-config`) | CSS overrides in `sims2-overrides.css` | done (lines 752-820) |
| **Logbook panel** | CSS override via `[panel="logbook"]` | done |
| **History panel** | CSS override via `[panel="history"]` | done |
| **States panel** | CSS override via `[panel="states"]` | done |
| **Developer tools panel** | CSS override via `[panel="developer-tools"]` | done |
| **Supervisor / Hass.io** | CSS override `ha-panel-supervisor` | done in CSS |
| **Energy dashboard** | CSS override + energy color vars | **missing** (energy colors need to be in theme YAML) |
| **Map panel** | CSS override via `[panel="map"]` | covered by map card CSS |
| **Media browser** | CSS override `ha-media-player-browse` | done in CSS |
| **Calendar panel** | CSS override `ha-calendar` | done in CSS |
| **`panel_iframe` panels** | Embedded content | Cannot theme external content; provide border/frame styling only |
| **`panel_custom` panels** | Custom panel integrations | Document in developer guide to use `--sims2-*` CSS variables |

### 14.2 Panel Implementation Plan

1. Add **energy dashboard color palette** to `sims2.yaml` (variables listed in section 2.3).
2. Add **calendar panel overrides** for date picker and event cards (bubbly rounded borders, gold accents).
3. Add **media browser overrides** for browse views and list items (navy background, cream text).
4. Document **panel_iframe border/frame styling** for embedded content (gold border, sky-blue background).

---

## 15. Phase 11: User Profile & Avatar

### 15.1 User Badge Theming

The user badge (`<ha-user-badge>`) is a 40x40px circular avatar in the sidebar. It renders in light DOM but uses CSS variables for theming.

| Variable | Status | Sims 2 Value |
|---|---|---|
| `--light-primary-color` | done | `#9CCBE6` / `#17304C` |
| `--text-light-primary-color` | done | `#FFF6E0` / `#EAF4FF` |
| `--ha-border-radius-circle` | **missing** | `50%` (ensure it stays circular) |
| Card-mod for profile picture border | **missing** | Add gold border `ha-user-badge img { border: 2px solid #E8B44D }` |

### 15.2 Profile Picture Fallback

The default user badge falls back to initials on a `--light-primary-color` background. Our theme adequately styles this. For enhanced theming:

1. **Add card-mod style** in docs for users who want a glow effect on their avatar:
   ```yaml
   card_mod:
     style:
       ha-user-badge:
         $:
           ha-user-badge img:
             box-shadow: 0 0 8px rgba(123, 201, 66, 0.4)
   ```
2. **Document** how to set a person entity picture for a custom Sims 2 Sim avatar.

---

## 16. Phase 12: Built-in Button Shape Coverage

### 16.1 Button Shape Matrix

| Component | Shape Control | Status | Sims 2 Shape |
|---|---|---|---|
| `<ha-list-item-button>` | `--ha-border-radius-sm` | **missing** | 8px rounded (bubbly) |
| `<mwc-button>` / `<ha-button>` | CSS override | done | 12px rounded |
| `<md-filled-button>` | CSS override | done | 12px rounded |
| `<ha-icon-button>` | CSS override | done | 50% circular |
| `<ha-chip>` | CSS override | done | 999px pill |
| `<ha-tab>` | CSS override | done | flat with gold indicator |
| `<ha-switch>` / `<md-switch>` | `--ha-switch-bar-radius`, `--ha-switch-button-radius` | **missing** | 999px pill track, 50% thumb |

### 16.2 Implementation

1. Add border radius scale to theme YAML:
   ```yaml
   ha-border-radius-xs: "4px"
   ha-border-radius-sm: "8px"
   ha-border-radius-md: "12px"
   ha-border-radius-lg: "16px"
   ha-border-radius-xl: "20px"
   ha-border-radius-circle: "50%"
   ```
2. Ensure `--ha-switch-bar-radius` and `--ha-switch-button-radius` are set to `"999px"` in theme YAML.

---

## 17. Phase 13: Frontend Integration Configuration

### 17.1 Extra Module URL Strategy

The `frontend:` integration in `configuration.yaml` supports loading custom JavaScript modules that apply before the main app renders. We use this for:

| Resource | Path | Purpose |
|---|---|---|
| `extra_module_url` (ESM) | `/hacsfiles/sims2ha/sims2-bundle.js` | Main bundle: custom cards, icon set, sidebar/header/menu enhancements |
| CSS resource (via Lovelace) | `/hacsfiles/sims2ha/css/sims2-theme.css` | Additional CSS overrides beyond theme YAML |

### 17.2 Implementation Plan

1. **Register the bundle** via Lovelace resource in `__init__.py`:
   ```python
   async def async_register_resource(hass):
       hass.data[DOMAIN]["resources"] = [
           {
               "url": f"/hacsfiles/sims2ha/sims2-bundle.js?{version}",
               "type": "module",
           }
       ]
   ```
2. **Ensure CSS-only fallback** works without JS (theme YAML handles base styling, CSS resource handles advanced overrides).
3. **Support `development_repo` path** for custom frontend development.

### 17.3 Development Repository

For advanced users who want to build a custom frontend:
```yaml
frontend:
  development_repo: /path/to/sims2ha/fork
```
Document how to fork HA frontend, merge Sims 2 changes, and build.

---

## 18. Phase 14: WebSocket & JavaScript Integration

### 18.1 Real-Time Service Integration

| Service | Implementation | Purpose |
|---|---|---|
| `frontend.set_theme` | Called on integration setup | Apply Sims 2 theme on install |
| `frontend.reload_themes` | Called after theme update | Refresh theme variables |
| `lovelace.reload` | Called after dashboard install | Refresh Lovelace config |
| `frontend.update_theme` | Called for runtime tweaks | Update specific CSS vars at runtime |

### 18.2 Custom WebSocket Commands

Consider implementing custom WebSocket commands for advanced Sims 2 features:
- `sims2ha/set_mood` — Set the "household mood" from the backend
- `sims2ha/get_icon_set` — Toggle between icon variants

### 18.3 Browser Mod Integration

Browser Mod (`hass-browser_mod`) is an optional dependency that unlocks:
- **Popup replacements**: Replace more-info dialogs with Sims 2 styled panels
- **CSS injection**: Inject runtime CSS per-browser for advanced overrides
- **JavaScript execution**: Run custom JS for animations or DOM manipulation
- **Theme setting per browser**: Per-device theme selection
- **Keyboard shortcuts**: Map Sims 2 hotkeys

| Browser Mod Service | Use Case | Implementation |
|---|---|---|
| `browser_mod.popup` | Show Sims 2 dialog for entity details | Wrapper in bundle.js |
| `browser_mod.set_theme` | Set sims2 theme per browser | Auto-set on install |
| `browser_mod.js` | Inject animations not possible via CSS | For 3D plumbob rotation |
| `browser_mod.navigate` | Navigate to themed dashboards | Dashboard quick-switch |

---

## 19. Phase 15: Static Resource Serving

### 19.1 Resource Types

The integration serves these static files:

| Resource Type | Path | Purpose |
|---|---|---|
| CSS | `frontend/css/sims2-theme.css` | Theme CSS overrides |
| CSS | `frontend/css/sims2-plumbob.css` | Plumbob shape CSS (shared base) |
| JS Bundle | `frontend/sims2-bundle.js` | Custom cards, icon set, enhancements |
| Fonts | `frontend/fonts/` | Self-hosted Benguiat Gothic (base64 in `sims2-fonts.css`) |
| Icons | `frontend/icons/` | SVG icon set for sims2: prefix |
| Images | `frontend/images/` | Background images, splash assets |
| Sound | `frontend/sounds/` | Optional Sims 2 sound effects (Buy Mode click, page turn) |

### 19.2 Font Serving Strategy

1. **Self-hosted font** (preferred): Benguiat Gothic is embedded as a base64 `@font-face` directly in `sims2-fonts.css`, so it ships inside the bundle with no separate file fetch and no external dependency. No other font is bundled or fetched.
2. **System font fallback**: If the web font fails to load, fall back to `system-ui, sans-serif`.

### 19.3 Implementation

```python
# websocket_api.py
@websocket_require_admin
@hass.service.register(DOMAIN, "register_resources")
async def register_resources(call):
    """Register frontend resources."""
    resources = [
        {
            "url": f"/{DOMAIN}/static/frontend/sims2-bundle.js?{VERSION}",
            "type": "module",
        },
        {
            "url": f"/{DOMAIN}/static/frontend/css/sims2-theme.css?{VERSION}",
            "type": "css",
        },
    ]
    # Register with Lovelace
    for resource in resources:
        await hass.services.async_call(
            "lovelace", "add_resource", resource, blocking=True
        )
```

---

## 20. Success Criteria Verification

### 20.1 Theme Variable Coverage Audit

Run this check before each release to ensure no regressions:

```python
# scripts/audit_theme_variables.py
"""Parse HA_THEMING_CAPABILITIES.md and verify every variable exists in sims2.yaml."""

import re
import yaml

def audit():
    with open("docs/HA_THEMING_CAPABILITIES.md") as f:
        doc = f.read()
    
    with open("custom_components/sims2ha/themes/sims2.yaml") as f:
        theme = yaml.safe_load(f)
    
    # Extract all CSS variable names from the doc
    variables = set(re.findall(r'--[\w-]+', doc))
    
    # Flatten theme variables
    themed = set()
    for mode in ["sims2-light", "sims2-dark"]:
        if mode in theme:
            themed.update(theme[mode].keys())
    
    # For sims2 (modes-based), collect both light and dark
    if "sims2" in theme:
        modes = theme["sims2"].get("modes", {})
        for mode_name, vars in modes.items():
            themed.update(vars.keys())
    
    missing = variables - themed
    
    print(f"Total HA variables documented: {len(variables)}")
    print(f"Variables themed: {len(themed)}")
    print(f"Missing: {len(missing)}")
    if missing:
        for v in sorted(missing):
            print(f"  MISSING: {v}")
    
    return len(missing) == 0

if __name__ == "__main__":
    audit()
```

### 20.2 Coverage Checklist

| Category | Total Vars | Themed | Type |
|---|---|---|---|
| Core interface colors | ~15 | 15 | YAML |
| State/domain colors | ~30+ | 7 | **GAP** — needs ~25+ more |
| Energy colors | 8 | 0 | **GAP** — all missing |
| Typography scale | ~15 | 0 | **GAP** — all missing |
| Shadow/elevation | ~5 | 1 | **GAP** — ~4 missing |
| Border radius scale | 6 | 1 | **GAP** — ~5 missing |
| Animation timing | 4 | 0 | **GAP** — all missing |
| Graph/calendar palette | 54 | 0 | **GAP** — all missing |
| RGB variants | 10 | 1 | **GAP** — ~9 missing |
| Scrollbar | 1 | 0 | **GAP** — missing |
| Input states | ~8 | 4 | **GAP** — ~4 missing |
| Card types (built-in) | 50+ | 50+ | **DONE** (via ha-card base) |
| Custom cards | 5 | 5 | **DONE** (planned) |
| Login screen | 1 | 1 | **DONE** (CSS template) |
| Loading screen | 2 | 2 | **DONE** (CSS enhancements) |
| Sidebar | 10 | 10 | **DONE** (YAML + CSS) |
| User badge | 3 | 2 | **GAP** — needs `--ha-border-radius-circle` |
| Button shapes | 8 | 6 | **GAP** — needs `--ha-switch-*` radius vars + `--ha-border-radius-sm` |
| Config panels | 12+ | 12+ | **DONE** (CSS overrides) |
| More-info dialogs | 3 | 3 | **DONE** (CSS overrides) |
| Notifications/toasts | 3 | 3 | **DONE** (CSS overrides) |
| Form elements | 10 | 10 | **DONE** (CSS overrides) |
| Data tables | 5 | 5 | **DONE** (CSS overrides) |
| **TOTAL** | **~280** | **~195** | **~85 missing (~30% gap)** |

### 20.3 Implementation Priority for Gaps

| Priority | Gap | Effort | Impact |
|---|---|---|---|
| P0 | State/domain colors (~25 vars) | Low (1 hour) | High — entity states render wrong color |
| P0 | Energy palette (8 vars) | Low (30 min) | High — energy dashboard broken |
| P0 | Animation/resize variables | Low (30 min) | High — motion timing off |
| P1 | Border radius scale | Low (15 min) | Medium — shapes less consistent |
| P1 | Input state colors | Low (15 min) | Medium — form interaction feedback |
| P1 | Typography scale | Low (30 min) | Medium — font sizes may not match |
| P2 | RGB variants | Medium (1 hour) | Medium — rgba() overlays need accurate values |
| P2 | Shadow/elevation scale | Low (30 min) | Low — subtle visual depth |
| P2 | Scrollbar color | Low (5 min) | Low — minor visual polish |
| P2 | Graph color palette (54 vars) | Medium (2 hours) | Low — charts use defaults that pass contrast |
| P2 | Switch radius vars | Low (5 min) | Low — already overridden in CSS |

---

## Conclusion

This comprehensive plan provides a complete roadmap for transforming Home Assistant into a faithful Sims 2-themed experience while maintaining full functionality, accessibility, and compatibility with official Home Assistant extension points.

The plan addresses all requested customizations:
- ✅ **Login screen** theming via reverse proxy guidance and CSS templates
- ✅ **Loading screens** (pre and post-authentication) with Sims 2 animations
- ✅ **Sidebar** complete transformation to Sims 2 Buy/Mode navigator
- ✅ **Built-in menus and icons** customization strategies
- ✅ **Custom cards** implementing signature Sims 2 UI elements
- ✅ **Complete icon set** for consistent visual language
- ✅ **Showcase dashboards** demonstrating the theme's capabilities
- ✅ **Polish and integration** for performance, accessibility, and quality

By following this plan, users will be able to install the Sims 2 theme for Home Assistant and enjoy a nostalgic, playful interface that captures the essence of the classic game while providing full home automation functionality.

---

*For implementation questions, refer to the detailed phase documentation.*
