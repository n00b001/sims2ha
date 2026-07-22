"""Custom websocket commands for the Sims 2 integration (plan §18.2).

This is the transport that makes integration options and mood reach the frontend
bundle (``src/sims2-integration.js``). It exposes:

  sims2ha/get_config       — return the current option snapshot
  sims2ha/subscribe_config — push the snapshot every time options change
  sims2ha/set_mood         — push a household mood (0-100) from any client
  sims2ha/get_icon_set     — return the configured icon-set version

Registered from ``__init__._async_register_websocket``.
"""

from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, ServiceCall  # noqa: F401 (ServiceCall kept for parity)

from .const import (
    ATTR_MOOD,
    CONF_ICON_SET_VERSION,
    DEFAULT_MOOD,
    DEFAULT_OPTIONS,
    DOMAIN,
    EVENT_CONFIG_CHANGED,
    EVENT_MOOD_CHANGED,
    WS_GET_CONFIG,
    WS_GET_ICON_SET,
    WS_SET_MOOD,
    WS_SUBSCRIBE_CONFIG,
)
from .helpers import clamp_mood, with_defaults


def _entry(hass: HomeAssistant):
    """The single Sims 2 config entry, or None."""
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0] if entries else None


def async_register(hass: HomeAssistant) -> None:
    """Register every Sims 2 websocket command (idempotent across reloads)."""
    websocket_api.async_register_command(hass, _handle_get_config)
    websocket_api.async_register_command(hass, _handle_subscribe_config)
    websocket_api.async_register_command(hass, _handle_set_mood)
    websocket_api.async_register_command(hass, _handle_get_icon_set)


@websocket_api.async_response
@websocket_api.websocket_command({vol.Required("type"): WS_GET_CONFIG})
async def _handle_get_config(hass: HomeAssistant, connection, msg) -> None:
    """Return the merged option snapshot for the current entry."""
    entry = _entry(hass)
    options = entry.options if entry is not None else {}
    connection.send_message(
        websocket_api.result_message(msg["id"], with_defaults(options, DEFAULT_OPTIONS))
    )


@websocket_api.async_response
@websocket_api.websocket_command({vol.Required("type"): WS_SUBSCRIBE_CONFIG})
async def _handle_subscribe_config(hass: HomeAssistant, connection, msg) -> None:
    """Subscribe to config changes; forward each ``sims2ha_config_changed`` event."""

    async def forward(event) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], event.data))

    connection.subscriptions[msg["id"]] = hass.bus.async_listen(
        EVENT_CONFIG_CHANGED, forward
    )
    connection.send_message(websocket_api.result_message(msg["id"]))


@websocket_api.async_response
@websocket_api.websocket_command(
    {vol.Required("type"): WS_SET_MOOD, vol.Required("mood"): vol.Any(int, float, str)}
)
async def _handle_set_mood(hass: HomeAssistant, connection, msg) -> None:
    """Set the household mood and broadcast ``sims2ha_mood_changed``."""
    mood = clamp_mood(msg["mood"], default=DEFAULT_MOOD)
    hass.data.setdefault(DOMAIN, {})["mood"] = mood
    hass.bus.async_fire(EVENT_MOOD_CHANGED, {ATTR_MOOD: mood})
    connection.send_message(websocket_api.result_message(msg["id"], {ATTR_MOOD: mood}))


@websocket_api.async_response
@websocket_api.websocket_command({vol.Required("type"): WS_GET_ICON_SET})
async def _handle_get_icon_set(hass: HomeAssistant, connection, msg) -> None:
    """Return the configured icon-set version.

    The icon SVGs themselves live in the frontend bundle (``window.customIcons``
    ['sims2']); the backend does not duplicate that list, so only the version is
    returned here.
    """
    entry = _entry(hass)
    options = entry.options if entry is not None else {}
    version = with_defaults(options, DEFAULT_OPTIONS)[CONF_ICON_SET_VERSION]
    connection.send_message(
        websocket_api.result_message(msg["id"], {"version": version})
    )
