/**
 * sims2-icons.js
 * ---------------------------------------------------------------------------
 * Custom Home Assistant icon set:  sims2:<name>
 *
 * Use anywhere you would use an mdi: icon, for example:
 *   icon: sims2:plumbob
 *   entity: light.living_room (with icon: sims2:room-living)
 *
 * Register this file as a "JavaScript module" Lovelace resource:
 *   /local/community/sims2ha/sims2-icons.js
 *
 * All artwork here is ORIGINAL vector art drawn in the spirit of The Sims 2
 * (diamonds, simoleon coins, need meters, buy/build-mode furniture glyphs).
 * No Electronic Arts assets are used. "The Sims 2" is a trademark of EA; this
 * is an unaffiliated fan tribute.
 *
 * Icon geometry lives on a 24x24 viewBox so it scales next to mdi: icons.
 * ---------------------------------------------------------------------------
 */

const SIMS2_VIEWBOX = "0 0 24 24";

// Shared SVG gradient definitions injected as a <defs> wrapper before every
// icon so each one renders with faceted depth.  Each gradient uses the CSS
// custom property system so icons auto-recolour when the theme changes.
const GRADIENT_DEFS = `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <defs>
    <linearGradient id="s2g-plum-g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B7F36B"/><stop offset="45%" stop-color="#7BC942"/><stop offset="100%" stop-color="#2F6B12"/>
    </linearGradient>
    <linearGradient id="s2g-plum-y" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE079"/><stop offset="45%" stop-color="#F2C14E"/><stop offset="100%" stop-color="#8A5E0E"/>
    </linearGradient>
    <linearGradient id="s2g-plum-r" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9A8A"/><stop offset="45%" stop-color="#E55B45"/><stop offset="100%" stop-color="#6E1C10"/>
    </linearGradient>
    <linearGradient id="s2g-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0D898"/><stop offset="45%" stop-color="#E0B66B"/><stop offset="100%" stop-color="#A07830"/>
    </linearGradient>
    <linearGradient id="s2g-gold-light" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8EAC0"/><stop offset="100%" stop-color="#D4B878"/>
    </linearGradient>
    <linearGradient id="s2g-panel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2F86C5"/><stop offset="100%" stop-color="#1A5A8A"/>
    </linearGradient>
    <linearGradient id="s2g-panel-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E5078"/><stop offset="100%" stop-color="#0E2A44"/>
    </linearGradient>
    <linearGradient id="s2g-coin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8E8A0"/><stop offset="50%" stop-color="#E0B66B"/><stop offset="100%" stop-color="#A07830"/>
    </linearGradient>
    <linearGradient id="s2g-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8E8A0"/><stop offset="50%" stop-color="#E0B66B"/><stop offset="100%" stop-color="#C49A3C"/>
    </linearGradient>
    <linearGradient id="s2g-sim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5C8A0"/><stop offset="100%" stop-color="#D4986A"/>
    </linearGradient>
    <linearGradient id="s2g-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4AA0D8"/><stop offset="100%" stop-color="#1E5078"/>
    </linearGradient>
    <linearGradient id="s2g-surface" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F5EBD8"/><stop offset="100%" stop-color="#EDE0C8"/>
    </linearGradient>
    <linearGradient id="s2g-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2A3A50"/><stop offset="100%" stop-color="#162236"/>
    </linearGradient>
    <linearGradient id="s2g-lock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0B66B"/><stop offset="100%" stop-color="#A07830"/>
    </linearGradient>
  </defs>
</svg>`;

