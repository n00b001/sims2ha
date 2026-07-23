/**
 * sims2-loading-card.js
 * ---------------------------------------------------------------------------
 * Custom Lovelace card:  custom:sims2-loading
 *
 * Renders a full-screen "The Sims 2" style loading experience inside a
 * Home Assistant dashboard:
 *   - deep blue Pleasantview sky gradient
 *   - a glowing, faceted plumbob that bobs and shifts mood
 *   - the gold "THE SIMS 2" style wordmark (customisable)
 *   - rotating, ridiculous loading tips ("Reticulating splines", and friends)
 *
 * Drop it in as the only card on a dedicated view to use as a splash screen,
 * or at the top of any dashboard. It auto-dismisses, can be bound to an
 * entity, or can stay up forever as a bit of ambient decor.
 *
 * No build step, no dependencies. Vanilla web component, Shadow DOM.
 *
 * Example configuration:
 *
 *   type: custom:sims2-loading
 *   wordmark: PLEASANTVIEW
 *   duration: 6                 # seconds before auto-dismiss (0 = forever)
 *   fullscreen: true            # overlay the whole viewport
 *   tips:                       # optional: override the built-in tip list
 *     - Reticulating your Zigbee mesh
 *     - Convincing the thermostat it is happy
 *
 * This file is a fan tribute. "The Sims 2" is a trademark of Electronic Arts.
 * ---------------------------------------------------------------------------
 */

const SIMS2_DEFAULT_TIPS = [
  // ---- canonical Maxis / Sims loading-screen lines -------------------------
  "Reticulating splines",
  "Reticulating splines… unreticulating splines",
  "Inserting chaos generator",
  "Herding llamas",
  "Consulting the oracle",
  "Fabricating imaginary infrastructure",
  "Interpreting family values",
  "Recomputing mammal matrix",
  "Engaging the autopet",
  "Simulating the simulation",
  "Polishing the plumbob",
  "Wrangling widgets",
  "Aligning covariance matrices",
  "Asserting that P equals NP",
  "Deciding whether to show this message",
  "Estimating the cosmic constant",
  "Generating witty dialogue",
  "Harvesting simoleons",
  "Juggling torpedoes",
  "Maximising the window",
  "Moulding pixels",
  "Re-evaluating the simulation",
  "Reconsidering the meaning of life",
  "Reconfiguring the office workstation",
  "Reinventing the wheel",
  "Restructuring the economy",
  "Synthesising the molecule",
  "Tying up loose ends",
  "Weaving the fabric of reality",
  "Baking cookies",
  "Calibrating the calibrator",
  "Negotiating with the llama wrangler",
  // ---- Home Assistant flavoured nonsense ----------------------------------
  "Reticulating your Zigbee mesh",
  "Convincing the light bulb it wants to be on",
  "Teaching the thermostat to love",
  "Herding smart plugs",
  "Asking the motion sensor if anyone is really there",
  "Bribing the humidity sensor",
  "Negotiating a treaty between two smart bulbs",
  "Teaching the vacuum to fear stairs",
  "Convincing the door lock it is among friends",
  "Awakening the slumbering Raspberry Pi",
  "Cataloguing every dust particle as a sensor",
  "Pleading with the weather integration to commit",
  "Reconciling two temperature sensors that disagree",
  "Teaching the curtain motor a sense of timing",
  "Reticulating the Wi-Fi into a pretzel",
  "Reminding the energy meter that honesty is a virtue",
  "Apologising to the Bluetooth beacon",
  "Convincing the fan it is, in fact, a fan",
  "Polishing each pixel by hand",
  "Asking the smoke detector to please relax",
  "Resolving a long-standing grudge between two switches",
  "Teaching the robot mop the concept of corners",
];

const SIMS2_HINTS = [
  "Click the plumbob for a fresh task.",
  "Plumbob mood reflects system morale.",
  "Tip: pressing refresh also reticulates splines.",
];

