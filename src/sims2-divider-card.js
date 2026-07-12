/**
 * sims2-divider-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-divider
 *
 * A decorative divider featuring a plumbob-shaped diamond separator with gold
 * gradient trim lines on either side — inspired by the Sims 2 UI section
 * dividers.
 *
 * Place it manually between sections in a dashboard to break content into
 * visually distinct areas. The mood colour (green / yellow / red) matches
 * the existing plumbob card convention.
 *
 * No build step, no dependencies. Vanilla web component, Shadow DOM.
 *
 * Example configuration:
 *
 *   type: custom:sims2-divider
 *   mood: green       # green | yellow | red (default: green)
 *   size: 30          # diamond height in pixels
 *
 * Fan tribute. "The Sims 2" and the plumbob are trademarks of Electronic Arts.
 * ---------------------------------------------------------------------------
 */

const SIMS2_DIVIDER_DEFAULTS = {
  mood: "green",
  size: 30,
};

class Sims2DividerCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._config = { ...SIMS2_DIVIDER_DEFAULTS };
  }

  static getStubConfig() {
    return { mood: "green", size: 30 };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration for sims2-divider");
    }
    this._config = { ...SIMS2_DIVIDER_DEFAULTS, ...config };
    // Clamp mood to valid values.
    if (!["green", "yellow", "red"].includes(this._config.mood)) {
      this._config.mood = "green";
    }
    this._render();
  }

  getCardSize() {
    return 1;
  }

  _render() {
    const cfg = this._config;
    this._shadow.innerHTML = `
      <style>${Sims2DividerCard._styles(cfg)}</style>
      <div class="sims2-divider" data-mood="${this._escapeAttr(cfg.mood)}">
        <span class="sims2-divider-line-left"></span>
        <div class="sims2-divider-plumbob" data-mood="${this._escapeAttr(cfg.mood)}"></div>
        <span class="sims2-divider-line-right"></span>
      </div>
    `;
  }

  _escapeAttr(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  static _styles(cfg) {
    return `
      :host { display: block; }
      .sims2-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 16px 0;
      }

      /* ---- Gold gradient trim lines ----------------------------------- */
      .sims2-divider-line-left,
      .sims2-divider-line-right {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(224, 182, 107, 0.5) 30%,
          rgba(224, 182, 107, 0.6) 50%,
          rgba(224, 182, 107, 0.5) 70%,
          transparent 100%);
      }

      /* ---- Plumbob diamond -------------------------------------------- */
      .sims2-divider-plumbob {
        width: ${cfg.size}px;
        height: ${cfg.size}px;
        flex-shrink: 0;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        background: linear-gradient(105deg,
          #B7F36B 0%,
          #7BC942 42%,
          #4E9A26 58%,
          #2F6B12 100%);
        filter: drop-shadow(0 0 6px rgba(123, 201, 66, 0.6));
        transition: background 0.5s ease, filter 0.5s ease;
      }

      .sims2-divider-plumbob[data-mood="yellow"] {
        background: linear-gradient(105deg,
          #FFE079 0%,
          #F2C14E 42%,
          #C28A1F 58%,
          #8A5E0E 100%);
        filter: drop-shadow(0 0 6px rgba(242, 193, 78, 0.6));
      }

      .sims2-divider-plumbob[data-mood="red"] {
        background: linear-gradient(105deg,
          #FF9A8A 0%,
          #E55B45 42%,
          #B03320 58%,
          #6E1C10 100%);
        filter: drop-shadow(0 0 6px rgba(229, 91, 69, 0.6));
      }
    `;
  }
}

// Register the element and announce it to the Lovelace card picker.
customElements.define("sims2-divider", Sims2DividerCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims2-divider",
  name: "Sims 2 Divider",
  description:
    "A decorative plumbob-shaped divider with gold gradient trim lines. " +
    "Use between sections in a dashboard.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
