"""Sims 2 household-mood sensor (plan §10.8 entity attributes).

Exposes ``sensor.sims2_household_mood`` with:

  state       = mood (0-100; settable via the ``sims2ha.set_mood`` service or the
                ``sims2ha/set_mood`` websocket command)
  attributes  = ``sims2ha_active_needs`` (list) plus the option snapshot
                (``theme_mode``, ``enable_animations``, ``sidebar_width``) so a
                dashboard can read them too.

``sims2ha_active_needs`` is computed from the optional ``needs_entities`` option
(comma-separated entity ids that read ``on``/low when a household need is unmet);
it defaults to an empty list when nothing is configured.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.restore_state import RestoreEntity

from .const import (
    ATTR_ACTIVE_NEEDS,
    CONF_ENABLE_ANIMATIONS,
    CONF_NEEDS_ENTITIES,
    CONF_SIDEBAR_WIDTH,
    CONF_THEME_MODE,
    DEFAULT_MOOD,
    DEFAULT_OPTIONS,
    DOMAIN,
    EVENT_CONFIG_CHANGED,
    EVENT_MOOD_CHANGED,
    ATTR_MOOD,
)
from .helpers import compute_active_needs, parse_entity_list, with_defaults


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities
) -> None:
    """Set up the single household-mood sensor."""
    hass.data.setdefault(DOMAIN, {}).setdefault("mood", DEFAULT_MOOD)
    async_add_entities([Sims2HouseholdMoodSensor(hass, entry)])


class Sims2HouseholdMoodSensor(RestoreEntity, SensorEntity):
    """The household mood (0-100) with active-needs + option attributes."""

    _attr_name = "Household Mood"
    _attr_unique_id = "sims2_household_mood"
    _attr_native_unit_of_measurement = "%"
    _attr_icon = "sims2:aspiration-star"
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self._entry = entry
        self._attr_native_value: int = DEFAULT_MOOD
        self._attr_extra_state_attributes: dict[str, Any] = {ATTR_ACTIVE_NEEDS: []}

    async def async_added_to_hass(self) -> None:
        """Restore the last mood, then listen for mood/config changes."""
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state is not None and last_state.state not in {None, "unknown", "unavailable"}:
            try:
                self._attr_native_value = int(round(float(last_state.state)))
            except ValueError:
                pass
            self.hass.data[DOMAIN]["mood"] = self._attr_native_value

        self._refresh_attributes()
        self.async_on_remove(
            self.hass.bus.async_listen(EVENT_MOOD_CHANGED, self._on_mood_changed)
        )
        self.async_on_remove(
            self.hass.bus.async_listen(EVENT_CONFIG_CHANGED, self._on_config_changed)
        )

    def _refresh_attributes(self) -> None:
        """Recompute active_needs + the option snapshot from current state."""
        options = with_defaults(self._entry.options, DEFAULT_OPTIONS)
        needs = parse_entity_list(options.get(CONF_NEEDS_ENTITIES))
        states: dict[str, dict[str, Any]] = {}
        for entity_id in needs:
            state_obj = self.hass.states.get(entity_id)
            states[entity_id] = {"state": state_obj.state if state_obj else None}
        self._attr_extra_state_attributes = {
            ATTR_ACTIVE_NEEDS: compute_active_needs(needs, states),
            CONF_THEME_MODE: options[CONF_THEME_MODE],
            CONF_ENABLE_ANIMATIONS: options[CONF_ENABLE_ANIMATIONS],
            CONF_SIDEBAR_WIDTH: options[CONF_SIDEBAR_WIDTH],
        }

    async def _on_mood_changed(self, event) -> None:
        self._attr_native_value = event.data.get(ATTR_MOOD, DEFAULT_MOOD)
        self._refresh_attributes()
        self.async_write_ha_state()

    async def _on_config_changed(self, event) -> None:
        self._refresh_attributes()
        self.async_write_ha_state()
