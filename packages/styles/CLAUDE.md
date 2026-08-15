# CLAUDE.md

`@kkhys/styles` — shared design tokens and base styles, consumed as source
by every app.

- `uchu.css` — raw uchu OKLCH palette (`--uchu-*`). Primitive layer only.
- `tokens.css` — shared semantic tokens: `--c-*` colors (via `light-dark()`),
  `--fs-*` / `--fw-*` / `--lh-*` / `--radius-*` / `--space-*` scales,
  `--font-mono`, `--shadow-sm`, `--content-width`, focus-ring tokens.
- `base.css` — shared base rules built on the tokens (focus ring, html
  defaults, scrollbars, `::selection`, `.budoux` / `.palt`).
- `components.css` — shared component classes (`.btn` and its
  `--outline` / `--ghost` / `--size-*` modifiers), used by me / studio /
  design.
- `src/colors.ts` (`@kkhys/styles/colors`) — hex mirrors of uchu values for
  Satori, which cannot resolve CSS custom properties.

Apps import css files into their cascade layers
(`@import "@kkhys/styles/tokens.css" layer(tokens);` etc.). Each app declares
its own `color-scheme` (diary pins light) and may override any token in its
local tokens layer; app-specific tokens (me's prose/code colors, trends'
`--c-star`) stay app-local.

`vitest run` checks token reference integrity (every `var()` in
tokens.css / base.css / components.css resolves; `uchuHex` keys exist in the
palette).
Changing these files affects all apps.
