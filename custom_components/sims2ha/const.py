"""Constants for the Sims 2 integration.

The integration exists for one reason: to make installation a single HACS step.
On setup it (1) serves the bundled frontend module, (2) registers that module as
a Lovelace resource, (3) creates the premade storage-mode dashboards, and
(4) drops the theme file into <config>/themes/ and reloads themes. That removes
every manual copy/paste/register/import step.
"""
DOMAIN = "sims2ha"

# ---------------------------------------------------------------------------
# Frontend bundle
# ---------------------------------------------------------------------------
BUNDLE_FILE = "frontend/sims2-bundle.js"
BUNDLE_URL_PATH = "/sims2ha/bundle.js"

# ---------------------------------------------------------------------------
# Theme
# ---------------------------------------------------------------------------
THEME_FILE = "themes/sims2.yaml"

# ---------------------------------------------------------------------------
# Login & loading screen CSS
# ---------------------------------------------------------------------------
LOGIN_CSS_FILE = "www/login-screen.css"
LOGIN_CSS_URL_PATH = "/sims2ha/login-screen.css"
LOADING_CSS_FILE = "www/loading-screen.css"
LOADING_CSS_URL_PATH = "/sims2ha/loading-screen.css"

# ---------------------------------------------------------------------------
# Service worker for login screen theming
# ---------------------------------------------------------------------------
SERVICE_WORKER_FILE = "frontend/sw.js"
SERVICE_WORKER_URL_PATH = "/sims2ha/sw.js"

# ---------------------------------------------------------------------------
# Configuration option keys
# ---------------------------------------------------------------------------
CONF_THEME_MODE = "theme_mode"
CONF_ENABLE_ANIMATIONS = "enable_animations"
CONF_SIDEBAR_WIDTH = "sidebar_width"
CONF_ICON_SET_VERSION = "icon_set_version"
CONF_NEEDS_ENTITIES = "needs_entities"

# ---------------------------------------------------------------------------
# Entity attributes
# ---------------------------------------------------------------------------
ATTR_MOOD = "sims2_mood"
ATTR_ACTIVE_NEEDS = "sims2ha_active_needs"

# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------
EVENT_MOOD_CHANGED = "sims2ha_mood_changed"
EVENT_CONFIG_CHANGED = "sims2ha_config_changed"

# ---------------------------------------------------------------------------
# WebSocket command names
# ---------------------------------------------------------------------------
WS_GET_CONFIG = "sims2ha/get_config"
WS_SUBSCRIBE_CONFIG = "sims2ha/subscribe_config"
WS_SET_MOOD = "sims2ha/set_mood"
WS_GET_ICON_SET = "sims2ha/get_icon_set"

# ---------------------------------------------------------------------------
# Default values
# ---------------------------------------------------------------------------
DEFAULT_MOOD = 100
DEFAULT_OPTIONS = {
    CONF_THEME_MODE: "auto",
    CONF_ENABLE_ANIMATIONS: True,
    CONF_SIDEBAR_WIDTH: 280,
    CONF_ICON_SET_VERSION: "1.0",
    CONF_NEEDS_ENTITIES: "",
}

# ---------------------------------------------------------------------------
# Premade dashboards (storage-mode, created idempotently on setup)
# ---------------------------------------------------------------------------
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