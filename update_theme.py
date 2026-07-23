#!/usr/bin/env python3
import re

import yaml


def extract_variables_from_doc(filename):
    """Extract all CSS variable names from the documentation."""
    with open(filename) as f:
        content = f.read()
    # Find all occurrences of -- followed by word characters and hyphens
    # This regex matches --variable-name
    pattern = r"--[\w-]+"
    variables = re.findall(pattern, content)
    # Remove duplicates and return as set
    return set(variables)


def load_theme(filename):
    with open(filename) as f:
        return yaml.safe_load(f)


def save_theme(theme, filename):
    with open(filename, "w") as f:
        yaml.dump(theme, f, default_flow_style=False, sort_keys=False)


def main():
    doc_file = "docs/HA_THEMING_CAPABILITIES.md"
    theme_file = "custom_components/sims2ha/themes/sims2.yaml"

    doc_vars = extract_variables_from_doc(doc_file)

    theme = load_theme(theme_file)

    # With the new structure, we only have sims2 with modes.dark
    # Get the variables from the dark mode
    dark_vars = set(theme.get("sims2", {}).get("modes", {}).get("dark", {}).keys())

    # Remove the '--' prefix from each document variable to match theme keys
    doc_vars_no_dash = {var[2:] for var in doc_vars}  # remove first two characters '--'

    # Find missing in dark mode
    missing_in_dark = doc_vars_no_dash - dark_vars

    # We'll add the missing variables to dark mode with a placeholder value
    placeholder = "#000000"

    for var in missing_in_dark:
        # Navigate to the dark mode section and add the variable
        if "sims2" not in theme:
            theme["sims2"] = {}
        if "modes" not in theme["sims2"]:
            theme["sims2"]["modes"] = {}
        if "dark" not in theme["sims2"]["modes"]:
            theme["sims2"]["modes"]["dark"] = {}
        theme["sims2"]["modes"]["dark"][var] = placeholder

    save_theme(theme, theme_file)


if __name__ == "__main__":
    main()
