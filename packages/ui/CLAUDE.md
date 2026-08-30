# CLAUDE.md

`@kkhys/ui` — shared Astro UI components, consumed as source (no build
step).

- `spinner.astro` — loading spinner (memo / lgtm infinite scroll). Colors
  via the shared `--c-*` tokens from `@kkhys/styles`. `role="status"` with
  a `label` prop (default "Loading"; memo passes 読み込み中).
- `budoux.astro` — wraps its slot and inserts `<wbr>` at Japanese phrase
  boundaries (me / trends).
- `budoux` (`src/budoux.ts`) — cached BudouX HTML parser behind the
  component; also used directly for OG image titles.
- `site-header.astro` / `site-footer.astro` — the centered small-site
  chrome (header: memo / lgtm / art / trends / design; footer: memo / lgtm /
  design / me). Both expect the consumer's body grid to define the
  `[top]` / `[main-start]` / `[main-end]` / `[bottom]` row names. The
  header's `actions` slot pins controls to the right edge (memo's search
  button).
  `heading` renders the header title as the page's `<h1>` (lgtm, memo
  feed / thread / tag); `backLabel` / `navLabel` name the back button and
  the footer nav in the page's language.
- `skip-link.astro` — the "skip to content" link placed first in `<body>`;
  hidden until keyboard focus, targets `#main` (every layout gives its
  `<main>` that id). `label` is required, in the page's language.
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
- `blur-image.astro` — the blur-up `<Picture>` itself (memo / diary / art):
  20px placeholder behind a `blur(36px)`, aspect ratio reserved, `radius`
  / `framed` / `transitionName` / `priority` props. me's `image.astro` keeps
  its own wrapper (figure, wide breakout).
- `head-meta.astro` — charset, viewport, the color-scheme meta (must come
  before any stylesheet), the @kkhys/og favicon set, and the sitemap link.
  `colorScheme="light"` for art / diary, `icons={false}` for design.
- `infinite-scroll.astro` / `paginated-guard.astro` — append-next-page
  scrolling for memo / lgtm feeds (container carries `data-current-page`
  / `data-total-pages` / `data-base-path`) and the redirect that bounces
  direct visits to non-first pages. `endMessage` / `errorMessage` /
  `loadingLabel` carry the announced text; the defaults are English, so
  Japanese apps pass their own. The behaviour lives in `infinite-scroll.ts`
  (`initInfiniteScroll(root?)`, unit-tested with linkedom); the component's
  script only calls it. Pass a root to wire markup inserted after load —
  the design site's demo restores its first page and calls it again.
- `toc-active` / `toc-observer` — scrollspy: `pickActiveId` (pure) and
  `observeActiveHeading` (IntersectionObserver over the headings, calls
  back with the active link) for me's TOC and trends' source TOC.
- `link-metadata` — `createMetadataFetcher({ enabled, placeholder })`:
  `fetch-site-metadata` plus the repairs link cards have needed (garbled
  legacy charsets, SVG / undecodable og:images, http-only image hosts),
  memoized per URL. me / memo wrap it with their own production check.
- `icons/*.svg` — the Lucide glyphs shared by the apps (search, arrow-left,
  check, copy, link, move-up-right, …); import as
  `@kkhys/ui/icons/<name>.svg` and pass `width` / `height` / `class`.
  Brand icons stay in the app that uses them.

`.astro` exports can only be imported from `.astro` files (tsc doesn't
resolve them); `./budoux` is the plain-TS entry for `.ts` / `.tsx`
consumers. `vitest run` covers the parser, the blur-load handlers, and the
favicon resolver.
