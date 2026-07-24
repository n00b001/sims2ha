#!/usr/bin/env node
/**
 * render-cards.js — Render all Sims 2 custom Lovelace cards to screenshots.
 *
 * Creates an HTML page that loads the sims2-bundle.js, instantiates each card
 * with sample configs (mocking the Home Assistant `hass` object), then uses
 * Playwright to capture a screenshot of every card on the page.
 *
 * Usage: node scripts/render-cards.js [bundlePath] [outputDir]
 *   bundlePath  — path to sims2-bundle.js (default: custom_components/sims2ha/frontend/sims2-bundle.js)
 *   outputDir   — directory for screenshots (default: artifacts/cards)
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// ------------------------------------------------------------------ config
const BUNDLE_PATH =
  process.argv[2] || "custom_components/sims2ha/frontend/sims2-bundle.js";
const OUTPUT_DIR =
  process.argv[3] || path.join(__dirname, "..", "artifacts", "cards");

// Minimal Home Assistant stub that Lovelace cards expect.
function makeHass(states) {
  return { states: states || {} };
}

// Sample entity states for cards that need them.
const SAMPLE_STATES = {
  "sensor.living_room_temperature": { state: "22" },
  "sensor.main_power_draw": { state: "3500" },
  "sensor.battery_level": { state: "78" },
  "climate.living_room": { state: "heat" },
  "light.lamp": { state: "on" },
};

// ------------------------------------------------------------------- pages
const PAGES = [
  {
    title: "All Cards Overview",
    cards: [
      // --- Plumbob card (mood indicator) ---
      {
        name: "plumbob-card",
        type: "sims2-plumbob",
        config: {
          entity: "sensor.battery_level",
          mood: "green",
          size: 100,
        },
        hass: makeHass(SAMPLE_STATES),
      },
      // --- Plumbob card — red mood ---
      {
        name: "plumbob-card-red",
        type: "sims2-plumbob",
        config: {
          entity: "sensor.battery_level",
          mood: "red",
          size: 100,
        },
        hass: makeHass(SAMPLE_STATES),
      },
      // --- Loading card (default) ---
      {
        name: "loading-card",
        type: "sims2-loading",
        config: {
          fullscreen: false,
          message: "Reticulating Splines…",
        },
        hass: makeHass(SAMPLE_STATES),
      },
      // --- Loading card (fullscreen) ---
      {
        name: "loading-card-fullscreen",
        type: "sims2-loading",
        config: {
          fullscreen: true,
          message: "Loading Pleasantview…",
        },
        hass: makeHass(SAMPLE_STATES),
      },
      // --- Divider (green) ---
      {
        name: "divider-green",
        type: "sims2-divider",
        config: { mood: "green", size: 40 },
        hass: null,
      },
      // --- Divider (yellow) ---
      {
        name: "divider-yellow",
        type: "sims2-divider",
        config: { mood: "yellow", size: 40 },
        hass: null,
      },
      // --- Divider (red) ---
      {
        name: "divider-red",
        type: "sims2-divider",
        config: { mood: "red", size: 40 },
        hass: null,
      },
      // --- Gauge (green — low value) ---
      {
        name: "gauge-green",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "Power Draw",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "1200" } }),
      },
      // --- Gauge (yellow — mid value) ---
      {
        name: "gauge-yellow",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "Power Draw",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "4500" } }),
      },
      // --- Gauge (red — high value) ---
      {
        name: "gauge-red",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "Power Draw",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "9200" } }),
      },
      // --- Panel (green mood) ---
      {
        name: "panel-green",
        type: "sims2-panel",
        config: {
          title: "Living Room",
          icon: "sims2:cheerful",
          entity: "climate.living_room",
          green_above: 70,
          yellow_above: 33,
          children: [
            {
              title: "Thermostat",
              type: "entities",
              entities: ["climate.living_room"],
            },
          ],
        },
        hass: makeHass(SAMPLE_STATES),
      },
    ],
  },
  {
    title: "Gauge Detail",
    cards: [
      {
        name: "gauge-low",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "Low Power",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "500" } }),
      },
      {
        name: "gauge-mid",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "Mid Power",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "4500" } }),
      },
      {
        name: "gauge-high",
        type: "sims2-gauge",
        config: {
          entity: "sensor.main_power_draw",
          name: "High Power",
          unit: " W",
          min: 0,
          max: 10000,
          severity: { green: 2000, yellow: 5000, red: 8000 },
        },
        hass: makeHass({ "sensor.main_power_draw": { state: "9200" } }),
      },
    ],
  },
  {
    title: "Panel Detail",
    cards: [
      {
        name: "panel-green",
        type: "sims2-panel",
        config: {
          title: "Living Room",
          icon: "sims2:cheerful",
          entity: "climate.living_room",
          green_above: 70,
          yellow_above: 33,
          children: [
            {
              title: "Thermostat",
              type: "entities",
              entities: ["climate.living_room"],
            },
            { title: "Lights", type: "entities", entities: ["light.lamp"] },
          ],
        },
        hass: makeHass(SAMPLE_STATES),
      },
      {
        name: "panel-yellow",
        type: "sims2-panel",
        config: {
          title: "Kitchen",
          icon: "sims2:hungry",
          entity: "sensor.kitchen_temperature",
          green_above: 70,
          yellow_above: 33,
          children: [
            {
              title: "Fridge",
              type: "entities",
              entities: ["sensor.kitchen_temperature"],
            },
          ],
        },
        hass: makeHass({
          "sensor.kitchen_temperature": { state: "45" },
          "climate.living_room": { state: "cooling" },
          "light.lamp": { state: "on" },
        }),
      },
      {
        name: "panel-red",
        type: "sims2-panel",
        config: {
          title: "Security",
          icon: "sims2:security",
          entity: "sensor.front_door",
          green_above: 70,
          yellow_above: 33,
          children: [
            {
              title: "Front Door",
              type: "entities",
              entities: ["sensor.front_door"],
            },
          ],
        },
        hass: makeHass({
          "sensor.front_door": { state: "unavailable" },
          "climate.living_room": { state: "off" },
          "light.lamp": { state: "off" },
        }),
      },
    ],
  },
];

// ----------------------------------------------------------------- HTML builder
function buildHtml(page) {
  const cardEls = page.cards
    .map((c) => `<div class="card-snapshot" id="${c.name}"></div>`)
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${page.title}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background: #0E1628;
      font-family: "Benguiat Gothic", system-ui, sans-serif;
      color: #EAF2FB;
    }
    h1 {
      text-align: center;
      font-size: 22px;
      margin: 0 0 20px 0;
      color: #E0B66B;
      letter-spacing: 0.04em;
    }
    .card-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-bottom: 28px;
    }
    .card-snapshot {
      background: #fff;
      border-radius: 16px;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    ha-card {
      display: block !important;
    }
  </style>
</head>
<body>
  <h1>${page.title}</h1>
  <div class="card-row">${cardEls}</div>
  <script src="sims2-bundle.js"></script>
  <script>
    // Wait for bundle to register all custom elements, then instantiate cards.
    window.addEventListener("load", () => {
      const waitMs = 800;
      setTimeout(() => {
        ${page.cards
          .map(
            (c) => `
          (function () {
            const container = document.getElementById("${c.name}");
            if (!container) return;

            // Create card element (registered as e.g. "sims2-plumbob", not "custom:sims2-plumbob")
            const card = document.createElement("${c.type}");
            card.setAttribute("type", "custom:${c.type}");
            card.setConfig(${JSON.stringify(c.config)});
            container.appendChild(card);

            // Provide Home Assistant context (null for cards that don't need it)
            if (${c.hass !== null}) {
              card.hass = ${JSON.stringify(c.hass)};
            }
          })();`,
          )
          .join("")}
      }, waitMs);
    });
  </script>
</body>
</html>`;
}

// ------------------------------------------------------------------- main
async function main() {
  // Resolve bundle path.
  const absBundle = path.resolve(BUNDLE_PATH);
  if (!fs.existsSync(absBundle)) {
    console.error(`Bundle not found: ${absBundle}`);
    process.exit(1);
  }

  // Create output directory and copy bundle there.
  const absOutput = path.resolve(OUTPUT_DIR);
  fs.mkdirSync(absOutput, { recursive: true });
  const outBundle = path.join(absOutput, "sims2-bundle.js");
  fs.writeFileSync(outBundle, fs.readFileSync(absBundle));

  console.log(`Bundle: ${absBundle}`);
  console.log(`Output: ${absOutput}`);

  // Start headless browser.
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 1100 },
    deviceScaleFactor: 2, // retina-quality screenshots
  });
  const page = await context.newPage();

  // Capture console errors.
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`[browser] ${msg.text()}`);
    }
  });

  let screenshotCount = 0;
  const results = [];

  for (let i = 0; i < PAGES.length; i++) {
    const pageData = PAGES[i];
    const htmlPath = path.join(absOutput, `preview-${i}.html`);
    fs.writeFileSync(htmlPath, buildHtml(pageData));

    const fileUrl = "file://" + htmlPath;
    await page.goto(fileUrl, { waitUntil: "networkidle", timeout: 15000 });

    // Wait for shadow DOM cards to attach and render.
    await page.waitForTimeout(2000);

    const filename = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const screenshotPath = path.join(absOutput, `${filename}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    screenshotCount++;
    results.push(`${pageData.title} → ${screenshotPath}`);
  }

  await browser.close();
  console.log(`\nCaptured ${screenshotCount} screenshots:`);
  for (const r of results) {
    console.log(`  ${r}`);
  }
}

main().catch((err) => {
  console.error("Render failed:", err.message);
  process.exit(1);
});
