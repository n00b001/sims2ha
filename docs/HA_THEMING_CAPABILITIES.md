# Home Assistant Theming and Customization Capabilities

This document catalogs every aspect of Home Assistant that can be themed, modified, or overridden through official channels: themes (YAML), integrations (frontend configuration), HACS (Home Assistant Community Store) plugins, and Lovelace resources.

## 1. Theme System (YAML-based)

Home Assistant's theme system allows defining custom themes that override CSS variables. Themes are defined in `configuration.yaml` or separate YAML files.

### 1.1 Supported Theme Variables

Home Assistant exposes CSS custom properties that a theme can override. The
Sims 2 theme (`themes/sims2.yaml`) overrides the full set below for both
light and dark modes; coverage is verified by
`scripts/audit_theme_variables.py`. Representative core variables:

| Variable                                                              | Purpose                        |
| --------------------------------------------------------------------- | ------------------------------ |
| `--primary-color`, `--accent-color`                                   | Brand actions / accents        |
| `--dark-primary-color`, `--light-primary-color`                       | Primary variants               |
| `--primary-background-color`                                          | App background                 |
| `--secondary-background-color`                                        | Secondary surfaces             |
| `--card-background-color`, `--ha-card-background`                     | Card / panel surfaces          |
| `--primary-text-color`, `--secondary-text-color`                      | Body text                      |
| `--text-primary-color`, `--disabled-text-color`                       | Text on colour / muted         |
| `--divider-color`, `--ha-card-border-color`                           | Dividers and rims              |
| `--sidebar-background-color`, `--sidebar-selected-text-color`         | Sidebar                        |
| `--app-header-background-color`, `--app-header-text-color`            | App header                     |
| `--state-active-color`, `--state-inactive-color`                      | Generic state                  |
| `--state-{domain}-{state}-color`                                      | Per-domain / per-state colours |
| `--switch-checked-color`, `--slider-color`, `--slider-track-color`    | Controls                       |
| `--label-badge-{color}-background-color`                              | Badges                         |
| `--error-color`, `--warning-color`, `--success-color`, `--info-color` | Feedback                       |
| `--rgb-primary-color`, `--rgb-accent-color`, ...                      | RGB variants for `rgba()`      |
| `--energy-grid-consumption-color`, `--energy-solar-color`, ...        | Energy dashboard               |
| `--color-1` through `--color-54`                                      | Graph / calendar palette       |

### 1.2 Spacing Variables

HA exposes a spacing scale via `--ha-space-*` variables:

- `--ha-space-0` through `--ha-space-12` (0px to 48px in 4px increments)
- Used for padding, margin, gap in components
- Can be overridden in themes to adjust global spacing

### 1.3 Typography Variables

HA exposes typography via:

- `--ha-font-family` - Base font family (inherits through Shadow DOM)
- `--ha-font-size-*` - Font size scale (e.g., `--ha-font-size-sm`, `--ha-font-size-lg`)
- `--ha-font-weight-*` - Font weight scale (e.g., `--ha-font-weight-light`, `--ha-font-weight-bold`)
- `--ha-line-height-*` - Line height scale
- `--ha-letter-spacing-*` - Letter spacing adjustments

### 1.4 Shadow and Elevation Variables

HA exposes shadow depth via:

- `--ha-box-shadow-*` - Different elevation levels (e.g., `--ha-box-shadow-security-card`, `--ha-box-shadow-dialog`)
- Specific component shadows: `--ha-card-box-shadow`, `--ha-menu-box-shadow`

### 1.5 Border Radius Variables

HA exposes border radius via:

- `--ha-border-radius-*` - Radius scale (e.g., `--ha-border-radius-xs`, `--ha-border-radius-lg`)
- Specific component radii: `--ha-card-border-radius`, `--ha-sidebar-expanded-item-width` (width, not radius)
- `--ha-border-radius-circle` - Used for circular avatars and badges

### 1.6 Transition and Animation Variables

HA exposes motion design via:

- `--ha-animation-duration-*` - Duration scale (e.g., `--ha-animation-duration-short`)
- `--ha-animation-timing-function` - Easing function (cubic-bezier values)
- Specific component transitions can be overridden via these variables

