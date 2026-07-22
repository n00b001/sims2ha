// Sims 2 Sidebar Customization
// Transforms the sidebar to resemble the Sims 2 Buy/Build mode category navigator

customElements.whenDefined("ha-sidebar").then(() => {
  const original = HTMLElement.prototype.attachShadow;
  HTMLElement.prototype.attachShadow = function (options) {
    const shadow = original.call(this, options);
    if (this.tagName === "HA-SIDEBAR") {
      const style = document.createElement("style");
      style.textContent = `
        /* Sims 2 Sidebar Customization */
        app-drawer,
        ha-sidebar {
          background: linear-gradient(180deg, #1E3D5A 0%, #1A3350 50%, #0E2240 100%) !important;
          border-right: 3px solid var(--sims2-panel-blue-deep, #173A52) !important;
          width: 280px !important;
        }

        ha-sidebar .link,
        ha-sidebar .title a {
          color: var(--sims2-cream-text, #FFF6E0) !important;
          font-family: var(--sims2-font-display, "Benguiat Gothic", system-ui, sans-serif) !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
        }

        ha-sidebar .link:hover {
          background: rgba(232, 180, 77, 0.15) !important;
        }

        ha-sidebar .link.active {
          color: var(--sims2-panel-blue-deep, #173A52) !important;
          background: linear-gradient(180deg, rgba(232, 180, 77, 0.3), rgba(232, 180, 77, 0.15)) !important;
          border-left: 3px solid #E8B44D !important;
          font-weight: 700 !important;
        }

        ha-sidebar .nav-section-entities,
        [section="navigation"] {
          color: var(--sims2-gold, #FFD700) !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          text-transform: uppercase !important;
          padding: 8px 16px 4px !important;
        }

        ha-sidebar .entity-count,
        .sidebar-badge {
          background: var(--sims2-plumbob-green, #7BC942) !important;
          color: #0E1628 !important;
          border-radius: 999px !important;
          font-size: 10px !important;
          padding: 1px 6px !important;
          font-weight: 600 !important;
        }

        ha-sidebar .icon,
        .sidebar-item .icon {
          color: var(--sims2-icon-color, #9CCBE6) !important;
        }

        ha-sidebar [selected] .icon,
        .sidebar-item[active] .icon {
          color: var(--sims2-icon-active-color, #7BC942) !important;
        }
      `;
      shadow.prepend(style);
    }
    return shadow;
  };
});
