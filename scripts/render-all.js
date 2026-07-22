#!/usr/bin/env node
/**
 * render-all.js — Render ALL Sims 2 theme screenshots for the pre-push hook.
 *
 * Covers: custom cards (via render-cards.js), settings, login, icons, HA built-in screens, animations.
 *
 * Usage: node scripts/render-all.js [outputDir]
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { chromium } = require("playwright");

// --------------------------------------------------------------- configuration
const OUTPUT_DIR  = process.argv[2] || path.join(__dirname, "..", "artifacts");
const REPO_ROOT   = path.resolve(__dirname, "..");
const SRC_DIR     = path.join(REPO_ROOT, "src");
const BUNDLE_SRC  = path.join(REPO_ROOT, "custom_components", "sims2ha", "frontend", "sims2-bundle.js");

// --------------------------------------------------------------- helpers
function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function readCss(file) {
  return fs.readFileSync(path.join(SRC_DIR, file), "utf8");
}

function buildPage(title, body, extraScripts) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; font-family: "Benguiat Gothic", system-ui, sans-serif; background: #0E2A44; color: #FFF6E0; }
</style>
<style>${readCss("sims2-overrides.css")}</style>
<style>${readCss("sims2-theme.css")}</style>
</head>
<body>
${body}
<script src="sims2-bundle.js"></script>
${extraScripts || ""}
</body>
</html>`;
}

// ================================================================ SETTINGS PAGE
function buildSettingsPage() {
  const body = `
<home-assistant>
  <app-drawer-slot>
    <app-header>
      <app-toolbar class="header-toolbar">
        <paper-icon-button icon="hass:menu"></paper-icon-button>
        <span class="title" style="color:#FFF6E0;font-size:18px;letter-spacing:0.04em;text-transform:uppercase;">Settings</span>
      </app-toolbar>
    </app-header>
  </app-drawer-slot>
  <div style="padding:24px;max-width:700px;margin:0 auto;">
    <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">Configuration</h2>
    <ha-card style="margin-bottom:16px;padding:16px;">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 8px;border-bottom:1px solid rgba(224,182,107,0.15);">
        <ha-svg-icon style="color:#E0B66B;width:32px;height:32px;"></ha-svg-icon>
        <div><strong style="color:#FFF6E0;">Users</strong><br><small style="color:#8AA4BC;">Manage user accounts and permissions</small></div>
      </div>
    </ha-card>
    <ha-card style="margin-bottom:16px;padding:16px;">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 8px;border-bottom:1px solid rgba(224,182,107,0.15);">
        <ha-svg-icon style="color:#E0B66B;width:32px;height:32px;"></ha-svg-icon>
        <div><strong style="color:#FFF6E0;">Z-Wave</strong><br><small style="color:#8AA4BC;">Configure Z-Wave network and devices</small></div>
      </div>
    </ha-card>
    <ha-card style="margin-bottom:16px;padding:16px;">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 8px;border-bottom:1px solid rgba(224,182,107,0.15);">
        <ha-svg-icon style="color:#E0B66B;width:32px;height:32px;"></ha-svg-icon>
        <div><strong style="color:#FFF6E0;">Integrations</strong><br><small style="color:#8AA4BC;">View and manage connected integrations</small></div>
      </div>
    </ha-card>
    <ha-card style="margin-bottom:16px;padding:16px;">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 8px;border-bottom:1px solid rgba(224,182,107,0.15);">
        <ha-svg-icon style="color:#E0B66B;width:32px;height:32px;"></ha-svg-icon>
        <div><strong style="color:#FFF6E0;">System</strong><br><small style="color:#8AA4BC;">Hardware, network, and updates</small></div>
      </div>
    </ha-card>
    <ha-card style="margin-bottom:16px;padding:16px;">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 8px;">
        <ha-svg-icon style="color:#E0B66B;width:32px;height:32px;"></ha-svg-icon>
        <div><strong style="color:#FFF6E0;">Dashboards</strong><br><small style="color:#8AA4BC;">Manage dashboards and views</small></div>
      </div>
    </ha-card>
  </div>
</home-assistant>`;

  return { title: "Settings Page", body, extraScripts: null };
}

// ================================================================ LOGIN PAGE
function buildLoginPage() {
  const body = `
<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:transparent;">
  <ha-login-card style="max-width:380px;width:100%;">
    <div class="login-brand" style="text-align:center;margin-bottom:24px;">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpolygon points='50,5 95,50 50,95 5,50' fill='%237BC942'/%3E%3C/svg%3E" style="width:64px;height:64px;border-radius:50%;box-shadow:0 0 16px rgba(123,201,66,0.4);" alt="Plumbob">
      <h1 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;text-shadow:0 1px 3px rgba(224,182,107,0.4);letter-spacing:0.06em;margin-top:12px;">Home Assistant</h1>
    </div>
    <div class="card-content">
      <ha-textfield outlined label="Username" placeholder="Enter your username" style="width:100%;margin-bottom:16px;"></ha-textfield>
      <ha-textfield outlined label="Password" type="password" placeholder="Enter your password" style="width:100%;margin-bottom:16px;"></ha-textfield>
      <div style="text-align:center;">
        <button style="background:linear-gradient(180deg,#9CE04A 0%,#7BC942 40%,#5BA832 100%);border-radius:8px;padding:12px 32px;border:1px solid #4E9A26;color:#0E2A44;font-weight:600;font-family:'Benguiat Gothic',system-ui,sans-serif;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;">
          Sign In
        </button>
      </div>
    </div>
  </ha-login-card>
</div>`;

  return { title: "Login Page", body, extraScripts: null };
}

// ================================================================ ICONS PAGE
function buildIconsPage() {
  const iconDefs = [
    { name: "Plumbob", svg: `<svg viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill="url(#plumGrad)"/><defs><linearGradient id="plumGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#B7F36B"/><stop offset="35%" stop-color="#7BC942"/><stop offset="55%" stop-color="#4E9A26"/><stop offset="100%" stop-color="#2F6B12"/></linearGradient></defs></svg>` },
    { name: "Cheerful", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 14 Q12 8 16 14" stroke="#7BC942" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="1.5" fill="#4A3320"/><circle cx="15" cy="10" r="1.5" fill="#4A3320"/></svg>` },
    { name: "Hungry", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 14 Q10 12 12 14 Q14 12 16 14" stroke="#7BC942" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="1.5" fill="#4A3320"/><circle cx="15" cy="10" r="1.5" fill="#4A3320"/></svg>` },
    { name: "Dizzy", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 10 L9 12 M10 8 L11 10 M14 8 L13 10 M16 10 L15 12" stroke="#7BC942" stroke-width="1.5"/><circle cx="9" cy="10" r="1.5" fill="#4A3320"/><circle cx="15" cy="10" r="1.5" fill="#4A3320"/></svg>` },
    { name: "Security", svg: `<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 8V6a4 4 0 018 0v2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="14" r="2" fill="#7BC942"/></svg>` },
    { name: "Sleepy", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 12 Q9.5 11 11 12 Q12.5 13 14 12 Q15.5 11 17 12" stroke="#7BC942" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="1.5" fill="#4A3320"/><circle cx="15" cy="10" r="1.5" fill="#4A3320"/></svg>` },
    { name: "Light", svg: `<svg viewBox="0 0 24 24"><path d="M9 21h6v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-2.3C17.8 13.5 19 11.4 19 9c0-3.9-3.1-7-7-7z" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M12 2v4M8 6l2 2M16 6l-2 2" stroke="#E0B66B" stroke-width="1.5"/></svg>` },
    { name: "Thermostat", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="8" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M12 6 L12 14" stroke="#7BC942" stroke-width="2.5"/><circle cx="12" cy="14" r="2" fill="#E0B66B"/></svg>` },
    { name: "Door", svg: `<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="1" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="16" cy="12" r="1.5" fill="#7BC942"/><path d="M5 8h14" stroke="#E0B66B" stroke-width="1"/></svg>` },
    { name: "Window", svg: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="#E0B66B" stroke-width="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="#E0B66B" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="21" stroke="#E0B66B" stroke-width="1.5"/></svg>` },
    { name: "Lock", svg: `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 11V7a4 4 0 018 0v4" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="16" r="1.5" fill="#7BC942"/></svg>` },
    { name: "Unlock", svg: `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M8 11V7a4 4 0 017 0" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="16" r="1.5" fill="#E0B66B"/></svg>` },
    { name: "Fan", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M12 9Q8 3 6 6 Q7 10 12 9Z" fill="#E0B66B" opacity="0.5"/><path d="M15 12Q21 8 18 6 Q14 7 15 12Z" fill="#E0B66B" opacity="0.5"/><path d="M9 15Q3 18 6 20 Q9 17 9 15Z" fill="#E0B66B" opacity="0.5"/><path d="M9 9Q3 12 6 10 Q9 13 9 9Z" fill="#E0B66B" opacity="0.5"/></svg>` },
    { name: "Speaker", svg: `<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="8" r="4" fill="none" stroke="#7BC942" stroke-width="1.5"/><path d="M16 12 Q20 12 20 16 Q20 20 16 20" fill="none" stroke="#E0B66B" stroke-width="1.5"/></svg>` },
    { name: "Camera", svg: `<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="#7BC942" stroke-width="1.5"/><circle cx="18" cy="9" r="1" fill="#7BC942"/></svg>` },
    { name: "Power", svg: `<svg viewBox="0 0 24 24"><path d="M12 2 L12 12" stroke="#7BC942" stroke-width="3" stroke-linecap="round"/><path d="M18 6 A8 8 0 1 1 6 6" fill="none" stroke="#E0B66B" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    { name: "Network", svg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="3" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="6" cy="18" r="3" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="18" cy="18" r="3" fill="none" stroke="#E0B66B" stroke-width="1.5"/><line x1="12" y1="9" x2="6" y2="15" stroke="#E0B66B" stroke-width="1.5"/><line x1="12" y1="9" x2="18" y2="15" stroke="#E0B66B" stroke-width="1.5"/></svg>` },
    { name: "Battery", svg: `<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><rect x="20" y="11" width="2" height="4" rx="0.5" fill="#E0B66B"/><rect x="7" y="10" width="4" height="6" rx="1" fill="#7BC942"/><rect x="13" y="10" width="4" height="6" rx="1" fill="#E0B66B"/></svg>` },
    { name: "Temperature", svg: `<svg viewBox="0 0 24 24"><path d="M14 2v12a5 5 0 1 1-4 0V2" fill="none" stroke="#E0B66B" stroke-width="1.5"/><circle cx="12" cy="17" r="3" fill="none" stroke="#E0B66B" stroke-width="1.5"/><rect x="11" y="8" width="2" height="6" rx="1" fill="#7BC942"/></svg>` },
    { name: "Water", svg: `<svg viewBox="0 0 24 24"><path d="M12 2 Q6 10 6 15 A6 6 0 1 0 18 15 Q18 10 12 2Z" fill="none" stroke="#E0B66B" stroke-width="1.5"/><path d="M10 16 Q12 13 14 16" stroke="#7BC942" stroke-width="1.5" fill="none"/></svg>` },
  ];

  const iconsHtml = iconDefs.map((ic) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px;">
      <div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:rgba(14,42,68,0.6);border:2px solid rgba(224,182,107,0.35);border-radius:50%;">${ic.svg}</div>
      <span style="color:#E0B66B;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-family:'Benguiat Gothic',Georgia,serif;">${esc(ic.name)}</span>
    </div>`).join("\n");

  const body = `
<div style="padding:24px;max-width:800px;margin:0 auto;">
  <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">Sims 2 Icon Collection</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-top:16px;">${iconsHtml}</div>
</div>`;

  return { title: "Sims 2 Icons", body, extraScripts: null };
}

// ================================================================ HA BUILT-IN SCREENS
function buildLogbookPage() {
  const body = `
<div style="padding:24px;max-width:700px;margin:0 auto;">
  <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">Logbook</h2>
  <ha-logbook style="display:block;margin-top:16px;">
    <div style="padding:12px 0;border-bottom:1px solid rgba(224,182,107,0.15);">
      <span style="color:#E0B66B;font-size:12px;">10:32 AM</span>
      <div style="color:#4A3320;margin-top:4px;">Living Room lamp turned <strong style="color:#7BC942;">on</strong></div>
    </div>
    <div style="padding:12px 0;border-bottom:1px solid rgba(224,182,107,0.15);">
      <span style="color:#E0B66B;font-size:12px;">9:15 AM</span>
      <div style="color:#4A3320;margin-top:4px;">Thermostat changed to <strong style="color:#7BC942;">heat</strong> mode</div>
    </div>
    <div style="padding:12px 0;border-bottom:1px solid rgba(224,182,107,0.15);">
      <span style="color:#E0B66B;font-size:12px;">8:00 AM</span>
      <div style="color:#4A3320;margin-top:4px;">Front door <strong style="color:#7BC942;">locked</strong></div>
    </div>
    <div style="padding:12px 0;">
      <span style="color:#E0B66B;font-size:12px;">7:45 AM</span>
      <div style="color:#4A3320;margin-top:4px;">Kitchen motion detected</div>
    </div>
  </ha-logbook>
</div>`;

  return { title: "Logbook Page", body, extraScripts: null };
}

function buildHistoryPage() {
  const body = `
<div style="padding:24px;max-width:700px;margin:0 auto;">
  <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">History</h2>
  <ha-history style="display:block;margin-top:16px;background:linear-gradient(180deg,#7EC8E6 0%,#5BAEDC 100%);border:1.5px solid rgba(224,182,107,0.45);border-radius:12px;padding:16px;">
    <div style="height:200px;background:rgba(224,182,107,0.08);border:1px solid rgba(224,182,107,0.25);border-radius:8px;position:relative;overflow:hidden;">
      <svg style="position:absolute;top:0;left:0;width:100%;height:100%;" viewBox="0 0 600 200">
        <polyline points="0,180 50,170 100,160 150,140 200,120 250,130 300,100 350,90 400,80 450,85 500,60 550,70 600,50" fill="none" stroke="#7BC942" stroke-width="2"/>
        <polyline points="0,160 50,155 100,150 150,145 200,160 250,170 300,165 350,150 400,140 450,145 500,130 550,120 600,110" fill="none" stroke="#E0B66B" stroke-width="2"/>
        <text x="10" y="20" fill="#7BC942" font-size="12" font-family="'Benguiat Gothic',Georgia,serif">Temperature</text>
        <text x="100" y="20" fill="#E0B66B" font-size="12" font-family="'Benguiat Gothic',Georgia,serif">Power Draw</text>
      </svg>
    </div>
  </ha-history>
</div>`;

  return { title: "History Page", body, extraScripts: null };
}

function buildStatesPage() {
  const body = `
<div style="padding:24px;max-width:700px;margin:0 auto;">
  <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">States</h2>
  <div style="margin-top:16px;">
    <ha-card style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#4A3320;">light.lamp</span>
      <span style="color:#7BC942;font-weight:600;">on</span>
    </ha-card>
    <ha-card style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#4A3320;">climate.living_room</span>
      <span style="color:#7BC942;font-weight:600;">heat</span>
    </ha-card>
    <ha-card style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#4A3320;">sensor.battery_level</span>
      <span style="color:#4A3320;">78%</span>
    </ha-card>
    <ha-card style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#4A3320;">sensor.front_door</span>
      <span style="color:#7BC942;font-weight:600;">locked</span>
    </ha-card>
    <ha-card style="padding:12px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#4A3320;">fan.ceiling</span>
      <span style="color:#7BC942;font-weight:600;">on</span>
    </ha-card>
  </div>
</div>`;

  return { title: "States Page", body, extraScripts: null };
}

function buildDeveloperToolsPage() {
  const body = `
<div style="padding:24px;max-width:700px;margin:0 auto;">
  <h2 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:2px solid rgba(224,182,107,0.3);padding-bottom:8px;margin-top:0;">Developer Tools</h2>
  <div style="display:flex;gap:0;margin:16px 0;border-bottom:2px solid rgba(224,182,107,0.4);">
    <span style="padding:8px 16px;color:#E0B66B;border-bottom:3px solid #C49A3C;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.04em;">Services</span>
    <span style="padding:8px 16px;color:#D4C4A8;">Templates</span>
    <span style="padding:8px 16px;color:#D4C4A8;">States</span>
    <span style="padding:8px 16px;color:#D4C4A8;">YAML</span>
    <span style="padding:8px 16px;color:#D4C4A8;">Events</span>
    <span style="padding:8px 16px;color:#D4C4A8;">Options</span>
  </div>
  <ha-card style="padding:16px;margin-top:8px;">
    <h3 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.04em;margin-top:0;">Service Call</h3>
    <ha-textfield outlined label="Domain" placeholder="light" style="width:48%;margin-right:4%;"></ha-textfield>
    <ha-textfield outlined label="Service" placeholder="turn_on" style="width:48%;"></ha-textfield>
    <div style="margin-top:16px;">
      <button style="background:linear-gradient(180deg,#9CE04A 0%,#7BC942 40%,#5BA832 100%);border-radius:8px;padding:10px 24px;border:1px solid #4E9A26;color:#0E2A44;font-weight:600;font-family:'Benguiat Gothic',system-ui,sans-serif;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;">Call Service</button>
    </div>
  </ha-card>
  <ha-card style="padding:16px;margin-top:12px;">
    <h3 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.04em;margin-top:0;">Response</h3>
    <pre style="color:#4A3320;font-size:13px;background:rgba(14,42,68,0.1);padding:12px;border-radius:8px;border:1px solid rgba(224,182,107,0.2);">Service successfully called</pre>
  </ha-card>
</div>`;

  return { title: "Developer Tools Page", body, extraScripts: null };
}

// ================================================================ ANIMATION FRAMES
function buildAnimationFrames() {
  const states = [
    { label: "Frame 1 — Before Change", color: "#7A5A38" },
    { label: "Frame 2 — Flash Active",  color: "#7BC942" },
    { label: "Frame 3 — Settled",        color: "#7BC942" },
  ];

  return states.map((s) => {
    const body = `
<div style="padding:24px;max-width:500px;margin:0 auto;">
  <h3 style="color:#E0B66B;font-family:'Benguiat Gothic',Georgia,serif;letter-spacing:0.06em;margin-top:0;text-align:center;">${esc(s.label)}</h3>
  <ha-card style="padding:16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
    <span style="color:#4A3320;">light.lamp</span>
    <span style="color:${s.color};font-weight:600;font-size:16px;">on</span>
  </ha-card>
  <ha-card style="padding:16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
    <span style="color:#4A3320;">climate.living_room</span>
    <span style="color:${s.color};font-weight:600;font-size:16px;">heat</span>
  </ha-card>
  <ha-card style="padding:16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
    <span style="color:#4A3320;">sensor.front_door</span>
    <span style="color:${s.color};font-weight:600;font-size:16px;">locked</span>
  </ha-card>
  <div style="text-align:center;margin-top:16px;">
    <span style="color:#E0B66B;font-size:12px;letter-spacing:0.04em;">Plumbob pulse animation active on all entities</span>
  </div>
</div>`;

    return { title: s.label, body, extraScripts: null };
  });
}

// ================================================================ MAIN RENDERER
async function main() {
  // --- Build bundle first (same as pre-push hook) ---
  const bundleBuildDir = path.join(REPO_ROOT, "custom_components", "sims2ha", "frontend");
  fs.mkdirSync(bundleBuildDir, { recursive: true });

  console.log("Building bundle...");
  try {
    execSync("./build.sh", { cwd: REPO_ROOT, stdio: "inherit" });
  } catch (e) {
    console.error("Bundle build failed. Aborting.");
    process.exit(1);
  }

  if (!fs.existsSync(BUNDLE_SRC)) {
    console.error(`Bundle not found: ${BUNDLE_SRC}`);
    process.exit(1);
  }

  // --- Create output directories ---
  const cardsDir = path.join(OUTPUT_DIR, "cards");
  const screenshotsDir = path.join(OUTPUT_DIR, "screenshots");
  fs.mkdirSync(cardsDir, { recursive: true });
  fs.mkdirSync(screenshotsDir, { recursive: true });

  // Copy bundle into every dir the rendered HTML pages live in. Each page
  // references the bundle with a relative <script src="sims2-bundle.js">, so it
  // must sit beside the HTML — including the animations/ subdir.
  const cardBundle   = path.join(cardsDir, "sims2-bundle.js");
  const screenshotBundle = path.join(screenshotsDir, "sims2-bundle.js");
  const animationsDir = path.join(screenshotsDir, "animations");
  fs.mkdirSync(animationsDir, { recursive: true });
  const bundleBytes = fs.readFileSync(BUNDLE_SRC);
  fs.writeFileSync(cardBundle, bundleBytes);
  fs.writeFileSync(screenshotBundle, bundleBytes);
  fs.writeFileSync(path.join(animationsDir, "sims2-bundle.js"), bundleBytes);

  console.log(`Output: ${OUTPUT_DIR}`);

  // --- Step 1: Render custom cards via existing render-cards.js ---
  console.log("\n=== Custom Cards (render-cards.js) ===");
  const rcJs = path.join(__dirname, "render-cards.js");
  try {
    execSync(`node "${rcJs}"`, { cwd: REPO_ROOT, stdio: "inherit" });
    console.log("Custom cards rendered OK.");
  } catch (e) {
    console.warn("Custom card render failed — continuing with remaining pages.");
  }

  // --- Step 2: Additional screenshot pages ---
  const extraPages = [
    { builder: buildSettingsPage, subDir: screenshotsDir },
    { builder: buildLoginPage,    subDir: screenshotsDir },
    { builder: buildIconsPage,    subDir: screenshotsDir },
    { builder: buildLogbookPage,  subDir: screenshotsDir },
    { builder: buildHistoryPage,  subDir: screenshotsDir },
    { builder: buildStatesPage,   subDir: screenshotsDir },
    { builder: buildDeveloperToolsPage, subDir: screenshotsDir },
  ];

  console.log("\n=== Additional Screenshots ===");
  const animFrames = buildAnimationFrames();
  for (const af of animFrames) {
    extraPages.push({ builder: () => af, subDir: path.join(screenshotsDir, "animations") });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") console.error(`[browser] ${msg.text()}`);
  });

  let screenshotCount = 0;
  const results = [];

  for (const item of extraPages) {
    try {
      const pageData = item.builder();
      const html = buildPage(pageData.title, pageData.body, pageData.extraScripts);
      const name = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const outDir = item.subDir;
      fs.mkdirSync(outDir, { recursive: true });
      const htmlPath = path.join(outDir, `${name}.html`);
      fs.writeFileSync(htmlPath, html);

      await page.goto("file://" + htmlPath, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1500);

      const s = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: s, fullPage: true });
      results.push(s);
      screenshotCount++;
    } catch (e) {
      console.warn(`Screenshot skip: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`\nTotal additional screenshots: ${screenshotCount}`);
}

main().catch((err) => { console.error("Render failed:", err.message); process.exit(1); });