const SIMS2_ICONS = {
  // =========================================================================
  // CORE / MASCOT
  // =========================================================================

  // Plumbob — faceted diamond with centre ridge highlight
  plumbob: `<g fill="url(#s2g-plum-g)"><path d="M12 2 L22 12 L12 22 L2 12 Z"/></g>` +
    `<path d="M12 2 L12 22" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8"/>` +
    `<path d="M7 7 L12 12 L17 7" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.6"/>`,

  // Faceted mood plumbobs with gradient fills and inner highlights
  "plumbob-mood-green": `<g fill="url(#s2g-plum-g)"><path d="M12 2 L22 12 L12 22 L2 12 Z"/></g>` +
    `<path d="M12 2 L12 22" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8"/>` +
    `<path d="M7 7 L12 12 L17 7" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.6"/>`,
  "plumbob-mood-yellow": `<g fill="url(#s2g-plum-y)"><path d="M12 2 L22 12 L12 22 L2 12 Z"/></g>` +
    `<path d="M12 2 L12 22" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8"/>` +
    `<path d="M7 7 L12 12 L17 7" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.6"/>`,
  "plumbob-mood-red": `<g fill="url(#s2g-plum-r)"><path d="M12 2 L22 12 L12 22 L2 12 Z"/></g>` +
    `<path d="M12 2 L12 22" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8"/>` +
    `<path d="M7 7 L12 12 L17 7" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.6"/>`,

  // Simoleon coin — gold coin with faceted diamond inset
  simoleon: `<circle cx="12" cy="12" r="9" fill="url(#s2g-coin)"/>` +
    `<circle cx="12" cy="12" r="7.5" fill="none" stroke="#A07830" stroke-width="0.6"/>` +
    `<path d="M12 7 L16 12 L12 17 L8 12 Z" fill="#F8E8A0" opacity="0.7"/>` +
    `<path d="M12 7 L12 17" fill="none" stroke="#A07830" stroke-width="0.5"/>`,

  // Stacked simoleon coins
  "simoleon-stack": `<rect x="3" y="13" width="18" height="5" rx="2.5" fill="url(#s2g-coin)"/>` +
    `<rect x="4" y="9" width="16" height="5" rx="2.5" fill="url(#s2g-coin)"/>` +
    `<rect x="6" y="5" width="12" height="5" rx="2.5" fill="url(#s2g-coin)"/>` +
    `<rect x="3" y="13" width="18" height="5" rx="2.5" fill="none" stroke="#A07830" stroke-width="0.5"/>` +
    `<rect x="4" y="9" width="16" height="5" rx="2.5" fill="none" stroke="#A07830" stroke-width="0.5"/>` +
    `<rect x="6" y="5" width="12" height="5" rx="2.5" fill="none" stroke="#A07830" stroke-width="0.5"/>`,

  // Sim — head with floating faceted plumbob
  sim: `<circle cx="12" cy="16" r="5.5" fill="url(#s2g-sim)"/>` +
    `<path d="M12 1 L22 12 L12 22 L2 12 Z" fill="url(#s2g-plum-g)" opacity="0.9"/>` +
    `<path d="M12 1 L12 22" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"/>`,

  "sim-head": `<circle cx="12" cy="14" r="6" fill="url(#s2g-sim)"/>` +
    `<path d="M12 1 L22 12 L12 23 L2 12 Z" fill="url(#s2g-plum-g)" opacity="0.9"/>` +
    `<path d="M12 1 L12 23" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"/>`,

  // Aspiration star — faceted gold star
  "aspiration-star": `<path d="M12 2 L14.2 9 L21.5 9 L15.6 13.3 L17.9 20.2 L12 15.9 L6.1 20.2 L8.4 13.3 L2.5 9 L9.8 9 Z" fill="url(#s2g-star)"/>` +
    `<path d="M12 2 L12 15.9" fill="none" stroke="#F8E8A0" stroke-opacity="0.4" stroke-width="0.5"/>`,

  // Want thought bubble — Sims 2 dream bubble with diamond dots
  "want-bubble": `<path d="M3 4 H21 a2 2 0 0 1 2 2 V15 a2 2 0 0 1 -2 2 H10 L5 21 V17 H3 a2 2 0 0 1 -2 -2 V6 a2 2 0 0 1 2 -2 Z" fill="url(#s2g-surface)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<circle cx="8" cy="11" r="2" fill="url(#s2g-plum-g)" opacity="0.6"/>` +
    `<circle cx="13" cy="11" r="2" fill="url(#s2g-plum-y)" opacity="0.6"/>` +
    `<circle cx="17" cy="11" r="1.4" fill="url(#s2g-plum-r)" opacity="0.6"/>`,

  // =========================================================================
  // GAME MODE MARKS (live / buy / build / cas / story)
  // =========================================================================

  "live-mode": `<path d="M12 21 C7 16 3 12.5 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 12.5 17 16 12 21 Z" fill="url(#s2g-plum-g)"/>` +
    `<path d="M12 21 C8 17 4.5 13 4.5 9 A3.5 3.5 0 0 1 12 7 A3.5 3.5 0 0 1 19.5 9 C19.5 13 16 17 12 21 Z" fill="#ffffff" opacity="0.12"/>`,

  "buy-mode": `<path d="M6 7 H20 a1 1 0 0 1 1 1 L19 20 a2 2 0 0 1 -2 2 H9 a2 2 0 0 1 -2 -2 L5 9 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M9 7 a3 3 0 0 1 6 0" fill="none" stroke="#ffffff" stroke-width="1.4"/>` +
    `<path d="M6 7 L20 8 L19 20 H7 Z" fill="#ffffff" opacity="0.08"/>`,

  "build-mode": `<path d="M3 20 H21 V22 H3 Z" fill="url(#s2g-gold)"/>` +
    `<path d="M5 20 V11 L12 5 L19 11 V20 H14 V14 H10 V20 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M5 11 L12 5 L19 11 V20 H14 V14 H10 V20 Z" fill="#ffffff" opacity="0.1"/>`,

  "cas-mode": `<path d="M4 8 L12 4 L20 8 L12 12 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M3 8.5 L12 12.6 L21 8.5" fill="none" stroke-width="1.4" stroke="#ffffff"/>` +
    `<path d="M4 8 L12 4 L20 8 Z" fill="#ffffff" opacity="0.15"/>`,

  "story-mode": `<rect x="3" y="5" width="18" height="14" rx="1.5" fill="url(#s2g-surface)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M3 9 H21" stroke="url(#s2g-gold)" stroke-width="1.2"/>` +
    `<rect x="5" y="6" width="1.4" height="2" fill="url(#s2g-gold)"/>` +
    `<rect x="8" y="6" width="1.4" height="2" fill="url(#s2g-gold)"/>` +
    `<rect x="14.6" y="6" width="1.4" height="2" fill="url(#s2g-gold)"/>` +
    `<rect x="17.6" y="6" width="1.4" height="2" fill="url(#s2g-gold)"/>`,

  // =========================================================================
  // THE EIGHT SIM NEEDS — faceted diamond meters
  // =========================================================================

  "need-hunger": `<path d="M4 11 a8 8 0 0 1 16 0 Z" fill="url(#s2g-plum-g)"/>` +
    `<rect x="4" y="11" width="16" height="2" fill="#ffffff" opacity="0.3"/>` +
    `<path d="M5 13 a7 6 0 0 0 14 0 Z" fill="#ffffff" opacity="0.15"/>` +
    `<circle cx="9" cy="9" r="0.9" fill="#F8E8A0"/>` +
    `<circle cx="13" cy="8.4" r="0.9" fill="#F8E8A0"/>`,

  "need-energy": `<rect x="3" y="8" width="16" height="9" rx="2" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<rect x="19.5" y="10.5" width="2.5" height="4" rx="1" fill="url(#s2g-gold)"/>` +
    `<path d="M11 9 L8 13.2 H10.6 L9.6 17 L13.4 12 H10.8 Z" fill="#F8E8A0"/>` +
    `<rect x="3" y="8" width="16" height="4.5" rx="2" fill="#ffffff" opacity="0.1"/>`,

  "need-social": `<circle cx="8" cy="9" r="3.2" fill="url(#s2g-sim)"/>` +
    `<circle cx="16" cy="9" r="3.2" fill="url(#s2g-sim)"/>` +
    `<path d="M2.5 20 a5.5 5 0 0 1 11 0 Z" fill="url(#s2g-panel)"/>` +
    `<path d="M10.5 20 a5.5 5 0 0 1 11 0 Z" fill="url(#s2g-panel)" opacity="0.7"/>` +
    `<circle cx="8" cy="9" r="3.2" fill="#ffffff" opacity="0.1"/>`,

  "need-hygiene": `<path d="M4 6 V8 H20 V6 Z" fill="url(#s2g-gold)"/>` +
    `<path d="M5 8 V16 a3 3 0 0 0 3 3 H16 a3 3 0 0 0 3 -3 V8 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M10 21 V23 H14 V21" fill="none" stroke-width="1.4" stroke="#F8E8A0"/>` +
    `<path d="M5 8 V15 a2 2 0 0 0 2 2 H8 Z" fill="#ffffff" opacity="0.1"/>`,

  "need-fun": `<rect x="3" y="6" width="18" height="13" rx="2" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M9 4 L7 6 M15 4 L17 6" fill="none" stroke-width="1.4" stroke="url(#s2g-gold)"/>` +
    `<path d="M9 10 L16 12.5 L9 15 Z" fill="#F8E8A0"/>` +
    `<rect x="3" y="6" width="18" height="6.5" rx="2" fill="#ffffff" opacity="0.1"/>`,

  "need-comfort": `<path d="M4 12 a3 3 0 0 1 3 -3 H17 a3 3 0 0 1 3 3 V16 H4 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M4 16 V19 M20 16 V19" stroke-width="1.5" stroke="url(#s2g-gold)"/>` +
    `<rect x="4" y="12" width="6" height="4" rx="1" fill="#F8E8A0"/>` +
    `<path d="M4 12 L7 9 H17 L20 12" fill="#ffffff" opacity="0.1"/>`,

  "need-bladder": `<path d="M7 3 H17 V8 L15 9 V13 a4 4 0 0 1 -8 0 V9 L7 8 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M9 17 a3 2.6 0 0 0 6 0 V20 a3 2.6 0 0 1 -6 0 Z" fill="url(#s2g-gold)"/>` +
    `<path d="M7 3 H17 V8 L15 9 V13 a4 4 0 0 1 -8 0 V9 Z" fill="#ffffff" opacity="0.1"/>`,

  "need-room": `<path d="M3 12 L12 3 L21 12 V20 H15 V14 H9 V20 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M3 12 L12 3 L21 12 V20 H15 V14 H9 V20 H3 Z" fill="#ffffff" opacity="0.08"/>`,

  // =========================================================================
  // SHOPPING — ROOMS (buy mode, sort by room)
  // =========================================================================

  "room-kitchen": `<path d="M4 6 a2 2 0 0 1 2 -2 H18 a2 2 0 0 1 2 2 V18 H4 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<rect x="6" y="7" width="4" height="3" fill="#F8E8A0"/>` +
    `<path d="M4 18 H20 a0 0 0 0 1 0 0 V20 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 Z" fill="url(#s2g-gold)"/>` +
    `<path d="M4 6 H20 V18 H4 Z" fill="#ffffff" opacity="0.08"/>`,

  "room-bathroom": `<path d="M5 9 H10 V20 H6 a1 1 0 0 1 -1 -1 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<path d="M12 4 H17 V20 H12 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<path d="M5 9 H10" stroke="#F8E8A0" stroke-width="1.3"/>` +
    `<circle cx="15" cy="7" r="1" fill="#F8E8A0"/>`,

  "room-bedroom": `<path d="M3 11 H21 V16 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M3 16 V20 M21 16 V20" stroke-width="1.5" stroke="url(#s2g-gold)"/>` +
    `<rect x="5" y="12" width="5" height="3" rx="1" fill="#F8E8A0"/>` +
    `<path d="M3 11 H21 V16 Z" fill="#ffffff" opacity="0.1"/>`,

  "room-living": `<path d="M3 12 a2 2 0 0 1 2 -2 H9 a2 2 0 0 1 2 2 V17 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<path d="M13 10 H19 a2 2 0 0 1 2 2 V17 H13 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<path d="M3 17 V20 M21 17 V20" stroke-width="1.5" stroke="url(#s2g-gold)"/>` +
    `<path d="M3 12 H9 V17 Z" fill="#ffffff" opacity="0.08"/>`,

  "room-dining": `<circle cx="12" cy="11" r="6" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<rect x="5.5" y="18" width="13" height="2.5" rx="1" fill="url(#s2g-gold)"/>` +
    `<path d="M9 9 V13 M15 9 V13" stroke="#F8E8A0" stroke-width="1.2"/>` +
    `<circle cx="12" cy="11" r="6" fill="#ffffff" opacity="0.06"/>`,

  "room-outside": `<path d="M12 3 L7 11 H10 V20 H14 V11 H17 Z" fill="url(#s2g-plum-g)" opacity="0.9"/>` +
    `<circle cx="17" cy="6" r="2" fill="url(#s2g-gold)" opacity="0.8"/>` +
    `<path d="M12 3 L7 11 H10 V20 H14 V11 H17 Z" fill="#ffffff" opacity="0.1"/>`,

  "room-study": `<path d="M4 5 H13 V19 H4 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M13 5 L20 8 V19 L13 19 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<path d="M6 8 H11 M6 11 H11" stroke="#F8E8A0" stroke-width="1"/>` +
    `<path d="M4 5 H13 V19 Z" fill="#ffffff" opacity="0.08"/>`,

  "room-kids": `<circle cx="9" cy="8" r="3" fill="url(#s2g-plum-g)" opacity="0.9"/>` +
    `<circle cx="9" cy="14" r="2.2" fill="url(#s2g-plum-y)" opacity="0.9"/>` +
    `<path d="M16 7 a3 3 0 1 0 0 6 a3 3 0 0 0 0 -6 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<circle cx="9" cy="8" r="3" fill="#ffffff" opacity="0.1"/>`,

  "room-garage": `<path d="M3 11 H4 V8 H20 V11 H21 V20 H18 V17 H6 V20 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M7 11 H17 a2 2 0 0 1 2 2 V14 H5 V13 a2 2 0 0 1 2 -2 Z" fill="#F8E8A0"/>` +
    `<path d="M3 11 H21 V20 H3 Z" fill="#ffffff" opacity="0.06"/>`,

  "room-hallway": `<rect x="3" y="4" width="18" height="16" rx="1" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M12 4 V20" stroke="#F8E8A0" stroke-width="1.3"/>` +
    `<path d="M6 8 H9 M6 12 H9 M15 8 H18 M15 12 H18" stroke="#F8E8A0" stroke-width="1"/>` +
    `<rect x="3" y="4" width="18" height="8" rx="1" fill="#ffffff" opacity="0.06"/>`,

  // =========================================================================
  // SHOPPING — TYPE / FUNCTION
  // =========================================================================

  "type-comfort": `<path d="M3 12 a2.5 2.5 0 0 1 2.5 -2.5 H8 a2.5 2.5 0 0 1 2.5 2.5 V17 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<path d="M13.5 12 a2.5 2.5 0 0 1 2.5 -2.5 H18.5 A2.5 2.5 0 0 1 21 12 V17 H13.5 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<path d="M3 17 V20 M21 17 V20" stroke-width="1.6" stroke="url(#s2g-gold)"/>` +
    `<path d="M3 12 a2.5 2.5 0 0 1 2.5 -2.5 H8 Z" fill="#ffffff" opacity="0.1"/>`,

  "type-surfaces": `<rect x="3" y="9" width="18" height="3" rx="1" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<path d="M5 12 V20 M19 12 V20" stroke-width="1.6" stroke="url(#s2g-gold)"/>` +
    `<rect x="3" y="9" width="18" height="1.5" rx="1" fill="#ffffff" opacity="0.1"/>`,

  "type-storage": `<rect x="4" y="4" width="16" height="16" rx="1" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M4 12 H20 M12 4 V20" stroke="#F8E8A0" stroke-width="1.3"/>` +
    `<circle cx="9.5" cy="10.5" r="0.9" fill="#F8E8A0"/>` +
    `<circle cx="14.5" cy="10.5" r="0.9" fill="#F8E8A0"/>` +
    `<circle cx="9.5" cy="17.5" r="0.9" fill="#F8E8A0"/>` +
    `<circle cx="14.5" cy="17.5" r="0.9" fill="#F8E8A0"/>` +
    `<rect x="4" y="4" width="16" height="8" rx="1" fill="#ffffff" opacity="0.08"/>`,

  "type-beds": `<path d="M3 13 H21 V17 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M3 17 V20 M21 17 V20" stroke-width="1.6" stroke="url(#s2g-gold)"/>` +
    `<rect x="5" y="11" width="6" height="3" rx="1.4" fill="#F8E8A0"/>` +
    `<path d="M3 13 H21 V17 Z" fill="#ffffff" opacity="0.1"/>`,

  "type-electronics": `<rect x="3" y="5" width="18" height="12" rx="1.5" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M9 20 H15 M12 17 V20" stroke-width="1.4" stroke="url(#s2g-gold)"/>` +
    `<path d="M8 8 L16 11 L8 14 Z" fill="#F8E8A0" opacity="0.25"/>` +
    `<rect x="3" y="5" width="18" height="6" rx="1.5" fill="#ffffff" opacity="0.08"/>`,

  "type-appliances": `<rect x="5" y="3" width="14" height="18" rx="1.5" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M5 10 H19" stroke="#F8E8A0" stroke-width="1.3"/>` +
    `<rect x="8" y="5" width="8" height="3" rx="0.6" fill="#F8E8A0"/>` +
    `<circle cx="12" cy="15" r="2.4" fill="url(#s2g-gold)"/>` +
    `<rect x="5" y="3" width="14" height="9" rx="1.5" fill="#ffffff" opacity="0.08"/>`,

  "type-plumbing": `<path d="M4 6 H12 V10 H8 V20 H6 V10 H4 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<path d="M14 7 a3 3 0 0 1 6 0 V9 H18 V7 a1 1 0 0 0 -2 0 V13 H21 V15 H14 V7 Z" fill="url(#s2g-panel)" opacity="0.85"/>` +
    `<path d="M4 6 H12 V10 Z" fill="#ffffff" opacity="0.1"/>`,

  "type-decorative": `<path d="M12 3 C8 7 6 10 6 13 a6 6 0 0 0 12 0 C18 10 16 7 12 3 Z" fill="url(#s2g-plum-g)" opacity="0.9"/>` +
    `<path d="M12 3 C9 7 7 10 7 13 a5 5 0 0 0 10 0 C17 10 15 7 12 3 Z" fill="#ffffff" opacity="0.12"/>` +
    `<path d="M12 19 V22" stroke-width="1.4" stroke="url(#s2g-gold)"/>` +
    `<path d="M12 3 C9 7 7 10 7 13 a6 6 0 0 1 12 0 C19 10 15 7 12 3 Z" fill="#ffffff" opacity="0.1"/>`,

  "type-lighting": `<path d="M9 3 H15 V10 L17 13 V14 H7 V13 L9 10 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M10 17 H14 M11 20 H13" stroke-width="1.4" stroke="url(#s2g-gold)"/>` +
    `<path d="M9 3 H15 V10 L17 13 Z" fill="#ffffff" opacity="0.1"/>`,

  "type-skills": `<path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.2 21 L12 16.5 L5.8 21 L8 13.5 L2 9 L9.5 9 Z" fill="url(#s2g-star)"/>` +
    `<path d="M12 2 L12 16.5" fill="none" stroke="#F8E8A0" stroke-opacity="0.35" stroke-width="0.5"/>`,

  "type-toys": `<path d="M12 4 L20 18 H4 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<circle cx="9.5" cy="13" r="1.1" fill="#F8E8A0"/>` +
    `<circle cx="14.5" cy="13" r="1.1" fill="#F8E8A0"/>` +
    `<path d="M12 4 L20 18 H12 Z" fill="#ffffff" opacity="0.1"/>`,

  // =========================================================================
  // SHOPPING — CATEGORY & SORT CONTROLS
  // =========================================================================

  "shop-tag": `<path d="M3 3 H11 L21 13 L13 21 L3 11 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<circle cx="7" cy="7" r="1.6" fill="#F8E8A0"/>` +
    `<path d="M3 3 H11 L21 13 Z" fill="#ffffff" opacity="0.1"/>`,

  "shop-cart": `<path d="M2 3 H5 L7 16 H19 L21 7 H7" fill="none" stroke-width="1.8" stroke="url(#s2g-gold)"/>` +
    `<circle cx="9" cy="20" r="1.6" fill="url(#s2g-gold)"/>` +
    `<circle cx="17" cy="20" r="1.6" fill="url(#s2g-gold)"/>`,

  "shop-window": `<rect x="3" y="4" width="18" height="14" rx="1" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<path d="M3 9 H21" stroke="#F8E8A0" stroke-width="1.3"/>` +
    `<path d="M10 4 V9 M14 4 V9" stroke="#F8E8A0" stroke-width="1"/>` +
    `<rect x="3" y="4" width="18" height="7" rx="1" fill="#ffffff" opacity="0.08"/>`,

  "sort-rooms": `<path d="M3 11 L12 3 L21 11 V20 H3 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.6"/>` +
    `<rect x="10" y="14" width="4" height="6" fill="#F8E8A0"/>` +
    `<path d="M3 11 L12 3 L21 11 V20 Z" fill="#ffffff" opacity="0.08"/>`,

  "sort-type": `<rect x="3" y="3" width="8" height="8" rx="1" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<rect x="13" y="3" width="8" height="8" rx="1" fill="url(#s2g-panel)" opacity="0.85" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<rect x="3" y="13" width="8" height="8" rx="1" fill="url(#s2g-panel)" opacity="0.85" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<rect x="13" y="13" width="8" height="8" rx="1" fill="url(#s2g-panel)" opacity="0.7" stroke="url(#s2g-gold)" stroke-width="0.5"/>` +
    `<rect x="3" y="3" width="8" height="4" rx="1" fill="#ffffff" opacity="0.1"/>` +
    `<rect x="13" y="3" width="8" height="4" rx="1" fill="#ffffff" opacity="0.08"/>`,

  "sort-function": `<circle cx="12" cy="12" r="3" fill="url(#s2g-gold)"/>` +
    `<path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M5 5 L7 7 M17 17 L19 19 M19 5 L17 7 L7 17 L5 19" stroke-width="1.6" stroke="url(#s2g-gold)"/>` +
    `<circle cx="12" cy="12" r="1.5" fill="#F8E8A0"/>`,

  "sort-name": `<path d="M3 18 L6 6 L9 18 M4 14 H8" fill="none" stroke-width="1.6" stroke="url(#s2g-gold)"/>` +
    `<path d="M13 18 V6 H16 a3 3 0 0 1 0 6 H13" fill="none" stroke-width="1.6" stroke="url(#s2g-gold)"/>`,

  "sort-price": `<path d="M12 2 L16 7 L13.4 7 L13.4 15 H16 L12 20 L8 15 H10.6 L10.6 7 L8 7 Z" fill="url(#s2g-coin)" stroke="#A07830" stroke-width="0.5"/>` +
    `<path d="M12 2 L13.4 7 L13.4 15 L12 20 L10.6 15 L10.6 7 Z" fill="#ffffff" opacity="0.15"/>`,

  // =========================================================================
  // SECURITY & AUTOMATION
  // =========================================================================

  lock: `<path d="M7 11 V7 a5 5 0 0 1 10 0 V11" fill="none" stroke-width="1.8" stroke="url(#s2g-lock)"/>` +
    `<rect x="4" y="11" width="16" height="10" rx="2" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<rect x="4" y="11" width="16" height="5" rx="2" fill="#ffffff" opacity="0.08"/>`,

  script: `<path d="M6 3 H14 L18 7 V17 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 Z" fill="url(#s2g-panel)" stroke="url(#s2g-gold)" stroke-width="0.8"/>` +
    `<path d="M14 3 V7 H18" fill="url(#s2g-gold)"/>` +
    `<path d="M8 11 H16 M8 14 H16 M8 17 H13" stroke="#F8E8A0" stroke-width="1.2"/>` +
    `<path d="M6 3 H14 L18 7 V17 Z" fill="#ffffff" opacity="0.08"/>`,
};