class Sims2LoadingCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this._shadow = shadow;
    this._config = {};
    this._hass = null;
    this._tipIndex = 0;
    this._tipTimer = null;
    this._hideTimer = null;
    this._moodTimer = null;
    this._mood = "green";
    this._attached = false;
  }

  static getStubConfig() {
    return {
      wordmark: "PLEASANTVIEW",
      duration: 6,
      fullscreen: true,
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration for sims2-loading");
    }
    this._config = {
      wordmark: "THE SIMS 2",
      duration: 6,
      fullscreen: true,
      persistent: false,
      plumbob: true,
      tips: SIMS2_DEFAULT_TIPS,
      hint: true,
      dismiss_entity: null,
      dismiss_state: ["loaded", "on", "idle", "home", "ok"],
      ...config,
    };
    if (!Array.isArray(this._config.tips) || this._config.tips.length === 0) {
      this._config.tips = SIMS2_DEFAULT_TIPS;
    }
    this._render();
  }

  // Home Assistant passes the hass object here.
  set hass(value) {
    this._hass = value;
    if (this._config.dismiss_entity && value) {
      const state = value.states[this._config.dismiss_entity];
      if (state && this._config.dismiss_state.includes(state.state)) {
        this._dismiss();
      }
    }
  }

  getCardSize() {
    return this._config && this._config.fullscreen ? 8 : 3;
  }

  connectedCallback() {
    this._attached = true;
    this._startTimers();
  }

  disconnectedCallback() {
    this._attached = false;
    this._clearTimers();
  }

  _clearTimers() {
    if (this._tipTimer) {
      clearInterval(this._tipTimer);
      this._tipTimer = null;
    }
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
    if (this._moodTimer) {
      clearInterval(this._moodTimer);
      this._moodTimer = null;
    }
  }

  _startTimers() {
    this._clearTimers();
    if (!this._attached) return;
    // Rotate the tip text.
    this._tipTimer = setInterval(() => this._rotateTip(), 2800);
    // Cycle the plumbob mood for ambient life.
    this._moodTimer = setInterval(() => this._cycleMood(), 4200);
    // Auto-dismiss unless persistent or duration is zero.
    if (!this._config.persistent && this._config.duration > 0) {
      this._hideTimer = setTimeout(
        () => this._dismiss(),
        this._config.duration * 1000,
      );
    }
  }

  _rotateTip() {
    this._tipIndex = (this._tipIndex + 1) % this._config.tips.length;
    const tipEl = this._shadow.getElementById("sims2-tip");
    if (tipEl) {
      tipEl.classList.remove("sims2-tip-enter");
      // force reflow so the animation can replay
      void tipEl.offsetWidth;
      tipEl.textContent = this._config.tips[this._tipIndex];
      tipEl.classList.add("sims2-tip-enter");
    }
  }

  _cycleMood() {
    const moods = ["green", "yellow", "red"];
    this._mood = moods[(moods.indexOf(this._mood) + 1) % moods.length];
    this._applyMood();
  }

  _applyMood() {
    const plumbob = this._shadow.getElementById("sims2-plumbob");
    if (plumbob) {
      plumbob.setAttribute("data-mood", this._mood);
    }
  }

  _nextTipManual() {
    // Shuffle the order a touch so repeated clicks feel fresh.
    this._tipIndex = Math.floor(Math.random() * this._config.tips.length);
    this._rotateTip();
  }

  _dismiss() {
    const overlay = this._shadow.getElementById("sims2-loading");
    if (!overlay || overlay.dataset.dismissed === "true") return;
    overlay.dataset.dismissed = "true";
    overlay.classList.add("sims2-fading");
    this._clearTimers();
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.style.display = "none";
      }
    }, 700);
  }

  _render() {
    const cfg = this._config;
    const fullscreenClass = cfg.fullscreen ? " sims2-fullscreen" : "";
    const startTip = cfg.tips[0] || "Reticulating splines";
    const hint = cfg.hint ? SIMS2_HINTS[0] : "";

    this._shadow.innerHTML = `
      <style>${Sims2LoadingCard._styles()}</style>
      <div id="sims2-loading" class="sims2-loading${fullscreenClass}" data-mood="green">
        <div class="sims2-stars" aria-hidden="true"></div>
        <div class="sims2-content">
          ${
            cfg.plumbob
              ? `
            <div id="sims2-plumbob" class="sims2-plumbob" data-mood="green" title="Click for a fresh task"></div>`
              : ""
          }
          <div class="sims2-wordmark">${this._escapeHtml(cfg.wordmark)}</div>
          <div class="sims2-tip-row">
            <span class="sims2-dot"></span>
            <span id="sims2-tip" class="sims2-tip sims2-tip-enter">${this._escapeHtml(startTip)}</span>
          </div>
          ${hint ? `<div class="sims2-hint">${this._escapeHtml(hint)}</div>` : ""}
        </div>
      </div>
    `;

    const plumbob = this._shadow.getElementById("sims2-plumbob");
    if (plumbob) {
      plumbob.addEventListener("click", () => this._nextTipManual());
    }
    this._applyMood();
    if (this._attached) {
      this._startTimers();
    }
  }

  _escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  static _styles() {
    return `
      :host { display: block; }
      .sims2-loading {
        position: relative;
        overflow: hidden;
        border-radius: 14px;
        min-height: 360px;
        background:
          radial-gradient(120% 90% at 50% 0%, var(--sims2-sky-top, #2E76AE) 0%, var(--sims2-sky-mid, #1E5C92) 45%, var(--sims2-sky-bottom, #0E2C4D) 100%);
        font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif);
        color: #FFF6E0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.7s ease, transform 0.7s ease;
        box-shadow: inset 0 0 0 2px rgba(224, 182, 107, 0.35), 0 6px 20px rgba(0,0,0,0.35);
      }
      .sims2-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 99999;
        border-radius: 0;
        min-height: 100vh;
      }
      .sims2-fading { opacity: 0; transform: scale(1.02); }

      .sims2-stars {
        position: absolute; inset: 0; pointer-events: none;
        background-image:
          radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.7), transparent),
          radial-gradient(1.5px 1.5px at 78% 14%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1.5px 1.5px at 38% 70%, rgba(255,255,255,0.5), transparent),
          radial-gradient(2px 2px at 88% 64%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 58% 40%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.45), transparent);
        opacity: 0.8;
      }

      .sims2-content { position: relative; text-align: center; padding: 24px; z-index: 1; }

      /* ---- The plumbob -------------------------------------------------- */
      .sims2-plumbob {
        width: 86px; height: 110px;
        margin: 0 auto 18px;
        cursor: pointer;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        background: linear-gradient(105deg,
          #B7F36B 0%, #7BC942 42%, #4E9A26 58%, #2F6B12 100%);
        animation: sims2-float 3.2s ease-in-out infinite;
        filter: drop-shadow(0 0 14px rgba(123, 201, 66, 0.85));
        transition: filter 0.6s ease, background 0.6s ease;
      }
      .sims2-plumbob[data-mood="yellow"] {
        background: linear-gradient(105deg, #FFE079 0%, #F2C14E 42%, #C28A1F 58%, #8A5E0E 100%);
        filter: drop-shadow(0 0 14px rgba(242, 193, 78, 0.85));
      }
      .sims2-plumbob[data-mood="red"] {
        background: linear-gradient(105deg, #FF9A8A 0%, #E55B45 42%, #B03320 58%, #6E1C10 100%);
        filter: drop-shadow(0 0 14px rgba(229, 91, 69, 0.85));
      }
      .sims2-plumbob::after {
        /* centre ridge / facet highlight */
        content: ""; display: block;
        width: 2px; height: 100%; margin: 0 auto;
        background: linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0) 50%, rgba(0,0,0,0.25));
      }
      @keyframes sims2-float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50%      { transform: translateY(-12px) rotate(0deg); }
      }

      .sims2-wordmark {
        font-size: clamp(26px, 6vw, 54px);
        font-weight: 600;
        letter-spacing: 0.14em;
        color: #F4D886;
        text-shadow:
          0 2px 0 #8A5E0E,
          0 3px 6px rgba(0,0,0,0.45),
          0 0 22px rgba(244, 216, 134, 0.25);
        margin-bottom: 22px;
      }

      .sims2-tip-row {
        display: inline-flex; align-items: center; gap: 10px;
        font-size: clamp(14px, 2.4vw, 19px);
        color: #EAF4FF;
        background: rgba(8, 28, 50, 0.45);
        border: 1px solid rgba(224, 182, 107, 0.35);
        border-radius: 999px;
        padding: 8px 18px;
        max-width: 90%;
      }
      .sims2-dot {
        width: 9px; height: 9px; border-radius: 50%;
        background: #7BC942;
        box-shadow: 0 0 8px #7BC942;
        animation: sims2-blink 1.2s ease-in-out infinite;
      }
      @keyframes sims2-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

      .sims2-tip { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sims2-tip-enter { animation: sims2-tip-in 0.45s ease; }
      @keyframes sims2-tip-in {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .sims2-hint {
        margin-top: 18px; font-size: 12px; letter-spacing: 0.05em;
        color: rgba(234, 244, 255, 0.55);
      }

      @media (max-width: 480px) {
        .sims2-tip { white-space: normal; }
        .sims2-tip-row { border-radius: 14px; }
      }
    `;
  }
}

// Register the element and announce it to the Lovelace card picker.
customElements.define("sims2-loading", Sims2LoadingCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sims2-loading",
  name: "Sims 2 Loading Screen",
  description:
    "A full-screen The Sims 2 style loading screen with a floating plumbob " +
    "and rotating 'Reticulating splines' style tips.",
  preview: false,
  documentationURL: "https://github.com/n00b001/sims2ha",
});
