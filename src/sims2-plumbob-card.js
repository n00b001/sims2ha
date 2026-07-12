/**
 * sims2-plumbob-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-plumbob
 *
 * A decorative, floating plumbob — the diamond that floats above every Sim's
 * head — repurposed as a charming Home Assistant status indicator. Its colour
 * (green / yellow / red) reflects the state or value of a bound entity, or a
 * fixed mood you choose.
 *
 * No build step, no dependencies. Vanilla web component, Shadow DOM.
 *
 * Example configuration:
 *
 *   type: custom:sims2-plumbob
 *   title: Household Morale
 *   entity: sensor.house_mood_score      # numeric: >= green_above is green, etc.
 *   green_above: 66
 *   yellow_above: 33
 *
 *   # Or map explicit states:
 *   type: custom:sims2-plumbob
 *   title: Bella Goth
 *   entity: person.bella_goth
 *   state_map:
 *     home: green
 *     away: yellow
 *     not_home: red
 *
 * Fan tribute. "The Sims 2" and the plumbob are trademarks of Electronic Arts.
 * ---------------------------------------------------------------------------
 */

const SIMS2_PLUMBOB_DEFAULTS = {
  title: "Plumbob",
  subtitle: "",
  mood: "green",           // green | yellow | red  (used when no entity)
  size: 70,                // plumbob height in pixels
  float: true,             // gentle bob animation
  entity: null,
  green_above: 66,         // numeric thresholds
  yellow_above: 33,
  state_map: {},           // explicit { state: mood }
  unit: "",
};

class Sims2PlumbobCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._config = { ...SIMS2_PLUMBOB_DEFAULTS };
    this._hass = null;
  }

  static getStubConfig() {
    return { title: "Household Morale", mood: "green", size: 70 };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration for sims2-plumbob");
    this._config = { ...SIMS2_PLUMBOB_DEFAULTS, ...config };
    this._render();
  }

  set hass(value) {
    this._hass = value;
    this._update();
  }

  getCardSize() {
    return 2;
  }

  _resolveMood() {
    const cfg = this._config;
    if (!cfg.entity || !this._hass) {
      return cfg.mood || "green";
    }
    const stateObj = this._hass.states[cfg.entity];
    if (!stateObj) return cfg.mood || "green";

    const state = stateObj.state;
    if (cfg.state_map && cfg.state_map[state]) {
      return cfg.state_map[state];
    }

    const numeric = parseFloat(state);
    if (!isNaN(numeric)) {
      if (numeric >= cfg.green_above) return "green";
      if (numeric >= cfg.yellow_above) return "yellow";
      return "red";
    }

    // Sensible fallbacks for common binary-ish states.
    const onStates = ["on", "home", "active", "running", "cooling", "heating", "ok"];
    const warnStates = ["idle", "pending", "standby", "paused", "not_home", "away"];
    const offStates = ["off", "unavailable", "unknown", "error", "problem"];
    if (onStates.includes(state)) return "green";
    if (warnStates.includes(state)) return "yellow";
    if (offStates.includes(state)) return "red";
    return cfg.mood || "green";
  }

  _update() {
    const plumbob = this._shadow.getElementById("sims2-plumbob");
    const valueEl = this._shadow.getElementById("sims2-plumbob-value");
    if (!plumbob) return;
    const mood = this._resolveMood();
    plumbob.setAttribute("data-mood", mood);

    if (valueEl && this._config.entity && this._hass) {
      const stateObj = this._hass.states[this._config.entity];
      if (stateObj) {
        valueEl.textContent = `${stateObj.state}${this._config.unit || ""}`.trim();
      }
    }
  }

  _render() {
    const cfg = this._config;
    const widthPx = Math.round(cfg.size * 0.78);
    this._shadow.innerHTML = `
      <style>${Sims2PlumbobCard._styles(cfg, widthPx)}</style>
      <div class="sims2-plumbob-card">
        <div class="sims2-plumbob-wrap">
          <div id="sims2-plumbob" class="sims2-plumbob${cfg.float ? " sims2-float" : ""}" data-mood="${this._escapeAttr(cfg.mood)}"></div>
        </div>
        <div class="sims2-plumbob-text">
          <div class="sims2-title">${this._escapeHtml(cfg.title)}</div>
          ${cfg.subtitle ? `<div class="sims2-subtitle">${this._escapeHtml(cfg.subtitle)}</div>` : ""}
          ${cfg.entity ? `<div id="sims2-plumbob-value" class="sims2-value">—</div>` : ""}
        </div>
      </div>
    `;
    this._update();
  }

  _escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  _escapeAttr(text) {
    return this._escapeHtml(text);
  }

  static _styles(cfg, widthPx) {
    return `
      :host { display: block; }
      .sims2-plumbob-card {
        background: linear-gradient(180deg, #F7EDDA 0%, #EDE0C8 100%);
        border-radius: 14px;
        box-shadow: 0 2px 12px rgba(74, 51, 32, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        border: 1px solid #D4B878;
        padding: 18px 14px 16px;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        text-align: center;
        font-family: var(--sims2-font-display, "Fredoka", system-ui, sans-serif);
      }
      .sims2-plumbob-wrap { height: ${cfg.size}px; display: flex; align-items: center; }
      .sims2-plumbob {
        width: ${widthPx}px; height: ${cfg.size}px;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        background: linear-gradient(105deg, #B7F36B 0%, #7BC942 42%, #4E9A26 58%, #2F6B12 100%);
        filter: drop-shadow(0 0 10px rgba(123,201,66,0.7));
        transition: filter 0.5s ease, background 0.5s ease;
      }
      .sims2-plumbob[data-mood="yellow"] {
        background: linear-gradient(105deg, #FFE079 0%, #F2C14E 42%, #C28A1F 58%, #8A5E0E 100%);
        filter: drop-shadow(0 0 10px rgba(242,193,78,0.75));
      }
      .sims2-plumbob[data-mood="red"] {
        background: linear-gradient(105deg, #FF9A8A 0%, #E55B45 42%, #B03320 58%, #6E1C10 100%);
        filter: drop-shadow(0 0 10px rgba(229,91,69,0.75));
      }
      .sims2-float { animation: sims2plum-float 3.2s ease-in-out infinite; }
      @keyframes sims2plum-float {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-7px); }
      }
      .sims2-plumbob-text { color: var(--primary-text-color, #4A3320); }
      .sims2-title {
        font-size: 17px; font-weight: 600; letter-spacing: 0.02em;
        color: var(--primary-text-color, #4A3320);
      }
      .sims2-subtitle {
        font-size: 12px; margin-top: 2px;
        color: var(--secondary-text-color, #7A5A38);
      }
      .sims2-value {
        font-size: 13px; margin-top: 6px; letter-spacing: 0.04em;
        color: var(--secondary-text-color, #7A5A38);
        text-transform: capitalize;
      }
    `;
  }
}

customElements.define("sims2-plumbob", Sims2PlumbobCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims2-plumbob",
  name: "Sims 2 Plumbob",
  description:
    "A floating plumbob that turns green, yellow, or red to reflect the state " +
    "of a bound entity. The Sim above your smart home.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
