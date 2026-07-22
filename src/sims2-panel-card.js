// Sims 2 Panel Card - Custom Lovelace card for panel-style containers
class SimsPanelCard extends LitElement {
  static properties = {
    header: { type: String },
    content: { type: String }
  };

  constructor() {
    super();
    this.header = '';
    this.content = '';
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this.header = config.header || '';
    this.content = config.content || '';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 8px 0;
      }
      .card-container {
        background: linear-gradient(180deg, var(--sims2-sky-blue, #7EC8E6) 0%, #5BB4D8 100%);
        border: 2px solid var(--sims2-panel-blue-deep, #173A52);
        border-radius: 12px;
        box-shadow:
          0 4px 12px rgba(14,22,40,0.25),
          inset 0 1px 0 rgba(255,255,255,0.3);
        position: relative;
        overflow: hidden;
      }
      .card-header {
        background: rgba(14,22,40,0.2);
        border-bottom: 2px solid var(--sims2-gold, #E0B66B);
        padding: 8px 12px;
        font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif);
        font-size: 18px;
        font-weight: 600;
        color: var(--sims2-cream-text, #FFF6E0);
        text-align: center;
        letter-spacing: 0.04em;
      }
      .card-header::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 4px;
        background: linear-gradient(90deg, transparent, var(--sims2-gold, #E0B66B), transparent);
      }
      .card-content {
        padding: 12px;
        color: var(--sims2-cream-text, #FFF6E0);
        font-family: var(--sims2-font-body, "Benguiat Gothic", system-ui, sans-serif);
        line-height: 1.5;
      }
      :host(:hover) .card-container {
        box-shadow:
          0 6px 16px rgba(14,22,40,0.35),
          inset 0 1px 0 rgba(255,255,255,0.4);
      }
    `;
  }

  render() {
    return html`
      <div class="card-container">
        ${this.header ? html`<div class="card-header">${this.header}</div>` : ''}
        <div class="card-content">${this.content}</div>
      </div>
    `;
  }
}

customElements.define('sims-panel-card', SimsPanelCard);