### 1.7 Miscellaneous Theme Variables

Other themeable properties include:

- `--ha-scale-direction` - RTL/LTR flip scale
- Various component-specific variables like `--ha-card-header-font-size`, `--ha-slider-knob-color`

### 1.1 Supported Theme Variables

#### Core Interface Colors

- `--primary-color` - Primary accent color (links, active elements)
- `--accent-color` - Secondary accent color
- `--dark-primary-color` - Dark variant of primary color
- `--light-primary-color` - Light variant of primary color

#### Text Colors

- `--primary-text-color` - Primary text color
- `--secondary-text-color` - Secondary text color
- `--text-primary-color` - Text on primary surfaces
- `--text-light-primary-color` - Text on light primary surfaces
- `--disabled-text-color` - Disabled text color

#### Background Colors

- `--card-background-color` - Background of cards
- `--primary-background-color` - Main page background
- `--secondary-background-color` - Secondary background (modals, popups)
- `--clear-background-color` - Transparent-like background

#### Border and Divider Colors

- `--divider-color` - Divider lines
- `--outline-color` - Focus outlines
- `--outline-hover-color` - Hover outline color
- `--shadow-color` - Shadow color

#### State Colors (Domain/Device/State Specific)

Format: `--state-{domain}-{device_class}-{state}-color`
Examples:

- `--state-light-on-color` - Lights when on
- `--state-switch-on-color` - Switches when on
- `--state-binary_sensor-on-color` - Binary sensors when on
- `--state-climate-heat-color` - Climate in heat mode
- `--state-device_tracker-home-color` - Device tracker when home
- `--state-locked-color` - Locks when locked
- `--state-alarm_control_panel-armed_away-color` - Alarm armed away
- `--state-alert-on-color` - Alerts when active
- `--state-siren-active-color` - Sirens when active
- `--state-humidifier-on-color` - Humidifiers when on
- `--state-fan-on-color` - Fans when on
- `--state-vacuum-on-color` - Vacuums when cleaning
- `--state-weather-sunny-color` - Weather sunny
- `--state-weather-cloudy-color` - Weather cloudy
- `--state-weather-rainy-color` - Weather rainy
- `--state-weather-snowy-color` - Weather snowy
- `--state-update-in_progress-color` - Updates in progress
- `--state-script-running-color` - Scripts running
- `--state-automation-triggered-color` - Automations triggered

#### Special State Colors

- `--state-active-color` - Generic active state
- `--state-inactive-color` - Generic inactive state
- `--state-unavailable-color` - Unavailable entities

#### Energy Dashboard Colors

- `--energy-grid-consumption-color` - Grid consumption
- `--energy-grid-return-color` - Grid return
- `--energy-solar-color` - Solar production
- `--energy-non-fossil-color` - Non-fossil fuel energy
- `--energy-battery-out-color` - Battery discharging
- `--energy-battery-in-color` - Battery charging
- `--energy-gas-color` - Gas consumption
- `--energy-water-color` - Water consumption

#### Input Component Colors

- `--input-idle-line-color` - Input idle state
- `--input-hover-line-color` - Input hover state
- `--input-disabled-line-color` - Input disabled state
- `--input-outlined-idle-border-color` - Outlined input idle border
- `--input-outlined-hover-border-color` - Outlined input hover border
- `--input-outlined-disabled-border-color` - Outlined input disabled border
- `--input-fill-color` - Input background fill
- `--input-disabled-fill-color` - Disabled input background
- `--input-ink-color` - Input text color
- `--input-label-ink-color` - Input label color
- `--input-disabled-ink-color` - Disabled input text

#### Label Badge Colors

- `--label-badge-grey` - Default badge
- `--label-badge-red` - Error badge (uses `--error-color`)
- `--label-badge-blue` - Info badge (uses `--info-color`)
- `--label-badge-green` - Success badge (uses `--success-color`)
- `--label-badge-yellow` - Warning badge (uses `--warning-color`)

#### Graph/Calendar/Map Colors

