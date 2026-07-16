/**
 * sims2-panel-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-panel
 *
 * Authentic Sims 2 live-mode control panel — navy-blue background, gold trim,
 * plumbob mood indicator, horizontal status bars (RBar/MBar/LBar style), and
 * decorative corner rosettes. Entity state drives auto-colouring (green /
 * yellow / red) that tints the plumbob and bar accents.
 *
 * No build step, no dependencies. Vanilla web component, Shadow DOM.
 *
 * Example configuration:
 *
 *   type: custom:sims2-panel
 *   title: Living Room
 *   icon: sims2:cheerful
 *   entity: sensor.living_room_temperature
 *   green_above: 70
 *   yellow_above: 40
 *   children:
 *     - type: entities
 *       entities:
 *         - light.lamp
 *         - climate.thermostat
 *
 * Fan tribute. "The Sims 2" and the plumbob are trademarks of Electronic Arts.
 * ---------------------------------------------------------------------------
 */

const SIMS2_PANEL_DEFAULTS = {
  title: "",
  icon: null,
  entity: null,
  green_above: 66,
  yellow_above: 33,
  children: [],
};

/** Sims 2 mood colours — matches the gauge / divider cards exactly. */
const MOOD_COLORS = {
  green: { main: "#7BC942", glow: "rgba(123,201,66,0.55)", dark: "#4E9A26" },
  yellow: { main: "#F2C14E", glow: "rgba(242,193,78,0.55)", dark: "#C28A1F" },
  red: { main: "#E55B45", glow: "rgba(229,91,69,0.55)", dark: "#B03320" },
};

