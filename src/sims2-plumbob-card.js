// Sims 2 Plumbob Card - 3D spinning diamond using pure CSS border triangles
// Following the exact pattern from artifacts/sims2-plumbob.css
class SimsPlumbobCard extends LitElement {
  static properties = {
    entity: { type: String },
    mood: { type: String },
    size: { type: Number },
    greenAbove: { type: Number, attribute: "green_above" },
    yellowAbove: { type: Number, attribute: "yellow_above" },
    stateMap: { type: Object, attribute: "state_map" },
  };

  constructor() {
    super();
    // Initialize all properties to defaults so tests work with Object.create
    this.mood = "green";
    this.size = 70;
    this.greenAbove = 70;
    this.yellowAbove = 40;
    this.stateMap = {};
    this._hass = null;
    this._config = null;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
    this.mood = config.mood || "green";
    this.size = config.size || 70;
    this.greenAbove =
      config.green_above !== undefined ? config.green_above : 70;
    this.yellowAbove =
      config.yellow_above !== undefined ? config.yellow_above : 40;
    this.stateMap = config.state_map || {};
  }

  set hass(hass) {
    this._hass = hass;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        text-align: center;
      }

      /* Size variants - following the exact pattern from artifacts/sims2-plumbob.css */
      .plumbob-xs {
        width: 25px;
        height: 62px;
      }
      .plumbob-sm {
        width: 50px;
        height: 123px;
      }
      .plumbob-md {
        width: 78px;
        height: 192px;
      }
      .plumbob-lg {
        width: 100px;
        height: 247px;
      }

      /* Pyramid halves */
      .plumbob-xs .top,
      .plumbob-xs .bottom {
        height: 31px;
      }
      .plumbob-sm .top,
      .plumbob-sm .bottom {
        height: 67px;
      }
      .plumbob-md .top,
      .plumbob-md .bottom {
        height: 104px;
      }
      .plumbob-lg .top,
      .plumbob-lg .bottom {
        height: 133px;
      }

      /* Face elements - critical for triangle geometry */
      .plumbob-xs .top div,
      .plumbob-xs .bottom div,
      .plumbob-sm .top div,
      .plumbob-sm .bottom div,
      .plumbob-md .top div,
      .plumbob-md .bottom div,
      .plumbob-lg .top div,
      .plumbob-lg .bottom div {
        position: absolute;
        left: 0;
        width: 0;
        height: 100%; /* Will be overridden by size-specific rules */
        border-left: solid transparent;
        border-right: solid transparent;
      }

      .plumbob-xs .top div {
        bottom: 0;
      }
      .plumbob-xs .bottom div {
        top: 0;
      }
      .plumbob-sm .top div {
        bottom: 0;
      }
      .plumbob-sm .bottom div {
        top: 0;
      }
      .plumbob-md .top div {
        bottom: 0;
      }
      .plumbob-md .bottom div {
        top: 0;
      }
      .plumbob-lg .top div {
        bottom: 0;
      }
      .plumbob-lg .bottom div {
        top: 0;
      }

      /* Size-specific border widths - NO CSS custom properties for geometry (Rule 6) */
      .plumbob-xs .top div,
      .plumbob-xs .bottom div {
        height: 31px !important;
        border-left-width: 12px !important;
        border-right-width: 12px !important;
      }

      .plumbob-sm .top div,
      .plumbob-sm .bottom div {
        height: 67px !important;
        border-left-width: 25px !important;
        border-right-width: 25px !important;
      }

      .plumbob-md .top div,
      .plumbob-md .bottom div {
        height: 104px !important;
        border-left-width: 39px !important;
        border-right-width: 39px !important;
      }

      .plumbob-lg .top div,
      .plumbob-lg .bottom div {
        height: 133px !important;
        border-left-width: 50px !important;
        border-right-width: 50px !important;
      }

      /* Face orientations - exact CodePen angles */
      .front {
        transform: rotateX(22deg);
      }
      .back {
        transform: rotateX(-22deg);
      }
      .left {
        transform: rotateY(-90deg) rotateX(22deg);
      }
      .right {
        transform: rotateY(90deg) rotateX(22deg);
      }

      /* Spin animation - only one transform per element (Rule 4) */
      .plumbob {
        position: relative;
        display: inline-block;
        transform-style: preserve-3d;
        animation: plumbob-spin 8s linear infinite;
      }

      @keyframes plumbob-spin {
        from {
          transform: rotateY(0);
        }
        to {
          transform: rotateY(360deg);
        }
      }

      /* Top and bottom pyramid positioning */
      .top,
      .bottom {
        position: absolute;
        left: 0;
        width: 100%;
        transform-style: preserve-3d;
        transform: translateZ(
          1px
        ); /* Small Z offset to prevent face collision */
      }
      .top {
        top: 0;
      }
      .bottom {
        bottom: 0;
      }

