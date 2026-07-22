/**
 * Unit tests for the pure (non-DOM) logic of the Sims 2 custom Lovelace cards.
 *
 * The card sources are vanilla web components that call customElements.define
 * and touch `window` at load time, so they cannot be required verbatim under
 * plain Node. We install minimal global stubs, require the real source file
 * (capturing the class through the customElements.define stub), then build an
 * instance with Object.create() to bypass the DOM-bound constructor and drive
 * the real shipped methods with controlled inputs. No source file is modified
 * and no jsdom or extra dependency is needed.
 */

const assert = require("node:assert");
const test = require("node:test");
const path = require("node:path");

// Load a card source under minimal DOM stubs and return { Klass, instance }.
// `instance` is created without invoking the constructor so it carries no
// shadow root; tests set _config / _hass (and _shadow where needed) by hand.
function loadCard(file, tagName) {
  const registry = {};
  global.HTMLElement = class HTMLElement {};
  global.customElements = { define: (name, cls) => { registry[name] = cls; } };
  global.window = {};

  const full = path.resolve(__dirname, "..", "src", file);
  delete require.cache[require.resolve(full)];
  require(full);

  const Klass = registry[tagName];
  if (!Klass) throw new Error(`custom element "${tagName}" did not register from ${file}`);
  return { Klass, instance: Object.create(Klass.prototype) };
}

// Convenience: a plumbob instance with the standard thresholds pre-filled.
function plumbobWith(overrides) {
  const { instance } = loadCard("sims2-plumbob-card.js", "sims2-plumbob");
  instance._config = {
    entity: "sensor.test",
    mood: "green",
    green_above: 66,
    yellow_above: 33,
    state_map: {},
    ...overrides,
  };
  return instance;
}

// ============================================================ sims2-plumbob
test("plumbob: getCardSize reports 2", () => {
  const { Klass, instance } = loadCard("sims2-plumbob-card.js", "sims2-plumbob");
  assert.equal(instance.getCardSize(), 2);
  assert.deepEqual(Klass.getStubConfig(), { title: "Household Morale", mood: "green", size: 70 });
});

test("plumbob: returns configured mood when no entity is bound", () => {
  const card = plumbobWith({ entity: null, mood: "red" });
  card._hass = { states: {} };
  assert.equal(card._resolveMood(), "red");
});

test("plumbob: falls back to green when no entity and no mood", () => {
  const card = plumbobWith({ entity: null, mood: undefined });
  card._hass = null;
  assert.equal(card._resolveMood(), "green");
});

test("plumbob: missing entity state falls back to configured mood", () => {
  const card = plumbobWith({ mood: "red" });
  card._hass = { states: {} };
  assert.equal(card._resolveMood(), "red");
});

test("plumbob: state_map wins over numeric and heuristic mapping", () => {
  const card = plumbobWith({ state_map: { away: "red" } });
  card._hass = { states: { "sensor.test": { state: "away" } } };
  assert.equal(card._resolveMood(), "red");
});

test("plumbob: numeric state maps by green_above / yellow_above thresholds", () => {
  const card = plumbobWith();
  card._hass = { states: { "sensor.test": { state: "90" } } };
  assert.equal(card._resolveMood(), "green", "90 >= green_above(66)");
  card._hass = { states: { "sensor.test": { state: "50" } } };
  assert.equal(card._resolveMood(), "yellow", "50 >= yellow_above(33) but < green_above");
  card._hass = { states: { "sensor.test": { state: "10" } } };
  assert.equal(card._resolveMood(), "red", "10 < yellow_above");
});

test("plumbob: on-like states map to green", () => {
  const card = plumbobWith();
  for (const state of ["on", "home", "active", "running", "cooling", "heating", "ok"]) {
    card._hass = { states: { "sensor.test": { state } } };
    assert.equal(card._resolveMood(), "green", `state "${state}"`);
  }
});

test("plumbob: warning states map to yellow", () => {
  const card = plumbobWith();
  for (const state of ["idle", "pending", "standby", "paused", "not_home", "away"]) {
    card._hass = { states: { "sensor.test": { state } } };
    assert.equal(card._resolveMood(), "yellow", `state "${state}"`);
  }
});

