# Premade dashboards

These Lovelace YAML dashboards are auto-built from your system's entities and
dressed in Sims 2 easter eggs. Register them in `configuration.yaml` (see
`config-examples/configuration.yaml` for the full `lovelace:` block) or import
the YAML into a new dashboard through the UI.

| File | Sidebar title | What it shows |
|---|---|---|
| `sims2-overview.yaml` | Pleasantview Overview | splash, plumbob mascot, live snapshot |
| `sims2-lights.yaml` | Lighting Bureau | every `light.*`, plus a "darkness" button |
| `sims2-climate.yaml` | Climate Control | `climate.*`, fans, humidifiers, temp gauges |
| `sims2-power.yaml` | Power & Energy | power gauges, energy meters, batteries |
| `sims2-security.yaml` | Security Grid | locks, alarms, doors, windows, motion |
| `sims2-automations.yaml` | Automation Suite | automations, scenes, scripts |
| `sims2-system.yaml` | Plumbob Command | updates, vitals, connectivity |
| `sims2-needs.yaml` | Household Needs | joke: the eight Sim needs, mapped to sensors |
| `static/sims2-starter.yaml` | Pleasantview Starter | no auto-entities, hand-edited |

## Requirements

The auto-populating dashboards use the **[auto-entities](https://github.com/thomasloven/lovelace-auto-entities)**
integration. Install it via HACS (it is a "Frontend" Lovelace plugin, not a
theme). Without it, those dashboards will show an error card in place of the
auto-populated sections - everything else still works.

If you do not want auto-entities, start with
`static/sims2-starter.yaml`, which needs nothing extra.

## Customising the jokes

The banners are plain markdown `#` headings and blockquotes inside each file.
Edit them freely - they are just text. The loading tips live in
`www/community/sims2ha/sims2-loading-card.js` (`SIMS2_DEFAULT_TIPS`), or
override them per card via the `tips:` option.
