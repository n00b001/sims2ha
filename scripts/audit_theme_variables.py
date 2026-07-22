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
    for match in re.findall(r'--[\w*-]+', doc):
        name = match[2:]
        if not name or name.endswith("-") or name.endswith("*"):
            continue
        variables.add(name)

    # Flatten theme variables
    themed = set()
    for mode in ["sims2-light", "sims2-dark"]:
        if mode in theme:
            themed.update(theme[mode].keys())

    # For sims2 (modes-based), collect both light and dark
    if "sims2" in theme:
        modes = theme["sims2"].get("modes", {})
        for mode_name, vars in modes.items():
            themed.update(vars.keys())

    missing = variables - themed

    print(f"Total HA variables documented: {len(variables)}")
    print(f"Variables themed: {len(themed)}")
    print(f"Missing: {len(missing)}")
    if missing:
        for v in sorted(missing):
            print(f"  MISSING: --{v}")

    return len(missing) == 0

if __name__ == "__main__":
    import sys
    sys.exit(0 if audit() else 1)