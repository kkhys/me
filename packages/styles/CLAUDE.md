# CLAUDE.md

`@kkhys/styles` — the uchu.css OKLCH color palette, consumed as source by
every app (`@import "@kkhys/styles/uchu.css"` in each `global.css`).

- Exposes raw palette tokens (`--uchu-*`) only; semantic tokens (`--c-*`)
  stay app-local so each site can map light/dark differently.
- No build step, no scripts. Changing this file affects all five apps.
