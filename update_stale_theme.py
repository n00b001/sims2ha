#!/usr/bin/env python3
"""Update a stale user-installed sims2.yaml with the latest shipped theme.

Run this after upgrading the integration to ensure Home Assistant sees only
the single ``sims2`` theme instead of the old ``sims2``, ``sims2-light``,
and ``sims2-dark`` trio.
"""

import sys
from pathlib import Path

PACKAGE_DIR = Path(__file__).parent / "custom_components" / "sims2ha"
THEME_FILE = PACKAGE_DIR / "themes" / "sims2.yaml"


def _write_theme(source: str, target: str) -> None:
    """Write the authoritative theme file to the target path.

    We always overwrite because the shipped theme may define a different set of
    top-level keys than what's currently on disk (for example, removing
    legacy theme anchors like ``sims2-light`` that would otherwise remain
    visible in Home Assistant's theme picker).

    If the user has hand-edited their local copy they can always delete it and
    let the integration reinstall from scratch.
    """
    Path(target).parent.mkdir(parents=True, exist_ok=True)
    Path(target).write_bytes(Path(source).read_bytes())


def main() -> None:
    target_str = sys.argv[1] if len(sys.argv) > 1 else ""
    target = Path(target_str) if target_str else None

    if not target:
        print(  # noqa: T201
            "Usage: python update_stale_theme.py [/path/to/themes/sims2.yaml]\n"
            "  Defaults to:\n"
            "    ~/.homeassistant/themes/sims2.yaml\n"
            "    ~/home-assistant/themes/sims2.yaml\n"
            "  (If multiple exist, the first one wins.)"
        )
        sys.exit(1)

    source = THEME_FILE.read_bytes()
    target.write_bytes(source)


if __name__ == "__main__":
    main()
