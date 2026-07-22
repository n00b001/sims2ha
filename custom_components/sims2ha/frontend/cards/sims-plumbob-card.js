// Sims 2 Plumbob Card - Custom Lovelace card for displaying entity states as plumbob diamonds
class SimsPlumbobCard extends LitElement {
  static properties = {
    entity: { type: String },
    size: { type: String },
    color: { type: String },
    animationSpeed: { type: String },
    showGlow: { type: Boolean }
  };

  constructor() {
    super();
    this._state = undefined;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Entity is required');
    }
    this.entity = config.entity;
    this.size = config.size || '48px';
    this.color = config.color || '';
    this.animationSpeed = config.animationSpeed || '8s';
    this.showGlow = config.showGlow !== undefined ? config.showGlow : true;
  }

  set hass(hass) {
    const state = hass.states[this.entity];
    if (!state) {
      this._state = undefined;
      return;
    }
    this._state = state.state;
  }

  static get styles() {
    return css`
      :host {
        --plumbob-size: 48px;
        --plumbob-duration: 8s;
        --plumbob-angle: 22deg;
        --plumbob-perspective: 600px;
        --plumbob-glow: radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 50%);
        --plumbob-face-top: rgba(0,150,50,0.3);
        --plumbob-face-bottom: rgba(0,150,50,0.4);
        display: inline-block;
        width: var(--plumbob-size);
        height: var(--plumbob-size);
      }

      .plumbob-xs { --plumbob-size: 30px; }
      .plumbob-sm { --plumbob-size: 50px; }
      .plumbob-md { --plumbob-size: 78px; }
      .plumbob-lg { --plumbob-size: 100px; }
      .plumbob-xl { --plumbob-size: 150px; }

      .plumbob-slow { --plumbob-duration: 12s; }
      .plumbob-fast { --plumbob-duration: 4s; }

      .plumbob-container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .plumbob-scene {
        position: relative;
        width: 100%;
        height: 100%;
        perspective: var(--plumbob-perspective);
      }

      .plumbob-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--plumbob-glow);
        border-radius: 50%;
        pointer-events: none;
      }

      .plumbob-body {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%) rotateX(var(--plumbob-angle));
        transform-style: preserve-3d;
      }

      .plumbob-body > div {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--plumbob-face-top);
      }

      .plumbob-body .front {
        transform: translateZ(calc(100% / 2));
        background: var(--plumbob-face-top);
      }

      .plumbob-body .back {
        transform: rotateY(180deg) translateZ(calc(100% / 2));
        background: var(--plumbob-face-bottom);
      }

      .plumbob-body .left {
        transform: rotateY(-90deg) translateZ(calc(100% / 2));
        background: var(--plumbob-face-top);
      }

      .plumbob-body .right {
        transform: rotateY(90deg) translateZ(calc(100% / 2));
        background: var(--plumbob-face-top);
      }

      .plumbob-body .top {
        transform: rotateX(90deg) translateZ(calc(100% / 2));
        background: var(--plumbob-face-bottom);
      }

      .plumbob-body .bottom {
        transform: rotateX(-90deg) translateZ(calc(100% / 2));
        background: var(--plumbob-face-bottom);
      }

      :host([animated]) .plumbob-body {
        animation: plumbob-spin var(--plumbob-duration) linear infinite;
      }

      @keyframes plumbob-spin {
        from { transform: translate(-50%, -50%) rotateX(var(--plumbob-angle)) rotateY(0deg); }
        to { transform: translate(-50%, -50%) rotateX(var(--plumbob-angle)) rotateY(360deg); }
      }

      :host(:hover) .plumbob-glow {
        animation: plumbob-glow-pulse 2s ease-in-out infinite;
      }

      @keyframes plumbob-glow-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }

      /* Tooltip */
      .plumbob-container:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }

      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }
    `;
  }

  render() {
    const plumbobColor = this.computePlumbobColor(this._state);
    const sizeValue = this.size || '48px';
    const animationSpeed = this.animationSpeed || '8s';
    const showGlow = this.showGlow !== undefined ? this.showGlow : true;

    // Update CSS variables based on plumbob color
    this.style.setProperty('--plumbob-face-top', this.getFaceTopColor(plumbobColor));
    this.style.setProperty('--plumbob-face-bottom', this.getFaceBottomColor(plumbobColor));
    this.style.setProperty('--plumbob-size', sizeValue);
    this.style.setProperty('--plumbob-duration', animationSpeed);
    this.style.setProperty('--plumbob-glow', showGlow ?
      `radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 50%)` :
      'transparent');

    return html`
      <div
        class="plumbob-container"
        @click=${this._handleClick}
        data-tooltip=${this._computeTooltip()}
        ?animated=${this._state !== undefined}
        ?disabled=${this._state === undefined}
      >
        <div class="plumbob-scene">
          <div class="plumbob-glow"></div>
          <div class="plumbob-body">
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
        </div>
      </div>
    `;
  }

  computePlumbobColor(state) {
    switch(state) {
      case 'on': case 'open': case 'home': return 'green';
      case 'off': case 'closed': case 'not_home': return 'red';
      case 'idle': case 'standby': case 'unknown': return 'blue';
      default: return this.computeGradientColor(state);
    }
  }

  computeGradientColor(state) {
    // For numeric states, return a color based on the value
    const numValue = parseFloat(state);
    if (!isNaN(numValue)) {
      // Normalize to 0-100 range
      const clamped = Math.max(0, Math.min(100, numValue));
      if (clamped < 30) return 'red';
      if (clamped < 50) return 'orange';
      if (clamped < 70) return 'yellow';
      return 'green';
    }
    return 'blue'; // default
  }

  getFaceTopColor(color) {
    switch(color) {
      case 'green': return 'rgba(123,201,66,0.3)';
      case 'red': return 'rgba(192,57,43,0.3)';
      case 'yellow': return 'rgba(242,193,78,0.3)';
      case 'blue': return 'rgba(47,134,197,0.3)';
      case 'orange': return 'rgba(255,152,0,0.3)';
      default: return 'rgba(47,134,197,0.3)';
    }
  }

  getFaceBottomColor(color) {
    switch(color) {
      case 'green': return 'rgba(123,201,66,0.4)';
      case 'red': return 'rgba(192,57,43,0.4)';
      case 'yellow': return 'rgba(242,193,78,0.4)';
      case 'blue': return 'rgba(47,134,197,0.4)';
      case 'orange': return 'rgba(255,152,0,0.4)';
      default: return 'rgba(47,134,197,0.4)';
    }
  }

  _computeTooltip() {
    if (!this._state) return 'Unknown';
    return `${this.entity}: ${this._state}`;
  }

  _handleClick() {
    // Toggle binary entities on click
    if (this._state === 'on' || this._state === 'off' ||
        this._state === 'open' || this._state === 'closed') {
      // Fire a lovelace event to toggle the entity
      this.dispatchEvent(new Event('hass-more-info', {
        composed: true,
        bubbles: true
      }));
    }
  }
}

// Register the custom element
customElements.define('sims-plumbob-card', SimsPlumbobCard);