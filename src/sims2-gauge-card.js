/**
 * sims2-gauge-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-gauge
 *
 * Circular SVG gauge with needle indicator, inspired by the Sims 2 needs
 * meters. Features a 270-degree arc sweep, gold outer ring, colour-coded
 * segments (green / yellow / red), and an animated needle that tracks entity
 * values. Designed as a drop-in replacement for Home Assistant's built-in
 * `type: gauge` card — it accepts the same config schema.
 *
 * The Sims 2 needs meters are circular with gold trim and coloured arc
 * segments. This card replicates that aesthetic using pure SVG in Shadow DOM.
 *
 * No build step, no dependencies. Vanilla web component, Shadow DOM.
 *
 * Example configuration:
 *
 *   type: custom:sims2-gauge
 *   entity: sensor.living_room_temperature
 *   name: Temperature
 *   unit: "°F"
 *   min: 0
 *   max: 40
 *   severity:
 *     green: 25
 *     yellow: 18
 *     red: 10
 *
 * Fan tribute. "The Sims 2" and the plumbob are trademarks of Electronic Arts.
 * ---------------------------------------------------------------------------
 */

const SIMS2_GAUGE_DEFAULTS = {
  name: "Gauge",
  unit: "",
  min: 0,
  max: 100,
  severity: { green: 70, yellow: 40, red: 10 },
  size: 140,
  entity: null,
};

