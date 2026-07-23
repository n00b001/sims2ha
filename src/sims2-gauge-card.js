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
      needleGroup.setAttribute(
        "transform",
        `rotate(${angle.toFixed(1)}, 58, 58)`,
      );
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
    const needle = this._shadow.querySelector(".sims2-needle-body");
    if (needle) {
      const colors = {
        green: "#7BC942",
        yellow: "#F2C14E",
        red: "#E55B45",
      };
      needle.setAttribute("stroke", colors[mood] || colors.green);
    }

    // Update segment visibility.
    this._updateSegments(value, fraction);
  }

  _updateSegments(value, _) {
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
    const yellowFrac = this._fraction(
      Math.min(value, Math.max(greenThreshold, yellowThreshold)),
    );
    const yellowStart = this._arcLength(48, this._fraction(yellowThreshold));
    const yellowLen = this._arcLength(48, yellowFrac) - yellowStart;
    const yellowArc = this._shadow.querySelector(".sims2-gauge-yellow");
    if (yellowArc) {
      yellowArc.setAttribute(
        "stroke-dasharray",
        `${Math.max(0, yellowLen).toFixed(1)} 302`,
      );
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
    const displayValue =
      value !== null
        ? `${Number.isInteger(value) ? value : value.toFixed(1)}${cfg.unit || ""}`
        : "—";

    // Pre-compute arc segments for consistent rendering
    const severity = cfg.severity || {};
    const greenThreshold = severity.green || 70;
    const yellowThreshold = severity.yellow || 40;
    const totalArc = 2 * Math.PI * 48 * (270 / 360);

    const greenLen = this._arcLength(
      48,
      this._fraction(Math.min(value, greenThreshold)),
    );
    const yellowStart = this._arcLength(48, this._fraction(yellowThreshold));
    const yellowLen = Math.max(
      0,
      this._arcLength(
        48,
        this._fraction(
          Math.min(value, Math.max(greenThreshold, yellowThreshold)),
        ),
      ) - yellowStart,
    );
    const redLen = this._arcLength(
      48,
      this._fraction(Math.min(value, yellowThreshold)),
    );

    this._shadow.innerHTML = `
      <style>${Sims2GaugeCard._styles()}</style>
      <div class="sims2-gauge-card" data-mood="${this._escapeAttr(mood)}">
        <!-- Brass rivet top-left -->
        <svg class="sims2-rivet-tl" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" fill="#B8942E" stroke="#8C6D1A" stroke-width="1"/>
          <circle cx="8" cy="8" r="4.5" fill="#D4AF37"/>
          <circle cx="6.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.3)"/>
        </svg>
        <!-- Brass rivet bottom-right -->
        <svg class="sims2-rivet-br" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" fill="#B8942E" stroke="#8C6D1A" stroke-width="1"/>
          <circle cx="8" cy="8" r="4.5" fill="#D4AF37"/>
          <circle cx="6.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.3)"/>
        </svg>

        <svg viewBox="0 0 116 116" class="sims2-gauge-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Brass bezel gradient -->
            <linearGradient id="sims2-bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#E8C960"/>
              <stop offset="25%" stop-color="#D4AF37"/>
              <stop offset="50%" stop-color="#F5DF8A"/>
              <stop offset="75%" stop-color="#C49A2F"/>
              <stop offset="100%" stop-color="#E8C960"/>
            </linearGradient>

            <!-- Dark recess shadow for arc track -->
            <filter id="sims2-recess" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset dx="0" dy="1.5"/>
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="blur" result="inverse"/>
              <feFlood flood-color="#000" flood-opacity="0.6" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>

            <!-- 3-facet gradient: green -->
            <linearGradient id="sims2-grad-green" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#5BA830"/>
              <stop offset="50%" stop-color="#7BC942"/>
              <stop offset="100%" stop-color="#5BA830"/>
            </linearGradient>

            <!-- 3-facet gradient: yellow -->
            <linearGradient id="sims2-grad-yellow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#D4A030"/>
              <stop offset="50%" stop-color="#F2C14E"/>
              <stop offset="100%" stop-color="#D4A030"/>
            </linearGradient>

            <!-- 3-facet gradient: red -->
            <linearGradient id="sims2-grad-red" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#C44030"/>
              <stop offset="50%" stop-color="#E55B45"/>
              <stop offset="100%" stop-color="#C44030"/>
            </linearGradient>

            <!-- Needle metallic body gradient -->
            <linearGradient id="sims2-needle-body" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#6B5A30"/>
              <stop offset="40%" stop-color="#8C7A42"/>
              <stop offset="100%" stop-color="#D4AF37"/>
            </linearGradient>

            <!-- Pivot brass gradient -->
            <radialGradient id="sims2-pivot" cx="40%" cy="35%">
              <stop offset="0%" stop-color="#F5DF8A"/>
              <stop offset="60%" stop-color="#D4AF37"/>
              <stop offset="100%" stop-color="#8C6D1A"/>
            </radialGradient>

            <!-- Inner shadow for gauge area -->
            <filter id="sims2-inner-shadow">
              <feOffset dx="0" dy="0"/>
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="blur" result="inverse"/>
              <feFlood flood-color="#000" flood-opacity="0.5" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          <!-- Brass bezel outer ring -->
          <circle cx="58" cy="58" r="54" fill="none" stroke="url(#sims2-bezel)" stroke-width="3"/>

          <!-- Bezel highlight arc (top half) -->
          <path d="${this._arcPath(54, 58, 58)
            .replace("A 54 54", "A 54 54")
            .substring(
              0,
              this._arcPath(54, 58, 58).indexOf("A"),
            )} A 54 54 0 0 1 ${this._arcPathEnd(54, 58, 58)}"
                fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>

          <!-- Dark recessed track -->
          <path d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="#0A1E30"
                stroke-width="10"
                stroke-linecap="round"
                filter="url(#sims2-recess)"/>

          <!-- Track inner edge highlight -->
          <path d="${this._arcPath(43, 58, 58)}"
                fill="none"
                stroke="rgba(212,175,55,0.08)"
                stroke-width="0.5"/>

          <!-- Track outer edge highlight -->
          <path d="${this._arcPath(53, 58, 58)}"
                fill="none"
                stroke="rgba(212,175,55,0.06)"
                stroke-width="0.5"/>

          <!-- Color segments (green, yellow, red zones) -->
          <path class="sims2-gauge-green"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="url(#sims2-grad-green)"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${greenLen.toFixed(1)} ${totalArc.toFixed(1)}"
                filter="url(#sims2-inner-shadow)"/>

          <path class="sims2-gauge-yellow"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="url(#sims2-grad-yellow)"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${yellowLen.toFixed(1)} ${totalArc.toFixed(1)}"
                stroke-dashoffset="-${yellowStart.toFixed(1)}"
                filter="url(#sims2-inner-shadow)"/>

          <path class="sims2-gauge-red"
                d="${this._arcPath(48, 58, 58)}"
                fill="none"
                stroke="url(#sims2-grad-red)"
                stroke-width="8"
                stroke-linecap="butt"
                stroke-dasharray="${redLen.toFixed(1)} ${totalArc.toFixed(1)}"
                filter="url(#sims2-inner-shadow)"/>

          <!-- Tick marks -->
          ${this._renderTicks()}

          <!-- Needle group -->
          <g id="sims2-needle" transform="rotate(${angle.toFixed(1)}, 58, 58)">
            <!-- Needle body: dark metallic with gold tip -->
            <polygon class="sims2-needle-body"
                     points="56,58 57.2,20 58,14 58.8,20 60,58"
                     fill="url(#sims2-needle-body)"
                     stroke="#5A4A1E"
                     stroke-width="0.5"/>
            <!-- Gold tip highlight -->
            <polygon points="57.5,22 58,16 58.5,22" fill="rgba(255,255,255,0.2)"/>
            <!-- Brass pivot circle -->
            <circle cx="58" cy="58" r="5.5"
                    fill="url(#sims2-pivot)"
                    stroke="#6B5A1A"
                    stroke-width="1"/>
            <!-- Pivot center dot -->
            <circle cx="58" cy="58" r="2"
                    fill="#4A3D10"/>
          </g>

          <!-- Value text -->
          <text id="sims2-gauge-value"
                x="58" y="86"
                text-anchor="middle"
                dominant-baseline="central"
                fill="#E8D4B0"
                font-size="13"
                font-weight="700"
                font-family="'Benguiat Gothic', system-ui, sans-serif">${this._escapeHtml(displayValue)}</text>
        </svg>
        ${cfg.name ? `<div class="sims2-gauge-name">${this._escapeHtml(cfg.name.toUpperCase())}</div>` : ""}
      </div>
    `;
  }

  _renderTicks() {
    const ticks = [];
    const cx = 58,
      cy = 58;
    const innerR = 36,
      outerR = 42;
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
              stroke="#D4AF37"
              stroke-opacity="${isMajor ? 0.8 : 0.4}"
              stroke-width="${isMajor ? 1.5 : 0.8}"
              stroke-linecap="round"/>
      `);
    }
    return ticks.join("");
  }

  // ---------------------------------------------------------------- helpers
  _arcPathEnd(r, cx, cy) {
    const endAngle = -150 * (Math.PI / 180);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return `${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  _escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  _escapeAttr(text) {
    return this._escapeHtml(text);
  }

  static _styles() {
    return `
      :host { display: block; }
      .sims2-gauge-card {
        position: relative;
        background: linear-gradient(160deg, #0E2A44 0%, #163A5C 100%);
        border-radius: 18px;
        padding: 20px 14px 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-align: center;
        font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif);
        overflow: hidden;
      }

      /* Gold border via ::before */
      .sims2-gauge-card::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 18px;
        padding: 1.5px;
        background: linear-gradient(160deg, #E8C960, #D4AF37, #B8942E, #D4AF37, #E8C960);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }

      /* Subtle dot-grid pattern via ::after */
      .sims2-gauge-card::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 18px;
        background-image: radial-gradient(circle, rgba(212,175,55,0.06) 0.8px, transparent 0.8px);
        background-size: 8px 8px;
        pointer-events: none;
      }

      .sims2-gauge-svg {
        width: var(--_gauge-size, 140px);
        height: var(--_gauge-size, 140px);
        display: block;
        position: relative;
        z-index: 1;
      }

      .sims2-gauge-name {
        font-size: 11px;
        color: #D4AF37;
        letter-spacing: 0.12em;
        font-weight: 600;
        position: relative;
        z-index: 1;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }

      /* Rivet positioning */
      .sims2-rivet-tl {
        position: absolute;
        top: 6px;
        left: 8px;
        width: 14px;
        height: 14px;
        z-index: 2;
        pointer-events: none;
      }

      .sims2-rivet-br {
        position: absolute;
        bottom: 6px;
        right: 8px;
        width: 14px;
        height: 14px;
        z-index: 2;
        pointer-events: none;
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
