# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-07-11

Initial release: the Sims 2 theme system delivered as a single HACS
Integration — one install, no copy/paste, no manual resource registration,
no dashboard import.

### Added

- Custom integration `sims2ha` that, on **Add Integration**: serves the
  frontend bundle over HTTP, registers it as a Lovelace module resource,
  creates nine storage-mode dashboards (idempotent), and copies the theme
  file into `<config>/themes/`.
- Zero-config theme layer — the Sims 2 look is applied through an injected
  `:root` CSS block (with a `prefers-color-scheme: dark` variant), so no
  `configuration.yaml` edit is required for the look to take effect.
- `sims2:` icon pack (52 icons), `custom:sims2-loading` and
  `custom:sims2-plumbob` cards, the Benguiat Gothic typeface, themed scrollbars.
- Nine premade dashboards — seven auto-populate from the user's entities via
  the bundled `auto-entities`.
- `auto-entities` (MIT, Thomas Lovén) vendored into the bundle, so the
  auto-populating dashboards need no separate install.
