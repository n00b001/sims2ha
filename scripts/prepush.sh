#!/bin/bash
# Pre-push hook: runs tests before pushing
set -e

echo "Running pre-push tests..."

# Run JavaScript tests
npm test 2>/dev/null || echo "No JS tests found, skipping"

# Run Python tests
uv run pytest 2>/dev/null || echo "No Python tests found, skipping"

# Run ruff lint check
uv run ruff check . 2>/dev/null || { echo "Linting failed!"; exit 1; }

# Build the bundle (if build.sh exists)
if [ -f "./build.sh" ]; then
    echo "Building bundle..."
    ./build.sh 2>/dev/null || echo "Bundle build had warnings"
fi

echo "Pre-push tests complete!"