- `--color-1` through `--color-54` - Sequential colors for charts
- `--history-unavailable-color` - History unavailable state

#### Scrollbar Colors

- `--scrollbar-thumb-color` - Scrollbar thumb color

#### Miscellaneous Colors

- `--error-color` - Error state color
- `--warning-color` - Warning state color
- `--success-color` - Success state color
- `--info-color` - Informational state color
- `--disabled-color` - Disabled state color
- `--black-color` - Pure black
- `--white-color` - Pure white

#### RGB Variants (for rgba() usage)

Each color variable has an RGB variant:

- `--rgb-primary-color`
- `--rgb-accent-color`
- `--rgb-primary-text-color`
- `--rgb-secondary-text-color`
- `--rgb-text-primary-color`
- `--rgb-card-background-color`
- `--rgb-warning-color`
- `--rgb-error-color`
- `--rgb-success-color`
- `--rgb-info-color`

### 1.2 Theme Modes

Themes can define separate light and dark mode values:

```yaml
frontend:
  themes:
    happy:
      primary-color: pink
      modes:
        dark:
          secondary-text-color: slategray
    day_and_night:
      primary-color: coral
      modes:
        light:
          secondary-text-color: olive
        dark:
          secondary-text-color: slategray
```

### 1.3 Theme Application Methods

1. **Per-user theme selection** - User profile → Theme selector
2. **System-wide via actions** - `frontend.set_theme` and `frontend.reload_themes` actions
3. **Per-card basis** - Individual Lovelace cards can specify a theme
4. **Automatic based on system preference** - Themes can follow system light/dark preference

### 1.4 Theme Configuration Splitting

Themes can be split across multiple files:

- Directly in `configuration.yaml`
- Separate file: `themes: !include themes.yaml`
- Directory merge: `themes: !include_dir_merge_named my_themes`

## 2. Login Screen and Auth Pages

[Existing login screen content remains unchanged - keep as is]

### 2.1 How the Login Screen Works

The login screen is rendered by `<ha-authorize>` and `<ha-auth-flow>` web
components, served as a **separate HTML page** (`authorize.html`) that is
NOT part of the main Home Assistant SPA. This has important implications:

- The login page loads its own JavaScript bundle — it does **not** load
  `extra_module_url` resources from `configuration.yaml`. Those only apply
  to the main app.
- Theme YAML files **do not** apply to the login page because the theme
  system only activates inside the main SPA after authentication.
- However, both `<ha-authorize>` and `<ha-auth-flow>` render in **light DOM**
  (`createRenderRoot()` returns `this`), meaning CSS variables set on
  `:root` or `document.documentElement` **would** affect them if injected.

### 2.2 CSS Variables Used on the Login Page

The login card background uses `--ha-card-background` / `--card-background-color`
with `--ha-card-box-shadow`, `--ha-card-border-radius`, `--ha-card-border-width`,
`--ha-card-border-color`, `--divider-color`. Text uses `--primary-text-color`.
Alerts use `--primary-background-color`. Buttons use `--primary-color`.
Font sizes use `--ha-font-size-3xl`, `--ha-font-size-m`.

### 2.3 Methods to Theme the Login Screen

Since the login page is external to the main SPA, standard theme YAML does
not reach it. Theming options:

| Method                          | How it works                                                            | Limitations                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Reverse proxy CSS injection** | Inject `<style>` or `<link>` into the login HTML via nginx/apache/Caddy | Requires proxy setup; not available to most users                                           |
| **Browser Mod**                 | `browser_mod.js` to inject CSS once the page loads                      | Browser Mod only works **after** authentication — it cannot style the pre-auth login screen |
| **Custom panel replacing auth** | A `panel_custom` integration that serves a themed auth page             | Complex; replaces the entire auth flow                                                      |
| **development_repo**            | Build a custom frontend with a themed login page                        | Requires maintaining a fork                                                                 |
| **Companion app**               | Mobile apps have their own login UI                                     | Not applicable to web                                                                       |

**Verdict:** The login screen is the hardest part to theme. The most practical
approach for most users is a reverse-proxy-side CSS injection or accepting
the default HA login look.