      /* Color variants - using border-top/bottom directly (Rule 5) */
      /* Green — Healthy mood */
      .plumbob-green .top div {
        border-bottom-style: solid;
        border-bottom-width: 200px;
        border-bottom-color: rgba(0, 150, 50, 0.3);
        filter: drop-shadow(0 0 5px rgba(0, 100, 0, 0.5));
      }
      .plumbob-green .bottom div {
        border-top-style: solid;
        border-top-width: 200px;
        border-top-color: rgba(0, 150, 50, 0.4);
        filter: drop-shadow(0 0 5px rgba(0, 100, 0, 0.5));
      }

      /* Yellow — Okay mood */
      .plumbob-yellow .top div {
        border-bottom-style: solid;
        border-bottom-width: 200px;
        border-bottom-color: rgba(200, 200, 0, 0.3);
        filter: drop-shadow(0 0 5px rgba(180, 180, 0, 0.5));
      }
      .plumbob-yellow .bottom div {
        border-top-style: solid;
        border-top-width: 200px;
        border-top-color: rgba(200, 200, 0, 0.4);
        filter: drop-shadow(0 0 5px rgba(180, 180, 0, 0.5));
      }

      /* Red — Critical mood */
      .plumbob-red .top div {
        border-bottom-style: solid;
        border-bottom-width: 200px;
        border-bottom-color: rgba(200, 0, 0, 0.3);
        filter: drop-shadow(0 0 5px rgba(180, 0, 0, 0.5));
      }
      .plumbob-red .bottom div {
        border-top-style: solid;
        border-top-width: 200px;
        border-top-color: rgba(200, 0, 0, 0.4);
        filter: drop-shadow(0 0 5px rgba(180, 0, 0, 0.5));
      }

      /* Orange — Unhappy mood */
      .plumbob-orange .top div {
        border-bottom-style: solid;
        border-bottom-width: 200px;
        border-bottom-color: rgba(240, 160, 80, 0.35);
        filter: drop-shadow(0 0 5px rgba(200, 100, 30, 0.5));
      }
      .plumbob-orange .bottom div {
        border-top-style: solid;
        border-top-width: 200px;
        border-top-color: rgba(240, 160, 80, 0.45);
        filter: drop-shadow(0 0 5px rgba(200, 100, 30, 0.5));
      }

      /* Blue — Ghost mood */
      .plumbob-blue .top div {
        border-bottom-style: solid;
        border-bottom-width: 200px;
        border-bottom-color: rgba(128, 192, 224, 0.35);
        filter: drop-shadow(0 0 5px rgba(80, 144, 176, 0.5));
      }
      .plumbob-blue .bottom div {
        border-top-style: solid;
        border-top-width: 200px;
        border-top-color: rgba(128, 192, 224, 0.45);
        filter: drop-shadow(0 0 5px rgba(80, 144, 176, 0.5));
      }

      /* Size-specific color overrides - overriding the 200px borders with size-specific heights */
      .plumbob-xs.plumbob-green .top div {
        border-bottom-width: 31px !important;
      }
      .plumbob-xs.plumbob-green .bottom div {
        border-top-width: 31px !important;
      }
      .plumbob-xs.plumbob-yellow .top div {
        border-bottom-width: 31px !important;
      }
      .plumbob-xs.plumbob-yellow .bottom div {
        border-top-width: 31px !important;
      }
      .plumbob-xs.plumbob-orange .top div {
        border-bottom-width: 31px !important;
      }
      .plumbob-xs.plumbob-orange .bottom div {
        border-top-width: 31px !important;
      }
      .plumbob-xs.plumbob-red .top div {
        border-bottom-width: 31px !important;
      }
      .plumbob-xs.plumbob-red .bottom div {
        border-top-width: 31px !important;
      }
      .plumbob-xs.plumbob-blue .top div {
        border-bottom-width: 31px !important;
      }
      .plumbob-xs.plumbob-blue .bottom div {
        border-top-width: 31px !important;
      }

      .plumbob-sm.plumbob-green .top div {
        border-bottom-width: 67px !important;
      }
      .plumbob-sm.plumbob-green .bottom div {
        border-top-width: 67px !important;
      }
      .plumbob-sm.plumbob-yellow .top div {
        border-bottom-width: 67px !important;
      }
      .plumbob-sm.plumbob-yellow .bottom div {
        border-top-width: 67px !important;
      }
      .plumbob-sm.plumbob-orange .top div {
        border-bottom-width: 67px !important;
      }
      .plumbob-sm.plumbob-orange .bottom div {
        border-top-width: 67px !important;
      }
      .plumbob-sm.plumbob-red .top div {
        border-bottom-width: 67px !important;
      }
      .plumbob-sm.plumbob-red .bottom div {
        border-top-width: 67px !important;
      }
      .plumbob-sm.plumbob-blue .top div {
        border-bottom-width: 67px !important;
      }
      .plumbob-sm.plumbob-blue .bottom div {
        border-top-width: 67px !important;
      }