window.customIcons = window.customIcons || {};
window.customIcons["sims2"] = {
  // HA calls getIcon(name) and expects { path, viewBox } where path is the
  // inner SVG markup to render inside an <svg>.
  // Prepend gradient definitions so each icon renders with faceted depth.
  getIcon: async function getIcon(name) {
    const inner = SIMS2_ICONS[name];
    if (!inner) {
      return undefined;
    }
    return { path: GRADIENT_DEFS + inner, viewBox: SIMS2_VIEWBOX };
  },
  // Optional: advertise the available names so icon pickers can list them.
  getPattern: undefined,
  names: Object.keys(SIMS2_ICONS),
};

// Tell Home Assistant to activate the custom icon set. Some HA versions only
// wire card-renderers to hass.icons when the "connection-ready" event fires,
// so register both eagerly (for early-load bundles) and on the event (for
// late-loading ones).
(function () {
  const hass = window.hass;
  if (hass && hass.icons) {
    hass.icons.register(window.customIcons["sims2"]);
  }
  window.addEventListener("connection-ready", function () {
    window.hass?.icons?.register(window.customIcons["sims2"]);
  });
})();

// Announce availability for tooling / debugging.
window.sims2Icons = window.sims2Icons || {
  prefix: "sims2",
  count: Object.keys(SIMS2_ICONS).length,
  names: Object.keys(SIMS2_ICONS),
};