class Sims2PanelCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._config = { ...SIMS2_PANEL_DEFAULTS };
    this._hass = null;
  }

  static getStubConfig() {
    return { title: "Panel Title" };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration for sims2-panel");
    }
    this._config = { ...SIMS2_PANEL_DEFAULTS, ...config };
    this._render();
  }

  set hass(value) {
    this._hass = value;
    this._update();
  }

  getCardSize() {
    return 3 + (this._config.children || []).length;
  }

  // ------------------------------------------------------------------ mood
  _resolveMood() {
    const cfg = this._config;
    if (!cfg.entity || !this._hass) {
      return "green";
    }
    const stateObj = this._hass.states[cfg.entity];
    if (!stateObj) return "green";

    const state = stateObj.state;

    // Numeric thresholds
    const numeric = parseFloat(state);
    if (!isNaN(numeric)) {
      if (numeric >= cfg.green_above) return "green";
      if (numeric >= cfg.yellow_above) return "yellow";
      return "red";
    }

    // State-map lookup
    if (cfg.state_map && cfg.state_map[state]) {
      return cfg.state_map[state];
    }

    // Sensible fallbacks for common binary-ish states
    const onStates = [
      "on", "home", "active", "running", "cooling", "heating", "ok",
    ];
    const warnStates = [
      "idle", "pending", "standby", "paused", "not_home", "away",
    ];
    const offStates = [
      "off", "unavailable", "unknown", "error", "problem",
    ];
    if (onStates.includes(state)) return "green";
    if (warnStates.includes(state)) return "yellow";
    if (offStates.includes(state)) return "red";
    return "green";
  }

  _update() {
    const panel = this._shadow.getElementById("sims2-panel");
    if (!panel) return;
    const mood = this._resolveMood();
    panel.setAttribute("data-mood", mood);

    // Update plumbob colour.
    const plumbob = this._shadow.querySelector(".sims2-plumbob-face");
    if (plumbob) {
      const mc = MOOD_COLORS[mood];
      plumbob.style.background = `linear-gradient(105deg, ${mc.main} 30%, ${mc.dark} 70%)`;
      plumbob.style.filter = `drop-shadow(0 0 8px ${mc.glow})`;
    }

    // Update status bars.
    this._updateBars(mood);
  }

  _updateBars(mood) {
    const mc = MOOD_COLORS[mood];
    const bars = this._shadow.querySelectorAll(".sims2-bar-fill");
    bars.forEach((bar) => {
      bar.style.background = `linear-gradient(90deg, ${mc.dark} 0%, ${mc.main} 100%)`;
    });
    // Update bar glow on the track.
    const tracks = this._shadow.querySelectorAll(".sims2-bar-track");
    tracks.forEach((track) => {
      track.style.boxShadow = `inset 0 0 3px ${mc.glow}`;
    });
  }

  // --------------------------------------------------------------- rendering
  _render() {
    const cfg = this._config;
    const mood = this._resolveMood();
    const mc = MOOD_COLORS[mood];
    const hasHeader = cfg.title || cfg.icon;
    const childCount = (cfg.children || []).length;

    this._shadow.innerHTML = `
      <style>${Sims2PanelCard._styles(cfg, mood)}</style>
      <div id="sims2-panel" class="sims2-panel" data-mood="${this._escapeAttr(mood)}">

        <!-- Decorative top edge: gold line + corner rosettes -->
        <div class="sims2-panel-topbar">
          <span class="sims2-rosette sims2-rosette-left"></span>
          <span class="sims2-gold-line"></span>
          <span class="sims2-rosette sims2-rosette-right"></span>
        </div>

        <!-- Window header: navy gradient with gold underline -->
        ${hasHeader ? this._renderHeader(cfg) : ""}

        <!-- Plumbob mood indicator + status bars -->
        <div class="sims2-panel-status">
          <div class="sims2-plumbob-wrap">
            <div class="sims2-plumbob-face"></div>
          </div>
          <div class="sims2-bars-group">
            ${this._renderStatusBars(mood)}
          </div>
        </div>

        <!-- Body: child cards -->
        <div class="sims2-panel-body">
          ${childCount > 0 ? this._renderChildren() : '<div class="sims2-panel-empty">Place Home Assistant cards inside this panel.</div>'}
        </div>

        <!-- Decorative bottom edge -->
        <div class="sims2-panel-bottombar">
          <span class="sims2-rosette sims2-rosette-left"></span>
          <span class="sims2-gold-line"></span>
          <span class="sims2-rosette sims2-rosette-right"></span>
        </div>

        <!-- Corner accent circles -->
        <span class="sims2-corner-dot sims2-corner-tl"></span>
        <span class="sims2-corner-dot sims2-corner-tr"></span>
        <span class="sims2-corner-dot sims2-corner-bl"></span>
        <span class="sims2-corner-dot sims2-corner-br"></span>
      </div>
    `;

    this._update();
  }

  _renderHeader(cfg) {
    let iconHtml = "";
    if (cfg.icon) {
      iconHtml = `<span class="sims2-panel-icon">${this._escapeHtml(cfg.icon)}</span>`;
    }
    return `
      <div class="sims2-panel-title-row">
        ${iconHtml}
        ${cfg.title ? `<span class="sims2-panel-title">${this._escapeHtml(cfg.title)}</span>` : ""}
      </div>
    `;
  }

  _renderStatusBars(mood) {
    const barLabels = ["Mood", "Hunger", "Energy"];
    // Use entity state as a pseudo-value, otherwise show neutral fills.
    let pct = 75;
    if (this._hass && this._config.entity) {
      const obj = this._hass.states[this._config.entity];
      if (obj) {
        const v = parseFloat(obj.state);
        if (!isNaN(v)) pct = Math.max(10, Math.min(98, v));
      }
    }
    return barLabels.map((label, i) => {
      // Stagger the bars slightly for visual interest.
      const fillPct = i === 0 ? pct : Math.max(20, pct + (i * 8 - 12));
      return `
        <div class="sims2-bar-row">
          <span class="sims2-bar-label">${label}</span>
          <div class="sims2-bar-track">
            <span class="sims2-bar-fill" style="--bar-pct:${fillPct}%"></span>
          </div>
        </div>`;
    }).join("");
  }

  _renderChildren() {
    const children = this._config.children || [];
    return children
      .map((child, i) => {
        let headerHtml = "";
        if (child.title || child.icon) {
          let iconHtml = "";
          if (child.icon) {
            iconHtml = `<span class="sims2-child-icon">${this._escapeHtml(child.icon)}</span>`;
          }
          headerHtml = `
            <div class="sims2-child-header">
              ${iconHtml}
              ${child.title ? `<span class="sims2-child-title">${this._escapeHtml(child.title)}</span>` : ""}
            </div>`;
        }
        return `
          <div class="sims2-child-card" data-child-index="${i}">
            ${headerHtml}
            <div class="sims2-child-content"></div>
          </div>`;
      })
      .join("");
  }

  // ---------------------------------------------------------------- helpers
  _escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  _escapeAttr(text) {
    return this._escapeHtml(text);
  }

  // ------------------------------------------------------------------ styles
  static _styles(cfg, mood) {
    const hasHeader = cfg.title || cfg.icon;
    const headerHeight = hasHeader ? "38px" : "0";
    const mc = MOOD_COLORS[mood];

    return `
      :host { display: block; }

      /* ===== Panel shell — navy blue, gold border ===== */
      .sims2-panel {
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        background: linear-gradient(175deg, #1A3856 0%, #122A44 40%, #0E2238 100%);
        font-family: var(--sims2-font-display, "Benguiat Gothic", "Fredoka", system-ui, sans-serif);
        color: var(--sims2-espresso, #D4C4A8);
        border: 2px solid transparent;
        background-clip: padding-box;
        box-shadow:
          0 0 0 1px ${mc.main}33,
          0 4px 20px rgba(0, 0, 0, 0.45),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
        transition: box-shadow 0.5s ease;
      }

      /* Gold border via pseudo-element underneath */
      .sims2-panel::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: 16px;
        background: linear-gradient(180deg, #E8D090 0%, #C49A3C 30%, #E0B66B 50%, #A07830 70%, #D4B878 100%);
        z-index: -1;
      }

      /* ===== Subtle dot-grid background ===== */
      .sims2-panel::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 14px;
        opacity: 0.06;
        background-image: radial-gradient(circle, #D4C4A8 1px, transparent 1px);
        background-size: 10px 10px;
        pointer-events: none;
        z-index: 0;
      }

      /* ===== Top / bottom decorative bars ===== */
      .sims2-panel-topbar,
      .sims2-panel-bottombar {
        position: relative;
        display: flex;
        align-items: center;
        height: 14px;
        z-index: 1;
        padding: 0 6px;
      }
      .sims2-panel-topbar { border-bottom: 1px solid rgba(224, 182, 107, 0.25); }
      .sims2-panel-bottombar { border-top: 1px solid rgba(224, 182, 107, 0.25); }

      .sims2-gold-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(224, 182, 107, 0.15) 10%,
          rgba(224, 182, 107, 0.45) 50%,
          rgba(224, 182, 107, 0.15) 90%,
          transparent 100%);
      }

      /* ===== Corner rosettes (circular decorative elements) ===== */
      .sims2-rosette {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        background: radial-gradient(circle at 35% 35%,
          #F0D898 0%,
          #E0B66B 40%,
          #A07830 100%);
        box-shadow:
          0 0 0 1px rgba(160, 120, 48, 0.6),
          inset 0 1px 2px rgba(255, 255, 255, 0.35);
      }

      /* ===== Corner accent dots ===== */
      .sims2-corner-dot {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #F0D898, #C49A3C);
        box-shadow: 0 0 4px rgba(224, 182, 107, 0.4);
        z-index: 2;
      }
      .sims2-corner-tl { top: 5px; left: 5px; }
      .sims2-corner-tr { top: 5px; right: 5px; }
      .sims2-corner-bl { bottom: 5px; left: 5px; }
      .sims2-corner-br { bottom: 5px; right: 5px; }

      /* ===== Window header ===== */
      .sims2-panel-title-row {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        height: ${headerHeight};
        padding: 6px 18px 5px;
        background: linear-gradient(180deg, #1E4470 0%, #142C4A 100%);
        border-bottom: 1px solid rgba(224, 182, 107, 0.35);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: #E8D8BC;
      }
      .sims2-panel-title-row::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          ${mc.main}88 20%,
          #E0B66B 50%,
          ${mc.main}88 80%,
          transparent 100%);
      }
      .sims2-panel-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        font-size: 13px;
        color: var(--sims2-gold, #E0B66B);
      }
      .sims2-panel-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ===== Status section: plumbob + bars ===== */
      .sims2-panel-status {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 18px 10px;
      }

      /* Plumbob diamond */
      .sims2-plumbob-wrap {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Gold circular rim */
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%, #F0D898, #C49A3C 60%, #8A6820);
        box-shadow:
          0 0 0 1.5px rgba(138, 104, 32, 0.7),
          0 0 10px ${mc.glow},
          inset 0 1px 3px rgba(255, 255, 255, 0.2);
        transition: box-shadow 0.5s ease;
      }
      .sims2-plumbob-face {
        width: 18px;
        height: 26px;
        clip-path: polygon(50% 0%, 100% 45%, 50% 100%, 0% 45%);
        background: linear-gradient(105deg, ${mc.main} 30%, ${mc.dark} 70%);
        filter: drop-shadow(0 0 8px ${mc.glow});
        transition: background 0.5s ease, filter 0.5s ease;
      }

      /* Status bars group */
      .sims2-bars-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .sims2-bar-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sims2-bar-label {
        font-size: 11px;
        font-weight: 500;
        color: #A0B8CC;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        width: 52px;
        flex-shrink: 0;
      }

      /* Pill-shaped bar track */
      .sims2-bar-track {
        flex: 1;
        height: 14px;
        border-radius: 7px;
        background: linear-gradient(180deg, #0A1C30 0%, #122640 100%);
        border: 1px solid rgba(224, 182, 107, 0.2);
        box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.5), inset 0 0 3px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        transition: box-shadow 0.5s ease;
      }

      /* Bar fill */
      .sims2-bar-fill {
        display: block;
        height: 100%;
        width: var(--bar-pct, 75%);
        border-radius: 7px;
        background: linear-gradient(90deg, ${mc.dark} 0%, ${mc.main} 60%, #C8E080 100%);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
        transition: width 0.4s ease, background 0.5s ease;
      }

      /* ===== Body ===== */
      .sims2-panel-body {
        position: relative;
        z-index: 1;
        padding: 0 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* ===== Child card wrapper ===== */
      .sims2-child-card {
        border-radius: 10px;
        background: linear-gradient(180deg, #162E4A 0%, #0F2238 100%);
        border: 1px solid rgba(224, 182, 107, 0.2);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.03),
          0 1px 4px rgba(0, 0, 0, 0.2);
        overflow: hidden;
      }
      .sims2-child-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 14px;
        background: linear-gradient(180deg, rgba(224, 182, 107, 0.08) 0%, rgba(224, 182, 107, 0.03) 100%);
        border-bottom: 1px solid rgba(224, 182, 107, 0.15);
        font-size: 11px;
        color: #A0B8CC;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .sims2-child-icon {
        font-size: 12px;
        color: var(--sims2-gold, #E0B66B);
      }
      .sims2-child-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sims2-child-content {
        min-height: 48px;
        padding: 10px 14px;
      }

      /* ===== Empty state ===== */
      .sims2-panel-empty {
        text-align: center;
        padding: 20px 16px;
        font-size: 12px;
        color: #6A8AAA;
        letter-spacing: 0.03em;
        opacity: 0.7;
      }

      /* ===== Mood-tinted outer glow on the panel ===== */
      .sims2-panel[data-mood="green"] {
        box-shadow:
          0 0 0 1px rgba(123, 201, 66, 0.2),
          0 4px 20px rgba(0, 0, 0, 0.35),
          0 0 24px rgba(123, 201, 66, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }
      .sims2-panel[data-mood="yellow"] {
        box-shadow:
          0 0 0 1px rgba(242, 193, 78, 0.2),
          0 4px 20px rgba(0, 0, 0, 0.35),
          0 0 24px rgba(242, 193, 78, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }
      .sims2-panel[data-mood="red"] {
        box-shadow:
          0 0 0 1px rgba(229, 91, 69, 0.2),
          0 4px 20px rgba(0, 0, 0, 0.35),
          0 0 24px rgba(229, 91, 69, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }
    `;
  }
}

// Register the element and announce it to the Lovelace card picker.
customElements.define("sims2-panel", Sims2PanelCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims2-panel",
  name: "Sims 2 Panel",
  description:
    "An authentic Sims 2 live-mode control panel with navy background, gold trim, " +
    "plumbob mood indicator, and horizontal status bars.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
