# CLAUDE.md

`@kkhys/ui` — shared Astro UI components, consumed as source (no build
step).

- `spinner.astro` — loading spinner (memo / lgtm infinite scroll). Colors
  via the shared `--c-*` tokens from `@kkhys/styles`.
- `budoux.astro` — wraps its slot and inserts `<wbr>` at Japanese phrase
  boundaries (me / trends).
- `budoux` (`src/budoux.ts`) — cached BudouX HTML parser behind the
  component; also used directly for OG image titles.

`.astro` exports can only be imported from `.astro` files (tsc doesn't
resolve them); `./budoux` is the plain-TS entry for `.ts` / `.tsx`
consumers. `vitest run` covers the parser.
