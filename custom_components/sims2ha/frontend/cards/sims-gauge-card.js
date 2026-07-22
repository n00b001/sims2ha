// Sims 2 Gauge Card - Custom Lovelace card for displaying values as gauges
class SimsGaugeCard extends LitElement {
  static properties = {
    entity: { type: String },
    min: { type: Number },
    max: { type: Number },
    size: { type: String },
    showValue: { type: Boolean },
    showDivider: { type: Boolean },
    glowIntensity: { type: String },
  };

  constructor() {
    super();
    this._state = null;
    this._unit = "";
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity is required");
    }
    this.entity = config.entity;
    this.min = config.min ?? 0;
    this.max = config.max ?? 100;
    this.size = config.size ?? "medium";
    this.showValue = config.showValue !== undefined ? config.showValue : true;
    this.showDivider =
      config.showDivider !== undefined ? config.showDivider : true;
    this.glowIntensity = config.glowIntensity ?? "medium";
  }

  set hass(hass) {
    const state = hass.states[this.entity];
    if (!state) {
      this._state = null;
      this._unit = "";
      return;
    }
    this._state = parseFloat(state.state) || 0;
    this._unit = state.attributes.unit_of_measurement || "";
  }

  static get styles() {
    return css`
      :host {
        display: block;
        --need-bar-height: 18px;
        --need-bar-border: 1.5px solid rgba(0, 0, 0, 0.55);
        --need-bar-shadow:
          0 1px 3px rgba(0, 0, 0, 0.35), inset 0 -1px 2px rgba(0, 0, 0, 0.2);
        --need-bar-fill-radius: 9px;
        --need-bar-divider-width: 2px;
        --need-bar-divider-color: rgba(0, 0, 0, 0.6);
        --need-bar-shadow-band: linear-gradient(
          180deg,
          transparent 0%,
          rgba(0, 0, 0, 0.2) 100%
        );
      }

      .need-bar--xthin {
        height: 6px;
        border-radius: 3px;
      }
      .need-bar--thin {
        height: 10px;
        border-radius: 5px;
      }
      .need-bar--thick {
        height: 26px;
        border-radius: 13px;
      }

      .need-bar--glow-none {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      }
      .need-bar--glow-medium {
        box-shadow:
          0 0 6px rgba(90, 190, 50, 0.4),
          0 1px 3px rgba(0, 0, 0, 0.35);
      }
      .need-bar--glow-strong {
        box-shadow:
          0 0 10px rgba(90, 190, 50, 0.6),
          0 0 20px rgba(90, 190, 50, 0.25),
          0 1px 3px rgba(0, 0, 0, 0.35);
      }

      .need-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        background: linear-gradient(
          180deg,
          var(--sims2-sky-blue, #7ec8e6) 0%,
          #5bb4d8 100%
        );
        border-radius: 12px;
        border: 2px solid var(--sims2-panel-blue-deep, #173a52);
        box-shadow: 0 2px 8px rgba(14, 22, 40, 0.2);
      }

      .need-icon {
        font-size: 24px;
        width: 24px;
        text-align: center;
        color: var(--sims2-cream-text, #fff6e0);
      }

      .need-bar {
        position: relative;
        flex: 1;
        background: rgba(14, 22, 40, 0.2);
        border: var(--need-bar-border);
        border-radius: var(--need-bar-fill-radius);
        overflow: hidden;
        box-shadow: var(--need-bar-shadow);
      }

      .need-bar-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--gradient);
        transition: width 0.3s ease;
      }

      .need-bar-divider {
        position: absolute;
        top: 0;
        right: 0;
        width: var(--need-bar-divider-width);
        height: 100%;
        background: var(--need-bar-divider-color);
      }

      .need-label {
        font-family: var(
          --sims2-font-body,
          "Benguiat Gothic",
          system-ui,
          sans-serif
        );
        font-size: 14px;
        color: var(--sims2-cream-text, #fff6e0);
        white-space: nowrap;
      }
    `;
  }

  render() {
    if (this._state === null) {
      return html`<div class="need-row">
        <div class="need-icon">?</div>
        <div class="need-bar"></div>
      </div>`;
    }

    const percent = Math.max(
      0,
      Math.min(100, ((this._state - this.min) / (this.max - this.min)) * 100),
    );
    let colorClass = "green";
    if (percent >= 80) {
      colorClass =
        percent < 30
          ? "red"
          : percent < 50
            ? "orange"
            : percent < 70
              ? "yellow"
              : "green";
    }

    const gradient = this.getGradientForColor(colorClass);

    return html`
      <div class="need-row">
        <div class="need-icon">${this.getIconForDomain(this.entity)}</div>
        <div
          class="need-bar ${this.size} ${this.glowIntensity}"
          style="--gradient: ${gradient};"
        >
          <div class="need-bar-fill" style="width: ${percent}%;"></div>
          ${this.showDivider ? html`<div class="need-bar-divider"></div>` : ""}
        </div>
        ${this.showValue ? html`<div class="need-label">${Math.round(this._state)}${this.unit ? " " + this.unit : ""}</div>` : ""}
      </div>
    `;
  }

  getGradientForColor(color) {
    switch (color) {
      case "green":
        return "linear-gradient(90deg, #4E9A26, #7BC942)";
      case "red":
        return "linear-gradient(90deg, #CC0000, #E55B45)";
      case "yellow":
        return "linear-gradient(90deg, #F4A460, #F2C14E)";
      case "blue":
        return "linear-gradient(90deg, #4A90E2, #2F86C5)";
      default:
        return "linear-gradient(90deg, #4E9A26, #7BC942)";
    }
  }

  getIconForDomain(entityId) {
    const domain = entityId.split(".")[0];
    const iconMap = {
      light: "💡",
      switch: "🔌",
      climate: "🌡️",
      fan: "🌀",
      cover: "🪟",
      lock: "🔒",
      binary_sensor: "🔔",
      sensor: "📊",
      device_tracker: "📍",
      alarm_control_panel: "🚨",
      humidifier: "💧",
      water_heater: "🚿",
      vacuum: "🤖",
      lawn_mower: "🌱",
      tv: "📺",
      speaker: "🔊",
      camera: "📷",
      weather: "☀️",
      person: "👤",
      phone: "📱",
      update: "🔄",
      script: "📜",
      automation: "⚙️",
    };
    return iconMap[domain] || "⬜";
  }
}

customElements.define("sims-gauge-card", SimsGaugeCard);
