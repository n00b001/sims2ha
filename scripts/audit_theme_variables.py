#!/usr/bin/env python3
"""Parse HA_THEMING_CAPABILITIES.md and verify every variable exists in sims2.yaml."""

import re

import yaml


def audit():
    with open("docs/HA_THEMING_CAPABILITIES.md") as f:
        doc = f.read()

    with open("custom_components/sims2ha/themes/sims2.yaml") as f:
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
        if not name or name.endswith("-") or name.endswith("*"):
            continue
        variables.add(name)

    # Flatten theme variables from the single sims2 theme (modes-based)
    themed = set()
    if "sims2" in theme:
        modes = theme["sims2"].get("modes", {})
        for _mode_name, theme_vars in modes.items():
            themed.update(theme_vars.keys())

    missing = variables - themed

    if missing:
        print(  # noqa: T201
            f"Missing: {len(missing)} — {', '.join(sorted(missing)[:10])}{'...' if len(missing) > 10 else ''}"
        )
    else:
        print("Missing: 0")  # noqa: T201

    return len(missing) == 0


if __name__ == "__main__":
    import sys

    sys.exit(0 if audit() else 1)
