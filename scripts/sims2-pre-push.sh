#!/usr/bin/env bash
# Sims 2 bundle builder — no toolchain required, just cat + node (node is only
# used to turn the CSS into a safelisted bundle for HACS).
# Install: cp scripts/sims2-pre-push.sh .git/hooks/pre-push && chmod +x it

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[pre-push]${NC} $*"; }
warn() { echo -e "${YELLOW}[pre-push]${NC} $*"; }
fail() { echo -e "${RED}[pre-push]${NC} $*" >&2; exit 1; }

# --- Guard: is gh available? ---
if ! command -v gh &>/dev/null; then
    fail "gh CLI not found. Install it first."
fi

# --- Guard: is gh-image available? ---
if ! gh extension list 2>/dev/null | grep -q 'gh-image'; then
    warn "gh-image extension not installed. Run: gh extension install drogers0/gh-image"
    exit 0
fi

# --- Guard: are we on a branch with an open PR? ---
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ "$BRANCH" = "HEAD" ]; then
    warn "Detached HEAD — skipping screenshot update."
    exit 0
fi

PR_NUM=$(gh pr list --head "$BRANCH" --state open --json number --jq '.[0].number' 2>/dev/null || true)
if [ -z "$PR_NUM" ]; then
    warn "No open PR found for branch '$BRANCH' — skipping screenshot update."
    exit 0
fi

# --- Fetch current PR description ---
CURRENT_BODY_FILE=$(mktemp)
gh pr view "$PR_NUM" --json body --jq '.body' > "$CURRENT_BODY_FILE"

# --- Build bundle and render ALL screenshots ---
log "Building bundle and rendering all screenshots..."
if ! node scripts/render-all.js; then
    warn "Screenshot render failed — continuing with push (PR description unchanged)."
    rm -f "$CURRENT_BODY_FILE"
    exit 0
fi

# --- Collect all screenshot images ---
IMAGES=()
LABELS=()

# Custom cards
for img in artifacts/cards/all-cards-overview.png artifacts/cards/gauge-detail.png artifacts/cards/panel-detail.png; do
    if [ -f "$img" ]; then
        IMAGES+=("$img")
    fi
done
LABELS=("All Cards Overview — plumbob, loading screen, divider, gauge, panel" "Gauge Detail — green / yellow / red severity states" "Panel Detail — green / yellow / red mood colouring")

# UI pages
for img in artifacts/screenshots/settings-page.png artifacts/screenshots/login-page.png artifacts/screenshots/icons.png; do
    if [ -f "$img" ]; then
        IMAGES+=("$img")
    fi
done
LABELS+=("Settings Page — configuration menu with Sims 2 styling" "Login Page — Sims 2 branded login screen" "Icons — full Sims 2 icon collection (20 icons)")

# HA built-in screens
for img in artifacts/screenshots/logbook-page.png artifacts/screenshots/history-page.png artifacts/screenshots/states-page.png artifacts/screenshots/developer-tools-page.png; do
    if [ -f "$img" ]; then
        IMAGES+=("$img")
    fi
done
LABELS+=("Logbook — activity feed with Sims 2 treatment" "History — sensor graphs in Sims 2 palette" "States — entity state list in Sims 2 cards" "Developer Tools — service call panel with Sims 2 styling")

# Animation frames
for img in artifacts/screenshots/animations/frame-1-before-change.png artifacts/screenshots/animations/frame-2-flash-active.png artifacts/screenshots/animations/frame-3-settled.png; do
    if [ -f "$img" ]; then
        IMAGES+=("$img")
    fi
done
LABELS+=("Animation Frame 1 — state before change" "Animation Frame 2 — green flash active (state-change effect)" "Animation Frame 3 — settled back to normal")

# --- Upload images and collect markdown ---
URL_MD=()
for img in "${IMAGES[@]}"; do
    if [ ! -f "$img" ]; then
        warn "Screenshot not found: $img — skipping."
        continue
    fi
    log "Uploading $img..."
    RESULT=$(gh image "$img" --repo n00b001/sims2ha 2>&1) || {
        warn "Upload failed for $img — continuing with remaining images."
        continue
    }
    URL_MD+=("$RESULT")
done

# --- Build new preview section ---
PREVIEW_SECTION="## Sims 2 Theme Preview

Screenshots of the Sims 2 theme applied across Home Assistant, rendered from this push:

### Custom Cards
${URL_MD[0]:-"[upload failed]"}
${URL_MD[1]:-"[upload failed]"}
${URL_MD[2]:-"[upload failed]"}"

for i in "${!LABELS[@]}"; do
    if [ "$i" -ge 3 ]; then
        PREVIEW_SECTION+="

### ${LABELS[$i]}
${URL_MD[$i]:-"[upload failed]"}"
    fi
done

# --- Replace preview section in PR description or append if not present ---
NEW_BODY_FILE=$(mktemp)

if grep -q "## Sims 2 Theme Preview" "$CURRENT_BODY_FILE"; then
    awk '/^## Sims 2 Theme Preview/{found=1} !found{print}' "$CURRENT_BODY_FILE" > "$NEW_BODY_FILE"
    printf '\n%s\n' "$PREVIEW_SECTION" >> "$NEW_BODY_FILE"
else
    if [ -s "$CURRENT_BODY_FILE" ]; then
        cat "$CURRENT_BODY_FILE" > "$NEW_BODY_FILE"
        printf '\n\n%s\n' "$PREVIEW_SECTION" >> "$NEW_BODY_FILE"
    else
        printf '%s\n' "$PREVIEW_SECTION" > "$NEW_BODY_FILE"
    fi
fi

# --- Update PR description ---
log "Updating PR #$PR_NUM description..."
if ! gh pr edit "$PR_NUM" --body-file "$NEW_BODY_FILE"; then
    warn "Failed to update PR description (push still proceeds)."
fi

# --- Cleanup ---
rm -f "$CURRENT_BODY_FILE" "$NEW_BODY_FILE"

log "Done! Push will proceed."
