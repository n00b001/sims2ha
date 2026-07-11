# Quick install reference

A condensed version of the README install steps. Full explanations live in the
root [README.md](../README.md).

## 1. Theme (HACS)

1. HACS → Frontend → ⋯ → **Custom repositories**.
2. Add `https://github.com/n00b001/sims2ha`, category **Theme**.
3. Install **Sims 2**, then reload themes (Developer tools → YAML → Reload Themes).
4. Profile → Theme → **Sims 2**.

## 2. Custom cards & fonts

Copy `www/community/sims2ha/*` → `<config>/www/community/sims2ha/`, then add
four resources under Settings → Dashboards → Resources:

| URL | Type |
|---|---|
| `/local/community/sims2ha/sims2-loading-card.js` | JavaScript module |
| `/local/community/sims2ha/sims2-plumbob-card.js` | JavaScript module |
| `/local/community/sims2ha/sims2-icons.js` | JavaScript module (icon pack) |
| `/local/community/sims2ha/sims2-fonts.css` | Stylesheet |
| `/local/community/sims2ha/sims2-overrides.css` | Stylesheet (optional) |

Clear the browser cache after copying (or append `?v=2` to the URLs). The icon
pack registers the `sims2:` prefix — see [docs/ICONS.md](ICONS.md) for the full
catalogue (52 icons: plumbob, simoleon, the eight needs, rooms & buy-mode types).

## 3. Dashboards (optional)

Install [auto-entities](https://github.com/thomasloven/lovelace-auto-entities)
(HACS → Frontend), then paste the `lovelace:` block from
`config-examples/configuration.yaml` into your `configuration.yaml` and reload.