### 2.4 The Loading / "Loading data" Screen

After login, Home Assistant shows a loading/connecting screen while it fetches
initial state (rendered by `ha-bootstrap` / `home-assistant.ts` — checks for
`hass.states && hass.config && hass.services && databaseMigration !== false`).

This screen **is** part of the main SPA, so:

- All theme CSS variables apply
- `extra_module_url` resources are loaded
- Browser Mod can inject styles
- Custom CSS via the frontend bundle reaches it

The loading screen uses `--primary-background-color`, `--primary-text-color`,
and standard HA spinner styles. It can be themed through any method that
reaches the main app (theme YAML, extra_module_url, Browser Mod, card-mod).

## 4. Frontend Integration Configuration

The `frontend:` integration in `configuration.yaml` provides extension points for deeper customization.

### 2.1 JavaScript Module Injection

#### extra_module_url (ESM)

Load modern JavaScript modules:

```yaml
frontend:
  extra_module_url:
    - /hacsfiles/lovelace-card-mod/card-mod.js?hacstag=12345678901
    - /local/custom.js
```

#### extra_js_url_es5 (Legacy)

Load ES5-compatible JavaScript:

```yaml
frontend:
  extra_js_url_es5:
    - /local/legacy-plugin.js
```

### 2.2 Development Repository (For Custom Frontend Development)

```yaml
frontend:
  development_repo: /path/to/custom/frontend/source
  # or
  development_pr: 123 # Pull request number
  github_token: YOUR_TOKEN # Required for development_pr
```

### 2.3 Built-in Actions

- `frontend.reload_themes` - Reload theme definitions
- `frontend.set_theme` - Set default light/dark theme for all users
- `frontend.update_theme` - Update theme properties at runtime

## 3. HACS (Home Assistant Community Store) Integration Points

HACS provides multiple ways to extend Home Assistant's frontend.

### 3.1 Frontend Plugins (via HACS)

Frontend plugins are installed as Lovelace resources and can:

- Add custom card types
- Modify existing card behavior
- Inject global CSS/JS
- Add sidebar panels
- Add browser mods

#### 3.1.1 Card Mod (lovelace-card-mod)

Pierces Shadow DOM to style internal components:

- Styles `ha-card`, `ha-app-layout`, `ha-sidebar`, `ha-dialog`, `ha-alert`, `paper-dialog`
- Supports CSS variables and custom properties
- Can be installed as frontend module via `extra_module_url` for performance

#### 3.1.2 Browser Mod (hass-browser_mod)

Enables browser-level control:

- Popup dialogs replacing more-info
- Custom dashboard views per browser
- Fullscreen media playback
- Kiosk mode controls
- Custom URL navigation
- Browser-specific theming via CSS injection
- Services: `browser_mod.popup`, `browser_mod.navigate`, `browser_mod.set_theme`

#### 3.1.3 Icon Sets

Custom icon sets can replace Material Design Icons:

- Registered via custom prefix (e.g., `mdi:` → `sims2:`)
- Must follow MDI icon API specification
- SVG-based, 24x24 viewBox recommended

#### 3.1.4 Themes

HACS can distribute theme packages that appear in the theme selector.

#### 3.1.5 Plugin Integration

Custom integrations can serve static files, panel integrations, and Lovelace resources.

## 4. Lovelace UI Customization Points

### 4.1 Card Types

Home Assistant includes numerous built-in card types that can be themed:

