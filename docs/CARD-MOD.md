# Optional deep styling with card-mod

The base theme uses Home Assistant's native CSS-variable system, which
transforms the entire UI without any extra integration. A plain stylesheet
loaded as a resource cannot reach inside Home Assistant's Shadow DOM, so a
few signature touches — a gradient panel header, a coloured sidebar rail,
re-skinned settings pages — require running CSS *inside* each component's
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

## Why this is optional
The theme, the loading screen, the plumbob card, and the dashboards all look
correct and cohesive without card-mod — they carry their own styling in
Shadow DOM. card-mod is purely for people who want the gradient chrome applied
to the rest of the Home Assistant shell.
