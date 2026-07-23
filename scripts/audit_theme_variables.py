#!/usr/bin/env python3
"""Audit theme variables for missing definitions."""

import re
import sys

import yaml

THEME_FILE = "custom_components/sims2ha/themes/sims2.yaml"
DOC_FILE = "docs/HA_THEMING_CAPABILITIES.md"


def audit():
    """Audit theme variables for missing definitions."""
    with open(DOC_FILE, encoding="utf-8") as f:
        doc = f.read()

    with open(THEME_FILE, encoding="utf-8") as f:
        theme = yaml.safe_load(f)

    # Extract CSS variable names from the doc. The capabilities doc writes
    # family wildcards like `--ha-border-radius-*` and `--ha-space-*`; capture
    # the whole token (including the `*`), then drop family wildcards because a
    # family counts as covered once its concrete members are themed (those are
    # listed individually in the doc and checked below). Also drop trailing-dash
    # family stubs and bare dashes captured from markdown table separators
    # (`|---|---|`), which are not real variables.
    variables = set()
    for match in re.findall(r"--[\w*-]+", doc):
        name = match[2:]
        if not name or name.endswith(("-", "*")):
            continue
        variables.add(name)

    # Flatten theme variables from the single sims2 theme (modes-based)
    themed = set()
    if "sims2" in theme:
        modes = theme["sims2"].get("modes", {})
        for vars_dict in modes.values():
            if isinstance(vars_dict, dict):
                themed.update(vars_dict.keys())

    # Find missing variables
    missing = variables - themed

    if missing:
        # Limit output for readability
        sorted_missing = sorted(missing)
        if len(sorted_missing) > 10:
            displayed = ", ".join(sorted_missing[:10]) + "..."
        else:
            displayed = ", ".join(sorted_missing)
        print(f"Missing: {len(missing)} — {displayed}")
        return False
    else:
        print("Missing: 0")
        return True


if __name__ == "__main__":
    sys.exit(0 if audit() else 1)