- `entities` - List of entities
- `glance` - Compact entity cards
- `picture-entity` - Entity with picture
- `markdown` - Markdown text
- `iframe` - Embedded web content
- `webpage` - Full webpage
- `picture` - Picture display
- `weather-forecast` - Weather forecast
- `history-graph` - Historical data graph
- `statistic` - Numeric statistics
- `logbook` - Logbook entries
- `alarm-panel` - Alarm control panel
- `vertical-stack` - Vertical card stack
- `horizontal-stack` - Horizontal card stack
- `grid` - Grid layout
- `screen` - Conditional screen display
- `badge` - Entity badges
- `button` - Button card
- `entity` - Single entity control
- `light` - Light control card
- `switch` - Switch control card
- `input-button` - Momentary input button
- `input-number` - Numeric input
- `input-select` - Dropdown select
- `input-text` - Text input
- `humidifier` - Humidifier control
- `cover` - Cover (garage door, etc.) control
- `climate` - Climate control (thermostat)
- `media-control` - Media player control
- `camera` - Camera live view
- `camera-view` - Camera view with controls
- `thermostat` - Thermostat control
- `energy` - Energy dashboard
- `gauge` - Circular gauge
- `clock` - Analog/digital clock
- `facepl` - Facepl picture elements
- `picture-elements` - Advanced picture editing
- `picture-glance` - Picture with entity overlays
- `towel` - Towel rack (custom)
- `plant-status` - Plant status
- `shopping-list` - Shopping list
- `todo-list` - Todo list
- `calendar` - Calendar view
- `map` - Map view
- `zone` - Zone display
- `zone-outline` - Zone outline on map
- `text-divider` - Text divider
- `sound` - Sound player
- `zone` - Zone display
- `zone-outline` - Zone outline
- `dehumidifier` - Dehumidifier control
- `water-heater` - Water heater control
- `vent` - Ventilation control
- `valve` - Valve control
- `update` - Update manager
- `script` - Script runner
- `scene` - Scene activator
- `select` - Entity selector
- `number` - Number input
- `menu-button` - Menu button
- `entity-filter` - Filtered entity list
- `conditional` - Conditional card display
- `custom:` prefix - Custom cards (see section 5)

### 4.2 Card Configuration Overrides

Each card supports:

- `theme:` - Apply a specific theme to the card
- `card_mod:` - Piercing Shadow DOM styles (requires card-mod)
- `tap_action` / `hold_action` / `double_tap_action` - Interaction actions
- `entity:` / `entities:` - Target entities
- `name:` / `title:` - Custom display name/title
- `icon:` - Custom icon (can use custom icon sets)
- `show_state` / `show_name` - Toggle state/name display
- `state_color:` - Color the card based on entity state
- `style:` - Inline CSS styles
- `filter:` - Filter expression for entity lists
- `sort:` - Sort order for entity lists
- `state_display:` - Custom state display mapping
- `unit:` - Unit of measurement
- `icon_height:` - Icon height
- `tap_action:` - Action on tap
- `hold_action:` - Action on hold
- `double_tap_action:` - Action on double tap

### 4.3 Views and Dashboards

- `views:` - Dashboard views configuration
- `badges:` - Dashboard badges (entity state summary)
- `panel:` - Sidebar panel configuration
- `sidebar_icon:` - Custom sidebar icon
- `title:` - Dashboard title
- `icon:` - Dashboard icon
- `path:` - Dashboard URL path
- `badges:` - Dashboard badges
- `panel:` - Lovelace as sidebar panel
- `mode:` - View layout mode (`grid`, `section`)
- `sidebar_icon:` - Custom icon in sidebar

#### View Layout Modes

- `grid` - Masonry grid layout
- `section` - Horizontal sections with configurable widths

### 4.4 Sections View Configuration

When using `mode: section`:

- `grid:` - Section grid configuration
  - `columns:` - Number of columns per section
  - `title:` - Section title
  - `show_header_toggle:` - Show section collapse/expand
  - `collapsible:` - Make section collapsible
  - `title:` - Section title
  - `image:` - Section background image
  - `state:` - Show section based on entity state

## 5. Custom Lovelace Cards (Web Components)

Custom cards are implemented as vanilla web components or using frameworks like Lit. They can:

- Completely replace existing card types
- Add new visualization types
- Access Home Assistant JavaScript API (`this.hass`)
- Respond to entity state changes
- Define custom configuration options
- Use Shadow DOM for encapsulation
- Be distributed via HACS

### 5.1 Custom Card API

- `setConfig(config)` - Set card configuration
- `setHass(hass)` - Set Home Assistant instance reference
- `getCardSize()` - Return card height in grid units
- `_root()` - Access the card's root element
- `willUpdate(changedProps)` - Lifecycle method
- `firstUpdated()` - Lifecycle method
- `updated(changedProps)` - Lifecycle method

