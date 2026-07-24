# Optional deep styling with card-mod

The base theme uses Home Assistant's native CSS-variable system, which
transforms the entire UI without any extra integration. A plain stylesheet
loaded as a resource cannot reach inside Home Assistant's Shadow DOM, so a
few signature touches — a gradient panel header, a coloured sidebar rail,
re-skinned settings pages — require running CSS _inside_ each component's
shadow root.

[card-mod](https://github.com/thomasloven/lovelace-card-mod) is the standard,
HACS-installable way to do exactly that. Install it, then paste the snippet
below into your theme or a dashboard to unlock the full Sims 2 panel look.

## Snippet

Add this to a card-mod "theme" entry (for example in your `configuration.yaml`
frontend or via the card-mod theme integration). It paints the app header as a
Sims 2 panel-blue gradient with a gold underline and rounds every Material
card.

```yaml
# Example: a card-mod-augmented theme entry (light mode shown)
sims2_plus:
  card-mod-theme-yaml:
    ha-card$: |
      .card-content { padding: 16px; }
    ha-app-layout$: |
      app-header {
        background-image: linear-gradient(180deg,
          var(--sims2-panel-blue-dark) 0%,
          var(--sims2-panel-blue) 100%) !important;
        border-bottom: 2px solid var(--sims2-gold) !important;
      }
      app-toolbar {
        --app-toolbar-color: var(--text-primary-color) !important;
      }
    ha-sidebar$: |
      :host { border-right: 2px solid var(--sims2-gold); }
      paper-listbox { background: transparent !important; }
```

If you prefer per-card tweaks, use the `card-mod` card on any individual card:

```yaml
type: entities
title: Bella Goth's Lights
card_mod:
  style: |
    ha-card {
      border: 2px solid var(--sims2-gold);
      border-radius: 14px;
      box-shadow: 0 4px 10px rgba(74,51,32,0.2);
    }
    .card-header { color: var(--sims2-panel-blue-dark); }
entities:
  - light.bedroom
```

## Per-card shadow-DOM tweaks (gauge / weather / alarm)

A few built-in cards render their distinctive pieces inside Shadow DOM that
the document-level stylesheet cannot reach. The theme already drives their
base colours through CSS variables (for example `--state-weather-sunny-color`
and the global `mwc-button` rules that style the alarm keypad). To recolour
the pieces below, add a `card_mod` block to the individual card:

```yaml
# Gauge — recolour the arc to plumbob green
type: gauge
entity: sensor.cpu_temp
card_mod:
  style:
    ha-gauge:
      $: |
        .dial, .value {
          --gauge-color: var(--sims2-plumbob-green) !important;
        }
```

```yaml
# Weather forecast — tint the forecast-row icons sky blue
type: weather-forecast
entity: weather.pleasantview
card_mod:
  style: |
    ha-state-icon { --state-icon-color: var(--sims2-sky-blue); }
```

```yaml
# Alarm panel — plumbob-green "armed" keypad buttons
type: alarm-panel
entity: alarm_control_panel.house
card_mod:
  style:
    ha-alarm-panel-card:
      $: |
        mwc-button[armed] {
          --mdc-theme-primary: var(--sims2-plumbob-green);
        }
```

The selector names track the current Home Assistant frontend; if a future HA
release renames a Shadow DOM node, the card simply falls back to the themed
default until the snippet is updated.

## Why this is optional

The theme, the loading screen, the plumbob card, and the dashboards all look
correct and cohesive without card-mod — they carry their own styling in
Shadow DOM. card-mod is purely for people who want the gradient chrome applied
to the rest of the Home Assistant shell.
