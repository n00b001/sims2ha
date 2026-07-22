// Sims 2 Plumbob Card - 3D spinning diamond using pure CSS border triangles
// Pattern from artifacts/sims2-plumbob.css: two pyramids (top/bottom),
// each with 4 faces made from CSS border triangles.
class SimsPlumbobCard extends LitElement {
  static properties = {
    entity: { type: String },
    mood: { type: String },
    size: { type: Number },
    greenAbove: { type: Number, attribute: 'green_above' },
    yellowAbove: { type: Number, attribute: 'yellow_above' },
    stateMap: { type: Object, attribute: 'state_map' }
  };

  constructor() {
    super();
    this.mood = 'green';
    this.size = 70;
    this.greenAbove = 70;
    this.yellowAbove = 40;
    this.stateMap = {};
    this._hass = null;
    this._config = null;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = config;
    this.mood = config.mood || 'green';
    this.size = config.size || 70;
    this.greenAbove = config.green_above !== undefined ? config.green_above : 70;
    this.yellowAbove = config.yellow_above !== undefined ? config.yellow_above : 40;
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
        padding: 8px 0;
      }
      .plumbob-wrapper {
        text-align: center;
      }
      .plumbob-card-title {
        font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif);
        color: var(--sims2-gold, #E8B44D);
        font-size: 16px;
        margin-bottom: 4px;
      }
      .plumbob-card-subtitle {
        font-family: var(--sims2-font-body, "Benguiat Gothic", system-ui, sans-serif);
        color: var(--sims2-cream-text, #FFF6E0);
        font-size: 12px;
        opacity: 0.7;
        margin-top: 4px;
      }

      /* --- Spin animation --- */
      @keyframes plumbob-spin {
        from { transform: rotateY(0deg); }
        to   { transform: rotateY(360deg); }
      }

      /* --- Plumbob root element --- */
      .plumbob {
        position: relative;
        display: inline-block;
        transform-style: preserve-3d;
        animation: plumbob-spin 8s linear infinite;
      }

      .plumbob, .top, .bottom, .top div, .bottom div {
        /* NO box-sizing: border-box here - critical for triangle geometry */
      }

      /* --- Top and bottom pyramids --- */
      .top, .bottom {
        position: absolute;
        left: 0;
        transform-style: preserve-3d;
        transform: translateZ(1px);
      }
      .top    { top: 0; }
      .bottom { bottom: 0; }

      /* --- Faces — CSS border triangles --- */
      .top div,
      .bottom div {
        position: absolute;
        left: 0;
        width: 0;
      }
      .top div    { bottom: 0; }
      .bottom div { top: 0; }

      /* --- Face orientation — CodePen angles --- */
      .front { transform: rotateX(22deg); }
      .back  { transform: rotateX(-22deg); }
      .left  { transform: rotateY(-90deg) rotateX(22deg); }
      .right { transform: rotateY(90deg) rotateX(22deg); }

      /* --- Size variants --- */
      .plumbob-xs { width: 30px;  height: 74px; }
      .plumbob-xs .top, .plumbob-xs .bottom { height: 40px; width: 30px; }
      .plumbob-xs .top div, .plumbob-xs .bottom div {
        height: 40px !important;
        border-left: 15px solid transparent !important;
        border-right: 15px solid transparent !important;
      }

      .plumbob-sm { width: 50px;  height: 123px; }
      .plumbob-sm .top, .plumbob-sm .bottom { height: 67px; width: 50px; }
      .plumbob-sm .top div, .plumbob-sm .bottom div {
        height: 67px !important;
        border-left: 25px solid transparent !important;
        border-right: 25px solid transparent !important;
      }

      .plumbob-md { width: 78px;  height: 192px; }
      .plumbob-md .top, .plumbob-md .bottom { height: 104px; width: 78px; }
      .plumbob-md .top div, .plumbob-md .bottom div {
        height: 104px !important;
        border-left: 39px solid transparent !important;
        border-right: 39px solid transparent !important;
      }

      .plumbob-lg { width: 100px; height: 247px; }
      .plumbob-lg .top, .plumbob-lg .bottom { height: 133px; width: 100px; }
      .plumbob-lg .top div, .plumbob-lg .bottom div {
        height: 133px !important;
        border-left: 50px solid transparent !important;
        border-right: 50px solid transparent !important;
      }
    `;
  }

  _resolveMood() {
    if (!this._hass || !this._config || !this._config.entity) {
      return this.mood;
    }
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj || stateObj.state === undefined) {
      return this.mood;
    }
    const state = stateObj.state;

    // Check state_map first
    if (this.stateMap[state] !== undefined) {
      return this.stateMap[state];
    }

    // Known string states
    switch (state) {
      case 'on': case 'home': case 'active': case 'running':
      case 'cooling': case 'heating': case 'ok': case 'open':
        return 'green';
      case 'off': case 'unavailable': case 'unknown': case 'error':
      case 'problem': case 'closed':
        return 'red';
      case 'idle': case 'pending': case 'standby': case 'paused':
      case 'not_home': case 'away':
        return 'yellow';
    }

    const numValue = parseFloat(state);
    if (!isNaN(numValue)) {
      if (numValue >= this.greenAbove) return 'green';
      if (numValue >= this.yellowAbove) return 'yellow';
      return 'red';
    }

    return this.mood;
  }

  _getColorValues(mood) {
    switch(mood) {
      case 'red':
        return {
          topColor: 'rgba(200,0,0,0.3)',
          bottomColor: 'rgba(200,0,0,0.4)',
          shadow: 'rgba(180,0,0,0.5)'
        };
      case 'yellow':
        return {
          topColor: 'rgba(200,200,0,0.3)',
          bottomColor: 'rgba(200,200,0,0.4)',
          shadow: 'rgba(180,180,0,0.5)'
        };
      case 'orange':
        return {
          topColor: 'rgba(240,160,80,0.35)',
          bottomColor: 'rgba(240,160,80,0.45)',
          shadow: 'rgba(200,100,30,0.5)'
        };
      case 'blue':
        return {
          topColor: 'rgba(128,192,224,0.35)',
          bottomColor: 'rgba(128,192,224,0.45)',
          shadow: 'rgba(80,144,176,0.5)'
        };
      case 'green':
      default:
        return {
          topColor: 'rgba(0,150,50,0.3)',
          bottomColor: 'rgba(0,150,50,0.4)',
          shadow: 'rgba(0,100,0,0.5)'
        };
    }
  }

  _sizeClass() {
    if (this.size <= 30) return 'plumbob-xs';
    if (this.size <= 50) return 'plumbob-sm';
    if (this.size <= 78) return 'plumbob-md';
    return 'plumbob-lg';
  }

  render() {
    const mood = this._resolveMood();
    const colors = this._getColorValues(mood);
    const title = this._config && this._config.title || '';
    const subtitle = this._config && this._config.subtitle || '';

    const topFaceStyle = `border-bottom: ${this._pyramidHeight()}px solid ${colors.topColor}; filter: drop-shadow(0 0 5px ${colors.shadow});`;
    const bottomFaceStyle = `border-top: ${this._pyramidHeight()}px solid ${colors.bottomColor}; filter: drop-shadow(0 0 5px ${colors.shadow});`;
    const sideBorder = `${this._halfWidth()}px`;

    return html`
      <div class="plumbob-wrapper">
        ${title ? html`<div class="plumbob-card-title">${title}</div>` : ''}
        <div class="plumbob ${this._sizeClass()}">
          <div class="top">
            <div class="front" style="${topFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="left" style="${topFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="right" style="${topFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="back" style="${topFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
          </div>
          <div class="bottom">
            <div class="front" style="${bottomFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="left" style="${bottomFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="right" style="${bottomFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
            <div class="back" style="${bottomFaceStyle} border-left: ${sideBorder} solid transparent; border-right: ${sideBorder} solid transparent;"></div>
          </div>
        </div>
        ${subtitle ? html`<div class="plumbob-card-subtitle">${subtitle}</div>` : ''}
      </div>
    `;
  }

  _halfWidth() {
    return Math.round(this.size / 2);
  }

  _pyramidHeight() {
    return Math.round(this.size * 1.33);
  }

  static getStubConfig() {
    return { title: "Household Morale", mood: "green", size: 70 };
  }

  getCardSize() {
    return 2;
  }
}

customElements.define('sims-plumbob-card', SimsPlumbobCard);