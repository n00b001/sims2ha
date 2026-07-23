"""Config flow for the Sims 2 integration.

A single-instance integration: the flow creates exactly one entry on a single
click, with no options and no user input. Everything else (serving the bundle,
registering the Lovelace resource, creating the dashboards, dropping the theme)
happens in async_setup_entry.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class Sims2ConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single-instance flow: one click, no options, no user input."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create the single entry, or abort if one already exists."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title="Sims 2", data={})
