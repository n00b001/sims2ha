"""Constants for the Sims 2 integration.

The integration exists for one reason: to make installation a single HACS step.
On setup it (1) serves the bundled frontend module, (2) registers that module as
a Lovelace resource, (3) creates the premade storage-mode dashboards, and
(4) drops the theme file into <config>/themes/ and reloads themes. That removes
every manual copy/paste/register/import step.
"""
DOMAIN = "sims2ha"

# The single frontend module the integration serves and registers. It bundles
# the sims2: icon pack, custom:sims2-loading, custom:sims2-plumbob, the
# document-level fonts/overrides CSS, and a vendored copy of auto-entities.
BUNDLE_FILE = "frontend/sims2-bundle.js"

# URL the browser fetches the module at. The integration registers a static
# path for this (see __init__.py); it is the URL also used as the Lovelace
# module resource.
BUNDLE_URL_PATH = "/sims2ha/bundle.js"

# Theme file the integration copies into <config>/themes/ so HA's theme system
# can pick it up (requires the user's one-time `frontend: themes:` block — the
# one manual prerequisite that HA itself imposes; see README).
THEME_FILE = "themes/sims2.yaml"

# Login screen CSS file (for reverse proxy injection or development_repo)
LOGIN_CSS_FILE = "www/login-screen.css"
LOGIN_CSS_URL_PATH = "/sims2ha/login-screen.css"

# Loading screen CSS file (for post-auth loading screen, to be loaded as a Lovelace resource)
LOADING_CSS_FILE = "www/loading-screen.css"
LOADING_CSS_URL_PATH = "/sims2ha/loading-screen.css"

# Premade dashboards the integration creates (storage mode) on setup, idempotent.
# `file` is relative to the `dashboards/` folder shipped inside this package.
DASHBOARDS = [
    {
        "file": "sims2-overview.yaml",
        "url_path": "sims2-overview",
        "title": "Pleasantview Overview",
        "icon": "sims2:plumbob",
    },
    {
        "file": "sims2-lights.yaml",
        "url_path": "sims2-lights",
        "title": "Lighting Bureau",
        "icon": "sims2:type-lighting",
    },
    {
        "file": "sims2-climate.yaml",
        "url_path": "sims2-climate",
        "title": "Climate Control",
        "icon": "sims2:type-appliances",
    },
    {
        "file": "sims2-power.yaml",
        "url_path": "sims2-power",
        "title": "Power & Energy",
        "icon": "sims2:type-electronics",
    },
    {
        "file": "sims2-security.yaml",
        "url_path": "sims2-security",
        "title": "Security Grid",
        "icon": "sims2:shop-window",
    },
    {
        "file": "sims2-automations.yaml",
        "url_path": "sims2-automations",
        "title": "Automation Suite",
        "icon": "sims2:live-mode",
    },
    {
        "file": "sims2-system.yaml",
        "url_path": "sims2-system",
        "title": "Plumbob Command",
        "icon": "sims2:build-mode",
    },
    {
        "file": "sims2-needs.yaml",
        "url_path": "sims2-needs",
        "title": "Household Needs",
        "icon": "sims2:need-energy",
    },
    {
        "file": "static/sims2-starter.yaml",
        "url_path": "sims2-starter",
        "title": "Pleasantview Starter",
        "icon": "sims2:aspiration-star",
    },
]