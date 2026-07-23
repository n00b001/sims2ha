#!/bin/bash
# Pre-push hook: runs tests and linting before pushing.
# Install: ln -sf ../../scripts/prepush.sh .git/hooks/pre-push
set -e

echo "Running pre-push checks..."

# Run JavaScript tests
npm test

# Run Python tests (skip if no test files exist)
if ls tests/*.py &>/dev/null; then
    uv run pytest
fi

# Run ruff lint check
uv run ruff check .

# Run ruff format check
uv run ruff format --check .

# Build the bundle
if [ -f "./build.sh" ]; then
    echo "Building bundle..."
    ./build.sh
fi

echo "Pre-push checks passed!"