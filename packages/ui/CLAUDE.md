# CLAUDE.md

`@kkhys/ui` — shared Astro UI components, consumed as source (no build
step).

- `spinner.astro` — loading spinner (memo / lgtm infinite scroll). Colors
  via the shared `--c-*` tokens from `@kkhys/styles`.
- `budoux.astro` — wraps its slot and inserts `<wbr>` at Japanese phrase
  boundaries (me / trends).
- `budoux` (`src/budoux.ts`) — cached BudouX HTML parser behind the
  component; also used directly for OG image titles.
- `site-header.astro` / `site-footer.astro` — the centered small-site
  chrome (memo / lgtm). Both expect the consumer's body grid to define the
  `[top]` / `[main-start]` / `[main-end]` / `[bottom]` row names.
- `blur-load-noscript.astro` — the no-JS fallback for blur-up images;
  `selector` prop defaults to `.blur-load` (memo passes
  `[data-blur-load]`).

`.astro` exports can only be imported from `.astro` files (tsc doesn't
resolve them); `./budoux` is the plain-TS entry for `.ts` / `.tsx`
consumers. `vitest run` covers the parser.
