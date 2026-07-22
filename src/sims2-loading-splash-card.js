// Sims 2 Loading Splash Card - Full-screen boot screen mimicking "Reticulating Splines"
class SimsLoadingSplashCard extends HTMLElement {
  constructor() {
    super();
    this._unsubscribe = null;
    this._tips = [
      "Reticulating splines...",
      "Simulating consciousness...",
      "Loading neighborhood data...",
      "Initializing plumbob guidance system...",
      "Calibrating mood algorithms...",
      "Generating suburban landscapes...",
      "Prepping the gossip network...",
      "Loading expansion packs...",
      "Warming up the simoleon printer...",
      "Activating free will subroutine...",
      "Downloading latest neighborhood gossip...",
      "Initializing aspiration system...",
      "Preparing the want/fear matrix...",
      "Loading social interaction protocols...",
      "Initializing object placement AI..."
    ];
    this._currentTipIndex = 0;
    this._tipInterval = null;
  }

  connectedCallback() {
    this._render();
    this._startTipRotation();
    this._listenForHomeAssistantReady();
  }

  disconnectedCallback() {
    this._stopTipRotation();
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }

  _startTipRotation() {
    this._tipInterval = setInterval(() => {
      this._currentTipIndex = (this._currentTipIndex + 1) % this._tips.length;
      this._updateTip();
    }, 5000); // Change tip every 5 seconds
  }

  _stopTipRotation() {
    if (this._tipInterval) {
      clearInterval(this._tipInterval);
      this._tipInterval = null;
    }
  }

  _updateTip() {
    const tipElement = this.shadowRoot?.querySelector('.loading-tip');
    if (tipElement) {
      tipElement.textContent = this._tips[this._currentTipIndex];
    }
  }

  _listenForHomeAssistantReady() {
    // Listen for homeassistant-connected event to remove ourselves
    this._unsubscribe = () => {
      this.remove();
    };
    window.addEventListener('homeassistant-connected', this._unsubscribe);
  }

  _render() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(ellipse at center, #0E1628 0%, #080D18 100%);
          background-image:
            radial-gradient(ellipse 40% 35% at 50% 30%, rgba(74, 222, 128, 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232, 180, 77, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 25% 55% at 60% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
            radial-gradient(ellipse 20% 50% at 75% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 22% 45% at 70% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
            radial-gradient(ellipse 20% 40% at 55% 55%, rgba(56, 120, 180, 0.07) 0%, transparent 100%),
            radial-gradient(ellipse 22% 45% at 35% 45%, rgba(74, 160, 210, 0.10) 0%, transparent 100%),
            radial-gradient(ellipse 20% 50% at 25% 35%, rgba(56, 120, 180, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 25% 55% at 40% 30%, rgba(74, 160, 210, 0.12) 0%, transparent 100%),
            radial-gradient(ellipse 20% 50% at 50% 15%, rgba(74, 160, 210, 0.08) 0%, transparent 100%),
            radial-gradient(ellipse 22% 50% at 68% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
            radial-gradient(ellipse 22% 50% at 32% 25%, rgba(100, 170, 220, 0.06) 0%, transparent 100%),
            radial-gradient(ellipse 18% 40% at 80% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
            radial-gradient(ellipse 18% 40% at 20% 40%, rgba(56, 120, 180, 0.05) 0%, transparent 100%),
            radial-gradient(ellipse 75% 75% at 50% 30%, transparent 10%, rgba(14, 22, 40, 0.6) 100%);
          background-attachment: fixed;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: var(--sims2-font-display, "Benguiat Gothic", Georgia, serif);
          color: var(--sims2-cream-text, #FFF6E0);
          overflow: hidden;
        }

        .splash-content {
          text-align: center;
          max-width: 80vw;
          padding: 20px;
        }

        .loading-plumbob {
          width: 120px;
          height: 120px;
          margin-bottom: 24px;
          background: linear-gradient(105deg, #B7F36B 0%, #7BC942 35%, #22C55E 55%, #16A34A 100%);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          animation: sims2-loading-plum 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5));
        }

        .loading-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 3px rgba(232, 180, 77, 0.4);
          color: var(--sims2-gold, #FFD700);
          animation: sims2-loading-pulse 2s ease-in-out infinite;
        }

        .loading-subtitle {
          font-size: 18px;
          margin-bottom: 16px;
          opacity: 0.9;
          color: var(--sims2-sky-blue, #7EC8E6);
        }

        .loading-tip {
          font-size: 16px;
          font-style: italic;
          max-width: 600px;
          line-height: 1.4;
          padding: 0 20px;
          animation: fade-in 2s ease-out;
        }

        @keyframes sims2-loading-plum {
          0%   { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
          25%  { transform: rotate(90deg) scale(1.15); filter: drop-shadow(0 0 16px rgba(74, 222, 128, 0.8)); }
          50%  { transform: rotate(180deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
          75%  { transform: rotate(270deg) scale(1.15); filter: drop-shadow(0 0 16px rgba(74, 222, 128, 0.8)); }
          100% { transform: rotate(360deg) scale(1); filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.5)); }
        }

        @keyframes sims2-loading-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; text-shadow: 0 0 12px rgba(255, 215, 0, 0.6); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }

        .fade-out {
          animation: fade-out 1s ease-in forwards;
        }
      </style>

      <div class="splash-content">
        <div class="loading-plumbob"></div>
        <div class="loading-title">The Sims 2</div>
        <div class="loading-subtitle">Loading Neighborhood...</div>
        <div class="loading-tip" id="loading-tip">${this._tips[this._currentTipIndex]}</div>
      </div>
    `;
  }
}

customElements.define('sims-loading-splash', SimsLoadingSplashCard);

// Register as a custom card for Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims-loading-splash",
  name: "Sims 2 Loading Splash",
  description: "Full-screen boot screen mimicking 'Reticulating Splines' from The Sims 2 loading screen",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});