      .plumbob-md.plumbob-green .top div {
        border-bottom-width: 104px !important;
      }
      .plumbob-md.plumbob-green .bottom div {
        border-top-width: 104px !important;
      }
      .plumbob-md.plumbob-yellow .top div {
        border-bottom-width: 104px !important;
      }
      .plumbob-md.plumbob-yellow .bottom div {
        border-top-width: 104px !important;
      }
      .plumbob-md.plumbob-orange .top div {
        border-bottom-width: 104px !important;
      }
      .plumbob-md.plumbob-orange .bottom div {
        border-top-width: 104px !important;
      }
      .plumbob-md.plumbob-red .top div {
        border-bottom-width: 104px !important;
      }
      .plumbob-md.plumbob-red .bottom div {
        border-top-width: 104px !important;
      }
      .plumbob-md.plumbob-blue .top div {
        border-bottom-width: 104px !important;
      }
      .plumbob-md.plumbob-blue .bottom div {
        border-top-width: 104px !important;
      }

      .plumbob-lg.plumbob-green .top div {
        border-bottom-width: 133px !important;
      }
      .plumbob-lg.plumbob-green .bottom div {
        border-top-width: 133px !important;
      }
      .plumbob-lg.plumbob-yellow .top div {
        border-bottom-width: 133px !important;
      }
      .plumbob-lg.plumbob-yellow .bottom div {
        border-top-width: 133px !important;
      }
      .plumbob-lg.plumbob-orange .top div {
        border-bottom-width: 133px !important;
      }
      .plumbob-lg.plumbob-orange .bottom div {
        border-top-width: 133px !important;
      }
      .plumbob-lg.plumbob-red .top div {
        border-bottom-width: 133px !important;
      }
      .plumbob-lg.plumbob-red .bottom div {
        border-top-width: 133px !important;
      }
      .plumbob-lg.plumbob-blue .top div {
        border-bottom-width: 133px !important;
      }
      .plumbob-lg.plumbob-blue .bottom div {
        border-top-width: 133px !important;
      }
    `;
  }

  _resolveMood() {
    if (!this._hass || !this._config || !this._config.entity) {
      return this.mood || "green";
    }
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj || stateObj.state === undefined) {
      return this.mood || "green";
    }
    const state = stateObj.state;

    // Check state_map first (from this.stateMap property, not this._config.state_map)
    if (this.stateMap && this.stateMap[state] !== undefined) {
      return this.stateMap[state];
    }

    // Also check config's state_map if set
    if (
      this._config &&
      this._config.state_map &&
      this._config.state_map[state] !== undefined
    ) {
      return this._config.state_map[state];
    }

    // Known string states
    switch (state) {
      case "on":
      case "home":
      case "active":
      case "running":
      case "cooling":
      case "heating":
      case "ok":
      case "open":
        return "green";
      case "off":
      case "unavailable":
      case "unknown":
      case "error":
      case "problem":
      case "closed":
        return "red";
      case "idle":
      case "pending":
      case "standby":
      case "paused":
      case "not_home":
      case "away":
        return "yellow";
    }

    const numValue = parseFloat(state);
    if (!isNaN(numValue)) {
      const greenAbove = this.greenAbove !== undefined ? this.greenAbove : 70;
      const yellowAbove =
        this.yellowAbove !== undefined ? this.yellowAbove : 40;
      if (numValue >= greenAbove) return "green";
      if (numValue >= yellowAbove) return "yellow";
      return "red";
    }

    return this.mood || "green";
  }

  _sizeClass() {
    if (this.size <= 30) return "plumbob-xs";
    if (this.size <= 50) return "plumbob-sm";
    if (this.size <= 78) return "plumbob-md";
    return "plumbob-lg";
  }

  render() {
    const mood = this._resolveMood();
    const title = (this._config && this._config.title) || "";
    const subtitle = (this._config && this._config.subtitle) || "";

    return html`
      <div class="plumbob-wrapper">
        ${title ? html`<div class="plumbob-card-title">${title}</div>` : ""}
        <div class="plumbob ${this._sizeClass()} plumbob-${mood}">
          <div class="top">
            <div class="front"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="back"></div>
          </div>
          <div class="bottom">
            <div class="front"></div>
            <div class="left"></div>
            <div class="right"></div>
            <div class="back"></div>
          </div>
        </div>
        ${subtitle ? html`<div class="plumbob-card-subtitle">${subtitle}</div>` : ""}
      </div>
    `;
  }

  static getStubConfig() {
    return { title: "Household Morale", mood: "green", size: 70 };
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("sims-plumbob-card", SimsPlumbobCard);
