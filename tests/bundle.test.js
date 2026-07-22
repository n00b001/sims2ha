/**
 * Integration checks: the built bundle must stay syntactically valid and the
 * theme-variable coverage audit must report zero missing variables.
 *
 * Each check shells out once (single command, no chaining) via execSync.
 */

const { execSync } = require("node:child_process");
const assert = require("node:assert");
const test = require("node:test");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

test("built sims2-bundle.js is syntactically valid JavaScript", () => {
  const bundle = path.join(
    ROOT,
    "custom_components",
    "sims2ha",
    "frontend",
    "sims2-bundle.js"
  );
  // node --check parses without executing; exit 0 means the bundle is valid JS.
  execSync(`node --check ${JSON.stringify(bundle)}`, { stdio: "pipe" });
});

test("theme-variable audit reports Missing: 0", () => {
  const out = execSync("uv run python scripts/audit_theme_variables.py", {
    cwd: ROOT,
    stdio: ["pipe", "pipe", "pipe"],
  }).toString();
  assert.match(out, /Missing: 0/);
});
