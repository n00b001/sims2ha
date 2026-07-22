// Sims 2 Panel Card - Custom Lovelace card for panel-style containers
// Accepts an 'entities' config array to render entity controls/sensors
class SimsPanelCard extends LitElement {
  static properties = {
    header: { type: String },
    entities: { type: Array }
  };

  constructor() {
    super();
    this.header = '';
    this.entities = [];
    this._hass = null;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this.header = config.header || '';
    this.entities = config.entities || [];
  }

  set hass(hass) {
    this._hass = hass;
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
        position: relative;
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
      .entity-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .entity-row:last-child {
        border-bottom: none;
      }
      .entity-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--sims2-cream-text, #FFF6E0);
      }
      .entity-state {
        font-size: 14px;
        color: var(--sims2-plumbob-green, #7BC942);
        font-weight: 600;
      }
      :host(:hover) .card-container {
        box-shadow:
          0 6px 16px rgba(14,22,40,0.35),
          inset 0 1px 0 rgba(255,255,255,0.4);
      }
    `;
  }

  _getEntityState(entityId) {
    if (!this._hass || !entityId) return null;
    return this._hass.states[entityId];
  }

  _getEntityName(stateObj) {
    if (!stateObj) return 'Unknown';
    return stateObj.attributes.friendly_name || stateObj.entity_id.split('.').pop();
  }

  _getStateDisplay(stateObj) {
    if (!stateObj) return 'Unavailable';
    const state = stateObj.state;
    // Format the state nicely
    if (state === 'on') return 'On';
    if (state === 'off') return 'Off';
    if (state === 'home') return 'Home';
    if (state === 'not_home') return 'Away';
    if (state === 'open') return 'Open';
    if (state === 'closed') return 'Closed';
    if (state === 'locked') return 'Locked';
    if (state === 'unlocked') return 'Unlocked';
    if (state === 'idle') return 'Idle';
    if (state === 'running') return 'Running';
    if (state === 'unavailable') return 'Unavailable';
    if (state === 'unknown') return 'Unknown';
    // Return unit of measurement if present
    if (stateObj.attributes.unit_of_measurement) {
      return `${state} ${stateObj.attributes.unit_of_measurement}`;
    }
    return state;
  }

  _toggleEntity(entityId) {
    if (!this._hass) return;
    const stateObj = this._hass.states[entityId];
    if (!stateObj) return;
    const domain = entityId.split('.')[0];
    if (domain === 'light' || domain === 'switch') {
      this._hass.callService(domain, 'toggle', { entity_id: entityId });
    } else if (domain === 'lock') {
      const action = stateObj.state === 'locked' ? 'unlock' : 'lock';
      this._hass.callService(domain, action, { entity_id: entityId });
    }
  }

  render() {
    return html`
      <div class="card-container">
        ${this.header ? html`<div class="card-header">${this.header}</div>` : ''}
        <div class="card-content">
          ${this.entities.length > 0
            ? this.entities.map(entityId => {
                const stateObj = this._getEntityState(entityId);
                return html`
                  <div class="entity-row" @click=${() => this._toggleEntity(entityId)}>
                    <span class="entity-name">${this._getEntityName(stateObj)}</span>
                    <span class="entity-state">${this._getStateDisplay(stateObj)}</span>
                  </div>
                `;
              })
            : html`<slot></slot>`
          }
        </div>
      </div>
    `;
  }
}

customElements.define('sims-panel-card', SimsPanelCard);