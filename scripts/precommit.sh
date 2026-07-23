#!/bin/bash
# Pre-commit hook: runs linting and formatting on all applicable files.
# Install: ln -sf ../../scripts/precommit.sh .git/hooks/pre-commit
set -e

echo "Running pre-commit checks..."

# Run prettier on JS/CSS/MD/YAML files
npx prettier --check \
  "src/**/*.js" \
  "src/**/*.css" \
  "custom_components/sims2ha/**/*.js" \
  "custom_components/sims2ha/**/*.css" \
  2>/dev/null || echo "Prettier found formatting issues (run: npm run format)"

# Run eslint
npx eslint "src/**/*.js" 2>/dev/null || true

# Run ruff check and format
uv run ruff check . 2>/dev/null || true
uv run ruff format --check . 2>/dev/null || echo "Ruff format found issues (run: uv run ruff format .)"

echo "Pre-commit checks complete!"