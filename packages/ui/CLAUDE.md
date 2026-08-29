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
  `[top]` / `[main-start]` / `[main-end]` / `[bottom]` row names. The
  header's `actions` slot pins controls to the right edge (memo's search
  button).
- `blur-load-noscript.astro` — the no-JS fallback for blur-up images;
  `selector` prop defaults to `.blur-load` (memo passes
  `[data-blur-load], .blur-load`).
- `link-card.astro` — display-only OG link card (me / memo). Metadata
  fetching stays in each app's data layer; this takes `title` /
  `description` / `imageSrc` / `favicon` / `external` as props and does
  the blur-up + responsive image work.
- `favicon` (`src/favicon.ts`) — resolves a declared icon URL into the
  card's `favicon` prop at build time (raster → Astro image pipeline,
  ICO/SVG → data URI, anything dubious → the globe fallback), cached per
  URL.
- `image-signature` (`src/image-signature.ts`) — byte-signature sniffing
  behind that validation; me's metadata layer uses it for og:image too,
  because content-type headers lie.
- `blur-load` (`src/blur-load.ts`) — inline load/error handlers that
  clear a blur-up placeholder (also used by me's content images).

`.astro` exports can only be imported from `.astro` files (tsc doesn't
resolve them); `./budoux` is the plain-TS entry for `.ts` / `.tsx`
consumers. `vitest run` covers the parser, the blur-load handlers, and the
favicon resolver.
