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

    # We need to check the base themes: sims2-light and sims2-dark
    # Also note that the theme might have a 'sims2' key with modes that are aliases
    # We'll update the anchors: sims2-light and sims2-dark

    # Get the sets of variables for each mode
    light_vars = set(theme.get("sims2-light", {}).keys())
    dark_vars = set(theme.get("sims2-dark", {}).keys())

    # Remove the '--' prefix from each document variable to match theme keys
    doc_vars_no_dash = {var[2:] for var in doc_vars}  # remove first two characters '--'

    # Find missing in light and dark
    missing_in_light = doc_vars_no_dash - light_vars
    missing_in_dark = doc_vars_no_dash - dark_vars

    # We'll add the missing variables to both light and dark with a placeholder value
    placeholder = "#000000"

    for var in missing_in_light:
        theme["sims2-light"][var] = placeholder

    for var in missing_in_dark:
        theme["sims2-dark"][var] = placeholder

    # Also, if there's a 'sims2' key with modes, we don't need to update it because it uses aliases
    # But we'll leave it as is.

    save_theme(theme, theme_file)


if __name__ == "__main__":
    main()
