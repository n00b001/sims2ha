"""Pure helpers for the Sims 2 integration — no Home Assistant imports.

Kept dependency-free on purpose so the non-trivial logic (mood clamping, option
merging, active-needs computation) can be self-checked without a Home Assistant
install:

    uv run python custom_components/sims2ha/helpers.py
"""

from __future__ import annotations

from typing import Any

_MOOD_MIN, _MOOD_MAX = 0, 100


def clamp_mood(value: Any, default: int = 100) -> int:
    """Coerce ``value`` to an int in [0, 100]; return ``default`` if it is not numeric."""
    try:
        mood = int(round(float(value)))
    except (TypeError, ValueError):
        return default
    if mood < _MOOD_MIN:
        return _MOOD_MIN
    if mood > _MOOD_MAX:
        return _MOOD_MAX
    return mood


def with_defaults(options: dict[str, Any] | None, defaults: dict[str, Any]) -> dict[str, Any]:
    """Return ``options`` merged over ``defaults`` (defaults fill only missing/None keys)."""
    merged = dict(defaults)
    if options:
        for key, value in options.items():
            if value is not None:
                merged[key] = value
    return merged


def parse_entity_list(raw: Any) -> list[str]:
    """Accept a comma-separated string or a list and return a clean list of entity ids."""
    if raw is None:
        return []
    if isinstance(raw, str):
        items = raw.split(",")
    else:
        items = list(raw)
    return [str(item).strip() for item in items if str(item).strip()]


def compute_active_needs(needs_entities: list[str], states: dict[str, dict[str, Any]]) -> list[str]:
    """Return the subset of ``needs_entities`` whose state marks an unmet need.

    A need is "active" (unmet) when the entity's state is ``on``/``low``, or a
    numeric value below 20. Point this at sensors that read "on" when a household
    need is unmet (a low-battery binary sensor, an open door, and so on). This is
    a simple, documented heuristic, not a derived model.
    """
    active: list[str] = []
    for entity_id in needs_entities:
        state = states.get(entity_id, {}).get("state")
        if state in {"on", "low"}:
            active.append(entity_id)
            continue
        try:
            if float(state) < 20:  # type: ignore[arg-type]
                active.append(entity_id)
        except (TypeError, ValueError):
            continue
    return active


if __name__ == "__main__":
    # Assert-based self-check — the smallest thing that fails if the logic breaks.
    assert clamp_mood(150) == 100
    assert clamp_mood(-5) == 0
    assert clamp_mood("73") == 73
    assert clamp_mood("not a number") == 100
    assert clamp_mood(None) == 100
    merged = with_defaults({"sidebar_width": 300}, {"sidebar_width": 280})
    assert merged == {"sidebar_width": 300}, merged
    assert parse_entity_list("a, b ,c") == ["a", "b", "c"]
    assert parse_entity_list(["x", " y "]) == ["x", "y"]
    states = {
        "binary_sensor.door": {"state": "on"},
        "sensor.water": {"state": "10"},
        "sensor.ok": {"state": "80"},
        "binary_sensor.closed": {"state": "off"},
    }
    needs = ["binary_sensor.door", "sensor.water", "sensor.ok", "binary_sensor.closed"]
    assert compute_active_needs(needs, states) == ["binary_sensor.door", "sensor.water"], (
        compute_active_needs(needs, states)
    )
    print("helpers self-check OK")  # noqa: T201
