# 💎 Sims 2 icon pack (`sims2:`)

A bundled custom icon set for Home Assistant, drawn as **original vector art in
the spirit of The Sims 2** — diamonds, simoleon coins, the eight Sim needs, and
the buy-mode furniture glyphs (rooms, types, shopping categories). Use them
anywhere you would use an `mdi:` icon.

All artwork is original SVG; no Electronic Arts assets are bundled. The Sims 2
is a trademark of EA, referenced here as an unaffiliated fan tribute.

## Install

1. Copy `www/community/sims2ha/sims2-icons.js` into
   `<config>/www/community/sims2ha/`.
2. Add it as a Lovelace resource (**Settings → Dashboards → Resources → Add
   resource**):

   | URL                                       | Type              |
   | ----------------------------------------- | ----------------- |
   | `/local/community/sims2ha/sims2-icons.js` | JavaScript module |

   (Or add it under `frontend.extra_module_url` — see
   `config-examples/configuration.yaml`.)

3. Clear your browser cache. Icons now resolve as `sims2:<name>`.

## Usage

```yaml
# Anywhere HA accepts an icon:
icon: sims2:plumbob

# On an entity:
light.living_room:
  icon: sims2:type-lighting

# Dashboard sidebar / navigation:
- type: entity
  entity: sensor.house_mood
  icon: sims2:plumbob-mood-green
```

The set lives on a `0 0 24 24` viewBox, so icons scale cleanly next to `mdi:`.
Shapes use `currentColor` for fill, so they recolour automatically with the
theme (active entities glow plumbob-green, inactive ones sit in espresso).

## Icon catalogue (52 icons)

### Core & mascot

| Name                                            | Reads as                       |
| ----------------------------------------------- | ------------------------------ |
| `sims2:plumbob`                                 | the diamond                    |
| `sims2:plumbob-mood-green` / `-yellow` / `-red` | faceted mood diamonds          |
| `sims2:simoleon`                                | a coin bearing a small plumbob |
| `sims2:simoleon-stack`                          | stacked coins                  |
| `sims2:sim` / `sims2:sim-head`                  | a Sim with a plumbob above     |
| `sims2:aspiration-star`                         | the aspiration star            |
| `sims2:want-bubble`                             | a "want" thought bubble        |

### Game-mode marks

`sims2:live-mode` · `sims2:buy-mode` · `sims2:build-mode` · `sims2:cas-mode` · `sims2:story-mode`

### The eight Sim needs

`sims2:need-hunger` · `sims2:need-energy` · `sims2:need-social` · `sims2:need-hygiene` · `sims2:need-fun` · `sims2:need-comfort` · `sims2:need-bladder` · `sims2:need-room`

### Shopping — sort by room

`sims2:room-kitchen` · `sims2:room-bathroom` · `sims2:room-bedroom` · `sims2:room-living` · `sims2:room-dining` · `sims2:room-outside` · `sims2:room-study` · `sims2:room-kids` · `sims2:room-garage` · `sims2:room-hallway`

### Shopping — sort by type / function

`sims2:type-comfort` · `sims2:type-surfaces` · `sims2:type-storage` · `sims2:type-beds` · `sims2:type-electronics` · `sims2:type-appliances` · `sims2:type-plumbing` · `sims2:type-decorative` · `sims2:type-lighting` · `sims2:type-skills` · `sims2:type-toys`

### Shopping — category & sort controls

`sims2:shop-tag` · `sims2:shop-cart` · `sims2:shop-window` · `sims2:sort-rooms` · `sims2:sort-type` · `sims2:sort-function` · `sims2:sort-name` · `sims2:sort-price`

## Customising / extending

Each icon is a string of inner-SVG markup in the `SIMS2_ICONS` table at the top
of `sims2-icons.js`. Add a new entry and it is immediately available as
`sims2:<your-name>`:

```js
const SIMS2_ICONS = {
  // ...
  "my-thing": '<path d="M3 3 H21 V21 H3 Z"/>',
};
```

Keep geometry on the `0 0 24 24` viewBox, use `fill="currentColor"` (or omit
fill to inherit it), and reserve `#FFFFFF` for in-icon highlights. The palette
contract lives in [PALETTE.md](PALETTE.md).
