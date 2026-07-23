async def _on_config_changed(self, _event: object) -> None:
        """Handle configuration updates."""
        await self.async_write_ha_state()
