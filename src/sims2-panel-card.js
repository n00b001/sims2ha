/**
 * sims2-panel-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-panel
 *
 * Wraps child cards in a Sims 2-styled curved panel with an arched top edge,
 * gold trim, and optional title/icon. Entity state drives auto-colouring
 * (green / yellow / red mood) that tints the arch glow.
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
      "on",
      "home",
      "active",
      "running",
      "cooling",
      "heating",
      "ok",
    ];
    const warnStates = [
      "idle",
      "pending",
      "standby",
      "paused",
      "not_home",
      "away",
    ];
    const offStates = [
      "off",
      "unavailable",
      "unknown",
      "error",
      "problem",
    ];
    if (onStates.includes(state)) return "green";
    if (warnStates.includes(state)) return "yellow";
    if (offStates.includes(state)) return "red";
    return "green";
  }

  _update() {
    const card = this._shadow.getElementById("sims2-panel-card");
    if (!card) return;
    const mood = this._resolveMood();
    card.setAttribute("data-mood", mood);
  }

  // --------------------------------------------------------------- rendering
  _render() {
    const cfg = this._config;
    this._shadow.innerHTML = `
      <style>${Sims2PanelCard._styles(cfg)}</style>
      <div id="sims2-panel-card" class="sims2-panel" data-mood="${this._escapeAttr(this._resolveMood())}">
        <div class="sims2-panel-arch"></div>
        ${cfg.title || cfg.icon ? this._renderHeader() : ""}
        <div class="sims2-panel-body">
          ${this._renderChildren()}
        </div>
      </div>
    `;
    this._update();
  }

  _renderHeader() {
    const cfg = this._config;
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

  _renderChildren() {
    const children = this._config.children || [];
    if (!children.length) {
      return '<div class="sims2-panel-empty">No child cards configured.</div>';
    }
    return children
      .map(
        (child, i) => `
      <div class="sims2-child-card" data-child-index="${i}">
        <div class="sims2-child-header">
          ${
            child.title
              ? `<span class="sims2-child-title">${this._escapeHtml(child.title)}</span>`
              : ""
          }
          ${
            child.icon
              ? `<span class="sims2-child-icon">${this._escapeHtml(child.icon)}</span>`
              : ""
          }
        </div>
        <div class="sims2-child-content">
          <!-- sims2-panel child card: ${JSON.stringify(child).replace(/</g, "&lt;")} -->
        </div>
      </div>
    `
      )
      .join("");
  }

  // ---------------------------------------------------------------- helpers
  _escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  _escapeAttr(text) {
    return this._escapeHtml(text);
  }

  // ------------------------------------------------------------------ styles
  static _styles(cfg) {
    const titleRowHeight = cfg.title || cfg.icon ? "42px" : "0";
    return `
      :host { display: block; }

      /* ---- Panel shell ------------------------------------------------ */
      .sims2-panel {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        background: linear-gradient(180deg, #3A6B5C 0%, #2D5A4E 100%);
        font-family: var(--sims2-font-display, "Benguiat Gothic", "Fredoka", system-ui, sans-serif);
        color: #FFF6E0;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.1),
          0 4px 16px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.5s ease;
      }

      /* ---- Arched top edge (gold trim via pseudo-element) --------------- */
      .sims2-panel-arch {
        position: absolute;
        inset: -4px -4px auto -4px;
        height: calc(100% + 8px);
        pointer-events: none;
        z-index: 0;
        background: linear-gradient(135deg, #E0B66B, #C49A3C, #E8C878, #C49A3C);
        clip-path: polygon(
          0% 12%,
          4% 4%,
          10% 0%,
          50% 0%,
          90% 0%,
          96% 4%,
          100% 12%,
          100% 100%,
          0% 100%
        );
        transition: filter 0.5s ease;
      }

      /* Mood-tinted arch glow */
      .sims2-panel[data-mood="green"] .sims2-panel-arch {
        filter: drop-shadow(0 0 6px rgba(51, 204, 51, 0.45));
      }
      .sims2-panel[data-mood="yellow"] .sims2-panel-arch {
        filter: drop-shadow(0 0 6px rgba(212, 160, 32, 0.45));
      }
      .sims2-panel[data-mood="red"] .sims2-panel-arch {
        filter: drop-shadow(0 0 6px rgba(224, 64, 48, 0.45));
      }

      /* ---- Title bar -------------------------------------------------- */
      .sims2-panel-title-row {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        height: ${titleRowHeight};
        padding: 10px 20px 6px;
        background: linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 100%);
        border-bottom: 1px solid rgba(224, 182, 107, 0.25);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.04em;
      }
      .sims2-panel-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        font-size: 14px;
        color: #E0B66B;
      }
      .sims2-panel-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ---- Body ------------------------------------------------------- */
      .sims2-panel-body {
        position: relative;
        z-index: 1;
        padding: 14px 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* ---- Child card wrapper ----------------------------------------- */
      .sims2-child-card {
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid rgba(224, 182, 107, 0.2);
        overflow: hidden;
      }
      .sims2-child-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(224, 182, 107, 0.15);
        font-size: 12px;
        color: rgba(255, 246, 224, 0.7);
        letter-spacing: 0.03em;
      }
      .sims2-child-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sims2-child-icon {
        font-size: 12px;
        color: #E0B66B;
      }
      .sims2-child-content {
        min-height: 48px;
        padding: 10px 14px;
      }

      /* ---- Empty state ----------------------------------------------- */
      .sims2-panel-empty {
        text-align: center;
        padding: 24px 16px;
        font-size: 13px;
        color: rgba(255, 246, 224, 0.45);
        letter-spacing: 0.03em;
      }

      /* ---- Mood border accents on the panel body ---------------------- */
      .sims2-panel[data-mood="green"] {
        box-shadow:
          inset 0 0 0 2px rgba(51, 204, 51, 0.35),
          0 4px 16px rgba(0, 0, 0, 0.3);
      }
      .sims2-panel[data-mood="yellow"] {
        box-shadow:
          inset 0 0 0 2px rgba(212, 160, 32, 0.35),
          0 4px 16px rgba(0, 0, 0, 0.3);
      }
      .sims2-panel[data-mood="red"] {
        box-shadow:
          inset 0 0 0 2px rgba(224, 64, 48, 0.35),
          0 4px 16px rgba(0, 0, 0, 0.3);
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
    "A curved panel with arched gold trim that wraps child cards in the " +
    "authentic Sims 2 live-mode control-panel look, with entity-driven mood colouring.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