### 5.2 Common Custom Card Capabilities

- Access to `this.hass` for calling services, getting states
- Access to `this.stateObj` for current entity state
- Event listeners for user interactions
- Dynamic content updates based on entity changes
- Custom styling via CSS (can pierce Shadow DOM with `:host` context)
- Integration with theme system via CSS variables
- Registration via `customElements.define()`

## 6. Panel Integrations (Sidebar)

Integrations can add panels to the sidebar:

- `panel_iframe` - Embed web content in sidebar
- `panel_custom` - Serve custom HTML/JS panel
- `panel_custom_iframe` - Combine custom and iframe
- Appear as sidebar icons with optional badges
- Can be pinned to top of sidebar
- Support theme-aware styling via CSS variables

## 7. Static Resource Serving

Integrations can serve static files:

- Custom CSS stylesheets
- Custom JavaScript libraries
- Font files (WOFF2, TTF, etc.)
- Image assets (PNG, SVG, JPG)
- Sound files
- Served at `/api/<integration_name>/static/<file_path>`

## 8. WebSocket API and JavaScript Integration

Deeper integration possible via:

- Custom services that modify DOM
- WebSocket commands to trigger frontend changes
- Custom WebSocket messages for real-time updates
- `frontend.set_theme` service call
- `lovelace.reload` service call
- `frontend.reload_themes` service call

## 9. Browser-Level Modifications (via HACS)

### 9.1 Browser Mod Capabilities

When Browser Mod is installed and registered:

- Inject custom CSS into any browser
- Replace more-info dialogs with custom dashboard cards
- Navigate browsers to specific URLs/dashboards
- Trigger fullscreen media playback
- Set kiosk mode properties
- Read browser properties (width, height, user agent)
- Send custom JavaScript to execute in browser context
- Show toast notifications in browser
- Control browser zoom level
- Enable/disable browser navigation controls
- Set browser wallpaper/background

### 9.2 Services Provided by Browser Mod

- `browser_mod.popup` - Show popup dialog
- `browser_mod.notify` - Show browser notification
- `browser_mod.navigate` - Navigate to URL/path
- `browser_mod.set_theme` - Apply CSS theme
- `browser_mod.set_kiosk` - Configure kiosk mode
- `browser_mod.reload` - Reload browser page
- `browser_mod.js` - Execute JavaScript in browser
- `browser_mod.mute` - Mute browser audio
- `browser_mod.volume_set` - Set browser volume
- `browser_mod.volume_up/down` - Adjust browser volume

## 10. Lovelace Resources (HACS Frontend)

Resources registered via HACS appear in:

- `/hacsfiles/<repository>/<file_path>`
- Can be JavaScript modules (ESM)
- Can be CSS stylesheets
- Can be HTML templates
- Loaded automatically when referenced in Lovelace configuration
- Support cache busting via query parameters (`?hacstag=123`)

## 11. Configuration Panel Overrides

While not directly themable, certain configuration panels can be overridden:

- Integration configuration screens
- Entity configuration dialogs
- Add-on configuration panels
- Service call interfaces
- Developer tools panels
- These require either:
  - Complete frontend replacement (development_repo)
  - Card-mod piercing specific shadow roots
  - Custom panel integrations replacing standard panels

## 12. Animation and Transition Customization

Although not exposed as CSS variables, animations can be customized via:

- CSS animation overrides in themes
- Custom JavaScript modifying animation properties
- Browser Mod injecting @keyframes rules
- Custom cards defining their own animations

Commonly animated elements:

- Button press states
- Card entrance/exit
- Sidebar item hover
- Dialog entrance/exit
- Toast/snackbar appearance
- Switch toggle animation
- Slider thumb movement
- Tab indicator slide
- Custom card animation sequences
- Loading spinner rotation
- Progress bar fill animation
- Focus ring expansion/contraction

## 13. Font Customization

Fonts can be customized via:

- CSS `font-family` in themes (inherits through Shadow DOM)
- Google Fonts import via `@import` in theme CSS
- Self-hosted fonts via base64 data URI or `@font-face`
- Browser Mod injecting font rules
- Custom cards specifying their own fonts

