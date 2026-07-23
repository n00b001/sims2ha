// Sims 2 Header Enhancement - Custom styling for the app header/toolbar to match Sims 2 main menu
(function () {
  const style = document.createElement("style");
  style.id = "sims2-header-enhancement";
  style.textContent = `
    /* Sims 2 Header Customization */
    app-header,
    ha-app-toolbar,
    .mdc-top-app-bar {
      background: linear-gradient(180deg, #2F6B9A 0%, #235E8C 50%, #1A4A70 100%) !important;
      border-bottom: 3px solid var(--sims2-gold-trim, #D8C39A) !important;
      color: var(--sims2-cream-text, #FFF6E0) !important;
      box-shadow: 0 2px 8px rgba(26, 26, 62, 0.2) !important;
      height: 64px !important;
    }

    app-header .title,
    .mdc-top-app-bar__title {
      color: var(--sims2-cream-text, #FFF6E0) !important;
      font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
      font-weight: 700 !important;
    }

    app-header .menu-button,
    .header-menu-btn {
      border-radius: 50% !important;
      width: 48px !important;
      height: 48px !important;
      background: rgba(232, 180, 77, 0.15) !important;
      border: 2px solid var(--sims2-gold-trim, #D8C39A) !important;
    }

    app-header .menu-button:hover,
    .header-menu-btn:hover {
      background: rgba(232, 180, 77, 0.25) !important;
    }

    app-header .search-input,
    .header-search {
      border-radius: 12px !important;
      background: linear-gradient(180deg, rgba(126, 200, 230, 0.35) 0%, rgba(47, 134, 197, 0.30) 100%) !important;
      border: 2px solid var(--sims2-gold-trim, #D8C39A) !important;
      color: var(--sims2-cream-text, #FFF6E0) !important;
    }

    @keyframes sims2-header-shimmer {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.85; text-shadow: 0 0 8px rgba(255, 215, 0, 0.2); }
    }

    app-header .title,
    .header-toolbar .title,
    [part="title"],
    ha-menu-button {
      animation: sims2-header-shimmer 4s ease-in-out infinite;
    }
  `;

  // Wait for the document to be ready before appending
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document.head.appendChild(style);
    });
  } else {
    document.head.appendChild(style);
  }
})();