class Sims2GaugeCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._config = { ...SIMS2_GAUGE_DEFAULTS };
    this._hass = null;
  }

  static getStubConfig() {
    return { name: "Power Draw", min: 0, max: 10000 };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration for sims2-gauge");
    }
    this._config = { ...SIMS2_GAUGE_DEFAULTS, ...config };
    this._render();
  }

  set hass(value) {
    this._hass = value;
    this._update();
  }

  getCardSize() {
    return 3;
  }

  // ------------------------------------------------------------------ value
  _resolveValue() {
    const cfg = this._config;
    if (!cfg.entity || !this._hass) return null;
    const stateObj = this._hass.states[cfg.entity];
    if (!stateObj) return null;
    const numeric = parseFloat(stateObj.state);
    return isNaN(numeric) ? null : numeric;
  }

  // ------------------------------------------------------------------ mood
  _resolveMood(value) {
    const { severity } = this._config;
    if (value >= (severity.green || 0)) return "green";
    if (value >= (severity.yellow || 0)) return "yellow";
    return "red";
  }

  // ------------------------------------------------------------------ SVG
  // Arc geometry: standard gauge shape — 120-degree sweep from -330deg to -150deg.
  // Start (upper-left) → over the top → end (upper-right).
  // Needle maps fraction [0,1] to [-330°, -150°], midpoint = -240° = straight up.
  // Center at (58, 58) in a 116x116 viewBox.
  _arcPath(r, cx, cy) {
    const startAngle = -330 * (Math.PI / 180);
    const endAngle = -150 * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    // large-arc-flag=1 (sweep > 180), sweep-flag=1 (clockwise)
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  // Fraction of the 270-degree arc for a given value.
  _fraction(value) {
    const { min, max } = this._config;
    const f = (value - min) / (max - min);
    return Math.max(0, Math.min(1, f));
  }

  // Needle rotation angle: maps fraction [0,1] to [-330°, -150°].
  // Midpoint (-240°) = straight up.
  _needleAngle(fraction) {
    return -330 + fraction * 180;
  }

  // Arc length for a given fraction of the 270-degree sweep.
  _arcLength(r, fraction) {
    return 2 * Math.PI * r * (270 / 360) * fraction;
  }

  // ---------------------------------------------------------------- update
  _update() {
    const value = this._resolveValue();
    if (value === null) return;

    const fraction = this._fraction(value);
    const mood = this._resolveMood(value);
    const angle = this._needleAngle(fraction);

    // Update needle rotation.
    const needleGroup = this._shadow.getElementById("sims2-needle");
    if (needleGroup) {
      needleGroup.setAttribute("transform", `rotate(${angle.toFixed(1)}, 58, 58)`);
    }

    // Update value text.
    const valueEl = this._shadow.getElementById("sims2-gauge-value");
    if (valueEl) {
      const displayValue = Number.isInteger(value) ? value : value.toFixed(1);
      valueEl.textContent = `${displayValue}${this._config.unit || ""}`;
    }

    // Apply mood class to the gauge container.
    const gauge = this._shadow.getElementById("sims2-gauge");
    if (gauge) {
      gauge.setAttribute("data-mood", mood);
    }

    // Update needle color based on mood.
    const needle = this._shadow.querySelector(".sims2-needle-line");
    if (needle) {
      const colors = {
        green: "#33CC33",
        yellow: "#D4A020",
        red: "#E04030",
      };
      needle.setAttribute("stroke", colors[mood] || colors.green);
    }

    // Update segment visibility.
    this._updateSegments(value, fraction);
  }

  _updateSegments(value, fraction) {
    const { min, max } = this._config;
    const severity = this._config.severity || {};
    const greenThreshold = severity.green || 70;
    const yellowThreshold = severity.yellow || 40;

    // Green segment: from start up to green threshold
    const greenFrac = this._fraction(Math.min(value, greenThreshold));
    const greenLen = this._arcLength(48, greenFrac);
    const greenArc = this._shadow.querySelector(".sims2-gauge-green");
    if (greenArc) {
      greenArc.setAttribute("stroke-dasharray", `${greenLen.toFixed(1)} 302`);
    }

    // Yellow segment: from yellow threshold to green threshold
    const yellowFrac = this._fraction(Math.min(value, Math.max(greenThreshold, yellowThreshold)));
    const yellowStart = this._arcLength(48, this._fraction(yellowThreshold));
    const yellowLen = this._arcLength(48, yellowFrac) - yellowStart;
    const yellowArc = this._shadow.querySelector(".sims2-gauge-yellow");
    if (yellowArc) {
      yellowArc.setAttribute("stroke-dasharray", `${Math.max(0, yellowLen).toFixed(1)} 302`);
      yellowArc.setAttribute("stroke-dashoffset", `-${yellowStart.toFixed(1)}`);
    }

    // Red segment: from 0 to yellow threshold
    const redFrac = this._fraction(Math.min(value, yellowThreshold));
    const redLen = this._arcLength(48, redFrac);
    const redArc = this._shadow.querySelector(".sims2-gauge-red");
    if (redArc) {
      redArc.setAttribute("stroke-dasharray", `${redLen.toFixed(1)} 302`);
    }
  }

  // -------------------------------------------------------------- rendering
  _render() {
    const cfg = this._config;
    const value = this._resolveValue();
    const fraction = value !== null ? this._fraction(value) : 0.5;
    const angle = this._needleAngle(fraction);
    const mood = value !== null ? this._resolveMood(value) : "green";
    const needleColor = { green: "#33CC33", yellow: "#D4A020", red: "#E04030" }[mood];
    const displayValue =
      value !== null
        ? `${Number.isInteger(value) ? value : value.toFixed(1)}${cfg.unit || ""}`
        : "—";

    // Pre-compute arc segments for initial render.
    const severity = cfg.severity || {};
    const greenThreshold = severity.green || 70;
    const yellowThreshold = severity.yellow || 40;
    const greenFrac = this._fraction(Math.min(100, greenThreshold));
    const yellowFrac = this._fraction(Math.min(100, Math.max(greenThreshold, yellowThreshold)));
    const redFrac = this._fraction(yellowThreshold);
    const totalArc = 2 * Math.PI * 48 * (270 / 360);
    const greenLen = this._arcLength(48, greenFrac);
    const yellowStart = this._arcLength(48, redFrac);
    const yellowLen = this._arcLength(48, yellowFrac) - yellowStart;
    const redLen = this._arcLength(48, redFrac);

    this._shadow.innerHTML = `
      <style>${Sims2GaugeCard._styles(cfg)}</style>
      <div class="sims2-gauge-card" data-mood="${this._escapeAttr(mood)}">
        <svg viewBox="0 0 116 116" class="sims2-gauge-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Gold outer ring -->
          <circle cx="58" cy="58" r="54" fill="none" stroke="#E0B66B" stroke-width="1.5" opacity="0.7"/>

          <!-- Background arc track -->
          <path d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="#1A3A4C"
                stroke-width="8"
                stroke-linecap="round"/>

          <!-- Color segments (green, yellow, red zones) -->
          <path class="sims2-gauge-green"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="#33CC33"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${greenLen.toFixed(1)} ${totalArc.toFixed(1)}"
                opacity="0.5"/>

          <path class="sims2-gauge-yellow"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="#D4A020"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${Math.max(0, yellowLen).toFixed(1)} ${totalArc.toFixed(1)}"
                stroke-dashoffset="-${yellowStart.toFixed(1)}"
                opacity="0.5"/>

          <path class="sims2-gauge-red"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="#E04030"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${redLen.toFixed(1)} ${totalArc.toFixed(1)}"
                opacity="0.5"/>

          <!-- Tick marks -->
          ${this._renderTicks()}

          <!-- Needle group -->
          <g id="sims2-needle" transform="rotate(${angle.toFixed(1)}, 58, 58)">
            <line class="sims2-needle-line"
                  x1="58" y1="58" x2="58" y2="16"
                  stroke="${needleColor}"
                  stroke-width="2.5"
                  stroke-linecap="round"/>
            <circle class="sims2-needle-pivot"
                    cx="58" cy="58" r="5"
                    fill="#E0B66B"
                    stroke="#C49A3C"
                    stroke-width="1.5"/>
          </g>

          <!-- Value text -->
          <text id="sims2-gauge-value"
                x="58" y="88"
                text-anchor="middle"
                dominant-baseline="central"
                fill="var(--sims2-espresso, #4A3320)"
                font-size="14"
                font-weight="600"
                font-family="var(--sims2-font-display, 'Benguiat Gothic', 'Fredoka', system-ui, sans-serif)">${this._escapeHtml(displayValue)}</text>
        </svg>
        ${cfg.name ? `<div class="sims2-gauge-name">${this._escapeHtml(cfg.name)}</div>` : ""}
      </div>
    `;
  }

  _renderTicks() {
    const ticks = [];
    const cx = 58, cy = 58;
    const innerR = 38, outerR = 42;
    const numTicks = 9;
    for (let i = 0; i <= numTicks; i++) {
      const frac = i / numTicks;
      const angleDeg = -330 + frac * 180;
      const rad = angleDeg * (Math.PI / 180);
      const x1 = cx + innerR * Math.cos(rad);
      const y1 = cy + innerR * Math.sin(rad);
      const x2 = cx + outerR * Math.cos(rad);
      const y2 = cy + outerR * Math.sin(rad);
      const isMajor = i % 3 === 0;
      ticks.push(`
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}"
              x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
              stroke="rgba(224,182,107,${isMajor ? 0.6 : 0.3})"
              stroke-width="${isMajor ? 1.5 : 0.8}"/>
      `);
    }
    return ticks.join("");
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

  static _styles() {
    return `
      :host { display: block; }
      .sims2-gauge-card {
        background: linear-gradient(180deg, #F7EDDA 0%, #EDE0C8 100%);
        border-radius: 16px;
        box-shadow: 0 2px 12px rgba(74, 51, 32, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        border: 1px solid #D4B878;
        padding: 16px 12px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-align: center;
        font-family: var(--sims2-font-display, "Benguiat Gothic", "Fredoka", system-ui, sans-serif);
      }
      .sims2-gauge-svg {
        width: var(--_gauge-size, 140px);
        height: var(--_gauge-size, 140px);
        display: block;
      }
      .sims2-gauge-name {
        font-size: 13px;
        color: var(--secondary-text-color, #7A5A38);
        letter-spacing: 0.03em;
      }
    `;
  }
}

// Register the element and announce it to the Lovelace card picker.
customElements.define("sims2-gauge", Sims2GaugeCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims2-gauge",
  name: "Sims 2 Gauge",
  description:
    "A circular SVG gauge with needle indicator and gold trim, inspired by " +
    "the Sims 2 needs meters. Drop-in replacement for Home Assistant's type:gauge.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