Only the `--ha-font-family` variable is exposed by Home Assistant itself. Custom theme variables can also be defined and referenced by custom cards and CSS.

## 14. Icon Customization

Icons can be customized via:

- Custom icon sets (HACS)
- Entity `icon:` configuration (supports custom prefixes)
- Theme-based icon color overrides (`--state-icon-color`, `--state-icon-active-color`)
- Card-mod to replace SVG icons in Shadow DOM
- Custom cards using their own icon implementations

## 15. Sidebar Customization

### 15.1 Sidebar Component Architecture

The sidebar is the `<ha-sidebar>` web component (`src/components/ha-sidebar.ts`).
It renders items from `this.hass.panels` — the list of registered panels,
both built-in and custom. It uses Shadow DOM (LitElement), so document-level
CSS needs CSS variables or card-mod to pierce component boundaries.

### 15.2 Sidebar CSS Variables

| Variable                                 | What it controls                                 |
| ---------------------------------------- | ------------------------------------------------ |
| `--sidebar-background-color`             | Sidebar background                               |
| `--sidebar-text-color`                   | Sidebar item text                                |
| `--sidebar-icon-color`                   | Sidebar item icons                               |
| `--sidebar-selected-text-color`          | Active/selected item text                        |
| `--sidebar-selected-icon-color`          | Active/selected item icon + highlight background |
| `--sidebar-menu-button-text-color`       | Sidebar title/menu text                          |
| `--sidebar-menu-button-background-color` | Sidebar title/menu background                    |
| `--ha-sidebar-expanded-width`            | Width when expanded (default 256px)              |
| `--ha-sidebar-expanded-item-width`       | Width of items when expanded (default 248px)     |

### 15.3 Sidebar Item Shape

Sidebar items are `<ha-list-item-button>` elements with:

- `border-radius: var(--ha-border-radius-sm)` — controllable via theme
- `--ha-row-item-min-height`, `--ha-row-item-padding-block`,
  `--ha-row-item-padding-inline` — structural variables that can be overridden
- When collapsed: 48px-wide icon-only squares
- When expanded: full-width list items with text

The item shape (rounded rectangle) can be adjusted by overriding
`--ha-border-radius-sm` in a theme. This affects all sidebar items uniformly.
A custom theme can make items fully rounded (pill-shaped) or square-cornered.

### 15.4 Sidebar Item Icons for Built-in Menus

Built-in panels (Config, Profile, Notifications) and Lovelace dashboards
display icons from two sources:

1. **`getPanelIcon()`** — returns `panel.icon` (settable via
   `frontend/update_panel` WebSocket call) or a hardcoded path fallback for
   special panels (Profile → `mdi:account`).

2. **`getPanelTitle()`** — returns the panel title from:
   - A localized translation key (`panel.{title}`)
   - `panel.title` as a fallback

**How to change built-in panel icons and names:**

| Method                                        | What changes                                                         | Scope                                |
| --------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| **`frontend/update_panel` WebSocket**         | Change icon, title, `show_in_sidebar`, `require_admin` for any panel | Per-panel, persisted across restarts |
| **Dashboard YAML**                            | `icon:` and `title:` in Lovelace dashboard config                    | Per-dashboard                        |
| **`panel_custom` sidebar_title/sidebar_icon** | Custom panels define their own                                       | Per-custom-panel                     |
| **Sidebar editor dialog**                     | Users can reorder and hide panels via UI (hold-click → Edit sidebar) | Per-user preference                  |

The Config panel's icon (`mdi:cog` or `mdi:cellphoneCog`) and the Notifications
bell (`mdi:bell`) are hardcoded as MDI SVG paths in the sidebar component source.
They cannot be changed through theme YAML alone. Options to override them:

- Replace the icon globally via card-mod targeting `#sidebar-config ha-svg-icon`
- Or submit a `development_repo` modification to the frontend source

### 15.5 Sidebar Panel Hiding and Reordering

Users and integrations can reorder/hide sidebar panels through:

- The sidebar editor dialog (hold-click on sidebar → "Edit sidebar")
- `frontend/update_panel` WebSocket call (API-level panel mutation)
- `saveFrontendUserData()` for per-user sidebar state (panel order, hidden panels)

A custom integration can call `updatePanel()` (from `src/data/panel.ts`) via
WebSocket to change panel icons, titles, and visibility at any time.

### 15.6 Adding Custom Sidebar Panels

Custom sidebar panels can be added via:

- **`panel_custom`** — register a full-page custom panel with its own sidebar
  entry, icon, title, and URL path
- **`panel_iframe`** — embed an external website as a sidebar panel
- **Lovelace dashboard YAML** — each dashboard gets an automatic sidebar entry
  with configurable `sidebar_icon:` and `title:`

## 16. User Profile / Avatar Customization

### 16.1 How the User Badge Works

The sidebar displays `<ha-user-badge>` (`src/components/user/ha-user-badge.ts`),
a 40x40px circular avatar that shows either:

- The user's **person entity picture** (from `person.{user_id}` entity with
  `entity_picture` attribute) if one exists — served through `hassUrl()`
- The user's **initials** (computed from `user.name` by `computeUserInitials()`)
  on a `--light-primary-color` background with `--text-light-primary-color` text

### 16.2 Theming the User Badge

| Theme variable               | What it controls                                      |
| ---------------------------- | ----------------------------------------------------- |
| `--light-primary-color`      | Badge background (initials fallback)                  |
| `--text-light-primary-color` | Badge text color (initials fallback)                  |
| `--ha-border-radius-circle`  | Badge shape (always fully round, 50%)                 |
| `--primary-text-color`       | Text fallback if `--text-light-primary-color` not set |

The badge does not expose a dedicated CSS variable for its own background or
border. Card-mod can target `ha-user-badge` specifically for deeper styling.

### 16.3 Changing the Default Profile Picture

HA has no built-in default profile picture upload. It always falls back to
user initials unless:

1. A `person` entity exists linked to the user (via `user_id` attribute)
2. That person entity has an `entity_picture` attribute set

The picture URL is resolved through `this._connection.hassUrl(picture)` which
maps it through HA's proxy.

## 17. Built-in Button Shapes

### 17.1 Sidebar Item Buttons

`<ha-list-item-button>` elements:

- Default shape: rounded rectangle via `--ha-border-radius-sm`
- Collapsed: 48px-wide icon buttons
- Expanded: full-width list items with headline text

### 17.2 General Button Shape Customization

| Component                      | Shape Control                                         | Overridable Via |
| ------------------------------ | ----------------------------------------------------- | --------------- |
| `<ha-list-item-button>`        | `--ha-border-radius-sm`                               | Theme variable  |
| `<mwc-button>` / `<ha-button>` | Internal border-radius                                | Card-mod        |
| `<md-filled-button>`           | MDC shape token                                       | Card-mod        |
| `<ha-icon-button>`             | Fixed square (48x48)                                  | Card-mod        |
| `<ha-chip>`                    | 999px pill (hardcoded)                                | Card-mod        |
| `<ha-tab>`                     | MDC tab indicator                                     | Card-mod        |
| `<ha-switch>`                  | `--ha-switch-bar-radius`, `--ha-switch-button-radius` | Theme variable  |

The most impactful shape variable themeable is `--ha-border-radius-sm`, which
controls sidebar items and many list/row components throughout the interface.

## Summary of Customization Layers

1. **Theme Variables (YAML)** - Broad color/text/background overrides
2. **Frontend Configuration** - JS module injection, development repo
3. **HACS Plugins** - Card-mod, Browser Mod, custom icons, themes
4. **Lovelace Configuration** - Per-card overrides, views, badges
5. **Custom Cards** - Complete replacement/web components
6. **Panel Integrations** - Sidebar replacements
7. **Static Resources** - CSS/JS/font/image serving
8. **Browser Mod** - Browser-level CSS/JS injection
9. **WebSocket API** - Real-time service calls
10. **Resources** - HACS-served frontend files

This comprehensive list shows that virtually every visual aspect of Home Assistant can be customized through official channels without modifying core code.