test("plumbob: off/error states map to red", () => {
  const card = plumbobWith();
  for (const state of ["off", "unavailable", "unknown", "error", "problem"]) {
    card._hass = { states: { "sensor.test": { state } } };
    assert.equal(card._resolveMood(), "red", `state "${state}"`);
  }
});

test("plumbob: unrecognized non-numeric state falls back to configured mood", () => {
  const card = plumbobWith({ mood: "yellow" });
  card._hass = { states: { "sensor.test": { state: "wibbly" } } };
  assert.equal(card._resolveMood(), "yellow");
});

// ============================================================= sims2-gauge
test("gauge: getCardSize reports 3", () => {
  const { instance } = loadCard("sims2-gauge-card.js", "sims2-gauge");
  assert.equal(instance.getCardSize(), 3);
});

test("gauge: _fraction clamps to [0,1] and scales by min/max", () => {
  const { instance } = loadCard("sims2-gauge-card.js", "sims2-gauge");
  instance._config = { min: 0, max: 100 };
  assert.equal(instance._fraction(50), 0.5);
  assert.equal(instance._fraction(150), 1, "clamped high");
  assert.equal(instance._fraction(-10), 0, "clamped low");
  // percent relationship: percent = _fraction(value) * 100, also clamped.
  assert.equal(instance._fraction(25) * 100, 25);
  instance._config = { min: 0, max: 40 };
  assert.equal(instance._fraction(20), 0.5, "respects non-default max");
});

test("gauge: _resolveMood maps value by severity thresholds (boundaries inclusive)", () => {
  const { instance } = loadCard("sims2-gauge-card.js", "sims2-gauge");
  instance._config = { severity: { green: 70, yellow: 40, red: 10 } };
  assert.equal(instance._resolveMood(75), "green");
  assert.equal(instance._resolveMood(70), "green", "green boundary inclusive");
  assert.equal(instance._resolveMood(50), "yellow");
  assert.equal(instance._resolveMood(40), "yellow", "yellow boundary inclusive");
  assert.equal(instance._resolveMood(20), "red");
});

test("gauge: needle angle maps fraction [0,1] to [-330,-150], midpoint straight up", () => {
  const { instance } = loadCard("sims2-gauge-card.js", "sims2-gauge");
  assert.equal(instance._needleAngle(0), -330);
  assert.equal(instance._needleAngle(0.5), -240, "midpoint = straight up");
  assert.equal(instance._needleAngle(1), -150);
});

test("gauge: _resolveValue parses numeric entity state, null otherwise", () => {
  const { instance } = loadCard("sims2-gauge-card.js", "sims2-gauge");
  instance._config = { entity: "sensor.test" };
  instance._hass = { states: { "sensor.test": { state: "42.5" } } };
  assert.equal(instance._resolveValue(), 42.5);
  instance._hass = { states: { "sensor.test": { state: "unavailable" } } };
  assert.equal(instance._resolveValue(), null, "non-numeric -> null");
  instance._hass = null;
  assert.equal(instance._resolveValue(), null, "no hass -> null");
});

// =========================================================== sims2-divider
test("divider: getCardSize reports 1", () => {
  const { Klass, instance } = loadCard("sims2-divider-card.js", "sims2-divider");
  assert.equal(instance.getCardSize(), 1);
  assert.deepEqual(Klass.getStubConfig(), { mood: "green", size: 30 });
});

test("divider: setConfig rejects null config", () => {
  const { instance } = loadCard("sims2-divider-card.js", "sims2-divider");
  instance._shadow = { innerHTML: "" };
  assert.throws(() => instance.setConfig(null), /Invalid configuration/);
});

test("divider: invalid mood is clamped to green", () => {
  const { instance } = loadCard("sims2-divider-card.js", "sims2-divider");
  instance._shadow = { innerHTML: "" };
  instance.setConfig({ mood: "blue" });
  assert.equal(instance._config.mood, "green");
});

test("divider: valid mood is preserved and defaults are merged", () => {
  const { instance } = loadCard("sims2-divider-card.js", "sims2-divider");
  instance._shadow = { innerHTML: "" };
  instance.setConfig({ mood: "red" });
  assert.equal(instance._config.mood, "red");
  assert.equal(instance._config.size, 30, "default size merged in");
});
