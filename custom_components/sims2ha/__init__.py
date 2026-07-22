"""The Sims 2 integration.

This integration exists to make the whole Sims 2 theme system installable as a
single HACS step with no manual copying. On setup it:

  1. serves the bundled frontend module over HTTP,
  2. registers that module as a Lovelace resource (so the custom cards resolve),
  3. serves the login and loading screen CSS files as static paths,
  4. registers the loading screen CSS as a Lovelace CSS resource,
  5. creates the nine premade storage-mode dashboards with their view configs,
  6. copies the theme file into <config>/themes/ and reloads themes,
  7. registers the sims2ha.reload_theme service.

Everything is idempotent so repeated setup (restarts, entry reloads) never
duplicates state. The one thing it cannot do is register a SELECTABLE theme
without the user's one-time `frontend: themes:` block in configuration.yaml —
that is a hard limit of Home Assistant itself (see the README).
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import yaml

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import (
    LOVELACE_DATA,
    MODE_STORAGE,
)
from homeassistant.components.lovelace.dashboard import (
    DashboardsCollection,
    LovelaceStorage,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    BUNDLE_FILE,
    BUNDLE_URL_PATH,
    DASHBOARDS,
    DOMAIN,
    LOADING_CSS_FILE,
    LOADING_CSS_URL_PATH,
    LOGIN_CSS_FILE,
    LOGIN_CSS_URL_PATH,
    THEME_FILE,
)

_LOGGER = logging.getLogger(__name__)

_PACKAGE_DIR = Path(__file__).parent
_DASHBOARDS_DIR = _PACKAGE_DIR / "dashboards"
_THEMES_TARGET_DIR = "themes"  # relative to the HA config directory

PLATFORMS = ["sensor"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the Sims 2 integration from a config entry."""
    bookkeeping: dict[str, Any] = hass.data.setdefault(DOMAIN, {})

    await _async_serve_static_files(hass, bookkeeping)
    await _async_register_lovelace_resources(hass)
    await _async_create_dashboards(hass)
    await _async_install_theme(hass)
    await _async_register_services(hass)
    await _async_register_websocket(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the integration.

    The dashboards and resource persist as user data (a user may have edited
    them); we only clear our in-process bookkeeping.
    """
    hass.data.pop(DOMAIN, None)
    return True


# --------------------------------------------------------------------------- #
# (1) Serve static files (bundle, login CSS, loading CSS) over HTTP.
# --------------------------------------------------------------------------- #
async def _async_serve_static_files(
    hass: HomeAssistant, bookkeeping: dict[str, Any]
) -> None:
    """Register static paths for the bundle, login CSS, and loading CSS."""
    if bookkeeping.get("static_paths_registered"):
        return

    # Bundle (JS module)
    bundle_path = str(_PACKAGE_DIR / BUNDLE_FILE)
    # Login CSS
    login_css_path = str(_PACKAGE_DIR / LOGIN_CSS_FILE)
    # Loading CSS
    loading_css_path = str(_PACKAGE_DIR / LOADING_CSS_FILE)

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(BUNDLE_URL_PATH, bundle_path, True),
            StaticPathConfig(LOGIN_CSS_URL_PATH, login_css_path, True),
            StaticPathConfig(LOADING_CSS_URL_PATH, loading_css_path, True),
        ]
    )
    bookkeeping["static_paths_registered"] = True
    _LOGGER.info(
        "Sims 2 static files served at %s, %s, %s",
        BUNDLE_URL_PATH,
        LOGIN_CSS_URL_PATH,
        LOADING_CSS_URL_PATH,
    )


# --------------------------------------------------------------------------- #
# (2) Register resources as Lovelace resources (bundle as module, loading CSS as CSS).
# --------------------------------------------------------------------------- #
async def _async_register_lovelace_resources(hass: HomeAssistant) -> None:
    """Register the bundle as a Lovelace module resource and the loading CSS as a CSS resource."""
    lovelace_data = hass.data.get(LOVELACE_DATA)
    if lovelace_data is None:
        _LOGGER.warning("Lovelace not set up; cannot register Sims 2 resources")
        return

    resources = lovelace_data.resources
    if not hasattr(resources, "async_create_item"):
        # YAML resource mode — resources are read-only and user-managed.
        _LOGGER.info(
            "Lovelace resources in YAML mode; skipping resource registration"
        )
        return

    # Ensure the collection has loaded before scanning for existing entries.
    if hasattr(resources, "_async_ensure_loaded"):
        await resources._async_ensure_loaded()

    # Check if the bundle module is already registered.
    bundle_exists = False
    loading_css_exists = False
    for item in resources.async_items():
        if item.get("url") == BUNDLE_URL_PATH and item.get("res_type") == "module":
            bundle_exists = True
        if item.get("url") == LOADING_CSS_URL_PATH and item.get("res_type") == "css":
            loading_css_exists = True

    if not bundle_exists:
        await resources.async_create_item(
            {"res_type": "module", "url": BUNDLE_URL_PATH}
        )
        _LOGGER.info("Registered Lovelace resource: %s (module)", BUNDLE_URL_PATH)

    if not loading_css_exists:
        await resources.async_create_item(
            {"res_type": "css", "url": LOADING_CSS_URL_PATH}
        )
        _LOGGER.info("Registered Lovelace resource: %s (css)", LOADING_CSS_URL_PATH)


# --------------------------------------------------------------------------- #
# (3) Create the premade storage-mode dashboards (idempotent).
# --------------------------------------------------------------------------- #
async def _async_create_dashboards(hass: HomeAssistant) -> None:
    """Create or refresh every premade dashboard."""
    lovelace_data = hass.data.get(LOVELACE_DATA)
    if lovelace_data is None:
        _LOGGER.warning("Lovelace not set up; cannot create Sims 2 dashboards")
        return

    for spec in DASHBOARDS:
        try:
            await _async_upsert_dashboard(hass, lovelace_data, spec)
        except Exception:  # noqa: BLE001 — one bad dashboard must not abort the rest
            _LOGGER.exception("Failed to create dashboard %s", spec["url_path"])


async def _async_upsert_dashboard(
    hass: HomeAssistant, lovelace_data: Any, spec: dict[str, Any]
) -> None:
    """Create a dashboard if absent, or refresh its views if it already exists."""
    url_path = spec["url_path"]
    views_config = await hass.async_add_executor_job(
        _read_dashboard_config, spec["file"]
    )

    # Dashboard already attached in this process (restart after install) —
    # refresh its views so shipped dashboard updates reach the user.
    existing_store = lovelace_data.dashboards.get(url_path)
    if isinstance(existing_store, LovelaceStorage):
        await existing_store.async_save(views_config)
        _LOGGER.info("Refreshed Sims 2 dashboard: %s", url_path)
        return

    # New collection instance bound to the same storage; create the metadata.
    collection = DashboardsCollection(hass)
    await collection.async_load()
    if any(d.get("url_path") == url_path for d in collection.async_items()):
        # Metadata persisted on an earlier run; lovelace re-attaches it on the
        # next full restart. Nothing more to do here.
        _LOGGER.info("Sims 2 dashboard already present: %s", url_path)
        return

    item = await collection.async_create_item(
        {
            "url_path": url_path,
            "title": spec["title"],
            "icon": spec["icon"],
            "show_in_sidebar": True,
            "require_admin": False,
            "mode": MODE_STORAGE,
        }
    )

    # Replicate the side effects of lovelace's storage_dashboard_changed
    # listener (which listens on its OWN collection instance, not ours):
    # attach a LovelaceStorage and register the panel so the dashboard shows up
    # in the sidebar immediately, without waiting for a restart.
    store = LovelaceStorage(hass, item)
    lovelace_data.dashboards[url_path] = store
    frontend.async_register_built_in_panel(
        hass,
        "lovelace",
        frontend_url_path=url_path,
        require_admin=False,
        show_in_sidebar=True,
        sidebar_title=spec["title"],
        sidebar_icon=spec["icon"],
        config={"mode": MODE_STORAGE},
        update=True,
    )
    await store.async_save(views_config)
    _LOGGER.info("Created Sims 2 dashboard: %s", url_path)


def _read_dashboard_config(filename: str) -> dict[str, Any]:
    """Read a bundled dashboard YAML and return its Lovelace config dict."""
    with (_DASHBOARDS_DIR / filename).open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


# --------------------------------------------------------------------------- #
# (4) Drop the theme file into <config>/themes/ (without clobbering user edits)
#     and reload themes so it appears in the picker. Becoming SELECTABLE still
#     requires the user's one-time `frontend: themes:` block (HA's own rule).
# --------------------------------------------------------------------------- #
async def _async_install_theme(hass: HomeAssistant) -> None:
    """Copy the theme file into <config>/themes/ and reload themes."""
    source = _PACKAGE_DIR / THEME_FILE
    target = hass.config.path(_THEMES_TARGET_DIR, source.name)
    try:
        await hass.async_add_executor_job(_write_if_missing, str(source), target)
        await hass.services.async_call("frontend", "reload_themes")
    except Exception:  # noqa: BLE001 — theme is a bonus, not load-bearing for setup
        _LOGGER.exception("Could not install/reload the Sims 2 theme")
    else:
        _LOGGER.info("Sims 2 theme installed at %s", target)


def _write_if_missing(source: str, target: str) -> None:
    """Copy source to target only if target does not yet exist."""
    Path(target).parent.mkdir(parents=True, exist_ok=True)
    if Path(target).exists():
        return  # Respect any edits the user has made to the theme.
    Path(target).write_bytes(Path(source).read_bytes())


# --------------------------------------------------------------------------- #
# (5) Register the sims2ha.reload_theme service — re-installs the theme and
#     refreshes HA's themes so edits appear without a full restart.
# --------------------------------------------------------------------------- #
async def _async_register_services(hass: HomeAssistant) -> None:
    """Register the Sims 2 domain services."""

    async def _reload_theme(_call: Any) -> None:
        await _async_install_theme(hass)

    async def _toggle_animations(call: Any) -> None:
        enabled = call.data.get("enabled", True)
        entry = hass.config_entries.async_entries(DOMAIN)
        if entry:
            hass.config_entries.async_update_entry(
                entry[0], options={**entry[0].options, "enable_animations": enabled}
            )
        hass.bus.async_fire(
            "sims2ha_config_changed",
            {"enable_animations": enabled},
        )

    async def _set_sidebar_width(call: Any) -> None:
        width = call.data.get("width", 280)
        entry = hass.config_entries.async_entries(DOMAIN)
        if entry:
            hass.config_entries.async_update_entry(
                entry[0], options={**entry[0].options, "sidebar_width": width}
            )
        hass.bus.async_fire(
            "sims2ha_config_changed",
            {"sidebar_width": width},
        )

    async def _set_mood_handler(call: Any) -> None:
        mood = call.data.get("mood", 100)
        clamped = max(0, min(100, int(mood)))
        hass.data.setdefault(DOMAIN, {})["mood"] = clamped
        hass.bus.async_fire("sims2ha_mood_changed", {"sims2_mood": clamped})

    hass.services.async_register(DOMAIN, "reload_theme", _reload_theme)
    hass.services.async_register(DOMAIN, "toggle_animations", _toggle_animations)
    hass.services.async_register(DOMAIN, "set_sidebar_width", _set_sidebar_width)
    hass.services.async_register(DOMAIN, "set_mood", _set_mood_handler)
    _LOGGER.info("Registered services for %s", DOMAIN)


# --------------------------------------------------------------------------- #
# (6) Register websocket commands — expose mood, config, and icon set info.
# --------------------------------------------------------------------------- #
async def _async_register_websocket(hass: HomeAssistant) -> None:
    """Register every Sims 2 websocket command (idempotent across reloads)."""
    from .websocket_api import async_register

    await async_register(hass)
    _LOGGER.info("Registered Sims 2 websocket commands")