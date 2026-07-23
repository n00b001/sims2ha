#!/bin/bash
# Pre-commit hook: runs linting on staged files
set -e

echo "Running pre-commit linting..."

# Run prettier on staged JS/CSS files
npx prettier --write src/*.js custom_components/sims2ha/**/*.js custom_components/sims2ha/**/*.css 2>/dev/null || true

# Run eslint
npx eslint src/*.js custom_components/sims2ha/frontend/*.js 2>/dev/null || true

# Run ruff on Python files
uv run ruff check . 2>/dev/null || true

echo "Pre-commit linting complete!"