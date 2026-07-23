"""Simple test file to demonstrate test coverage."""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from custom_components.sims2ha.helpers import (
    clamp_mood,
    compute_active_needs,
    parse_entity_list,
    with_defaults,
)


def test_basic():
    """Basic function tests."""
    # Test clamp_mood
    assert clamp_mood(150) == 100
    assert clamp_mood(-5) == 0
    assert clamp_mood(50) == 50

    # Test with_defaults
    assert with_defaults({"key": "value"}, {"key": "default"}) == {"key": "value"}
    assert with_defaults({"key": None}, {"key": "default"}) == {"key": None}

    # Test parse_entity_list
    assert parse_entity_list("a,b,c") == ["a", "b", "c"]
    assert parse_entity_list(["x", "y"]) == ["x", "y"]

    # Test compute_active_needs
    states = {"sensor.test": {"state": "on"}}
    assert compute_active_needs(["sensor.test"], states) == ["sensor.test"]

    print("✓ Basic tests passed")


if __name__ == "__main__":
    test_basic()
    print("All tests passed!")
