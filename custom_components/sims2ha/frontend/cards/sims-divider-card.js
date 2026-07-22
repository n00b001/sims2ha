// Sims 2 Divider Card - Custom Lovelace card for decorative dividers
class SimsDividerCard extends LitElement {
  static properties = {
    ornamentType: { type: String },
    ornamentSize: { type: String },
    height: { type: String },
  };

  constructor() {
    super();
    this.ornamentType = "plumbob";
    this.ornamentSize = "medium";
    this.height = "24px";
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this.ornamentType = config.ornamentType || "plumbob";
    this.ornamentSize = config.ornamentSize || "medium";
    this.height = config.height || "24px";
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 16px 0;
      }
      .divider-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative: var(--height: 24px; }
      height: var(--divider-height, 24px);
        background: transparent;
      }
      .divider-line {
        flex: 1;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--sims2-gold-trim, #D8C39A), transparent);
      }
      .divider-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
      }
      .divider-ornament.plumbob {
        width: 24px;
        height: 24px;
        background: var(--sims2-plumbob-green, #7BC942);
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        margin: 0 8px;
        animation: plumbob-pulse 3s ease-in-out infinite;
      }
      .divider-ornament.sim {
        width: 24px;
        height: 24px;
        background: #F2C14E;
        border-radius: 50%;
        margin: 0 8px;
        animation: sim-bounce 2s ease-in-out infinite;
      }
      .divider-ornament.gold {
        width: 24px;
        height: 24px;
        background: var(--sims2-gold, #E0B66B);
        border-radius: 50%;
        margin: 0 8px;
        animation: gold-shimmer 2s ease-in-out infinite;
      }
      @keyframes plumbob-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      @keyframes sim-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes gold-shimmer {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
    `;
  }

  render() {
    const ornamentClass = `divider-ornament ${this.ornamentType}`;
    return html`
      <div class="divider-container" style="height: ${this.height};">
        <div class="divider-line"></div>
        <div class="${ornamentClass}"></div>
        <div class="divider-line"></div>
      </div>
    `;
  }
}

customElements.define("sims-divider-card", SimsDividerCard);
