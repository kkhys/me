# CLAUDE.md

`@kkhys/ui` — shared Astro UI components, consumed as source (no build
step).

- `spinner.astro` — loading spinner. Rendered inside `infinite-scroll.astro`
  (memo / lgtm never import it directly); the design demo imports it on
  its own. Colors via the shared `--c-*` tokens from `@kkhys/styles`.
  `role="status"` with a `label` prop (default "Loading"; memo passes
  読み込み中 through `loadingLabel`).
- `budoux.astro` — wraps its slot and inserts `<wbr>` at Japanese phrase
  boundaries (me / trends / design demo).
- `budoux` (`src/budoux.ts`) — cached BudouX HTML parser behind the
  component; also used directly for OG image titles, me's rehype plugin,
  and design's prose helper.
- `site-header.astro` / `site-footer.astro` — the centered small-site
  chrome. Header: memo (`components/header.astro`) and lgtm
  (`layouts/layout.astro`); design renders it only in its component demo.
  Footer: memo / lgtm, plus the design demo. me, art, trends, and the
  design shell keep their own header / footer. Both expect the consumer's
  body grid to define the `[top]` / `[main-start]` / `[main-end]` /
  `[bottom]` row names. Header props: `title` (required), `href` (renders
  the title as a link — lgtm), `showBack` + `backLabel` (memo subpages),
  `heading` (renders the title as the page's `<h1>` — lgtm, memo feed /
  thread / tag), and the `actions` slot that pins controls to the right
  edge (memo's search button). Footer props: `author` (required),
  `authorUrl`, `links`, and `navLabel` (names the footer nav in the page's
  language).
- `skip-link.astro` — the "skip to content" link placed first in `<body>`;
  hidden until keyboard focus, targets `#main` (every layout gives its
  `<main>` that id). `label` is required, in the page's language. Rendered
  by me / memo / lgtm / trends / design; art and diary do not render it.
- `blur-load-noscript.astro` — the no-JS fallback for blur-up images;
  `selector` prop defaults to `.blur-load` (memo passes
  `[data-blur-load], .blur-load`).
- `link-card.astro` — display-only OG link card (me / memo / design demo).
  Metadata fetching stays in each app's data layer. Props extend
  `HTMLAttributes<"a">`: `href` required, `title` / `description` /
  `imageSrc` / `favicon` / `external` optional; it does the blur-up +
  responsive image work.
- `favicon` (`src/favicon.ts`) — resolves a declared icon URL into the
  card's `favicon` prop at build time (raster → Astro image pipeline,
  ICO/SVG → data URI, anything dubious → the globe fallback), cached per
  URL.
- `image-signature` (`src/image-signature.ts`) — byte-signature sniffing
  behind that validation; me's metadata layer uses it for og:image too,
  because content-type headers lie.
- `blur-load` (`src/blur-load.ts`) — inline load/error handlers that
  clear a blur-up placeholder; used by me's content images (`image.astro`,
  `memo-card.astro`) and lgtm's feed (`pages/[...page].astro`).
- `blur-image.astro` — the blur-up `<Picture>` itself (memo / diary / art /
  design demo): 20px placeholder behind a `blur(36px)`, aspect ratio
  reserved. Required: `src` (ImageMetadata) / `alt` / `widths` / `sizes`;
  optional: `width` / `formats` / `quality` / `priority` /
  `transitionName` / `framed` / `radius` / `class`. me's `image.astro`
  keeps its own wrapper (figure, wide breakout).
- `head-meta.astro` — charset, viewport, the color-scheme meta (must come
  before any stylesheet), the @kkhys/og favicon set, and the sitemap link;
  rendered first in `<head>` by all seven apps. `colorScheme="light"` for
  art / diary, `icons={false}` for design, `sitemap={false}` for an app
  without `@astrojs/sitemap` (none passes it today).
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
- `icons/*.svg` — the 12 Lucide glyphs shared by the apps: `arrow-left`,
  `check`, `copy`, `globe`, `info`, `lightbulb`, `link`,
  `message-square-warning`, `move-up-right`, `octagon-alert`, `search`,
  `triangle-alert`. Import as `@kkhys/ui/icons/<name>.svg` and pass
  `width` / `height` / `class`. `globe` is only used by `link-card.astro`.
  Brand icons stay in the app that uses them.

`.astro` exports can only be imported from `.astro` files (tsc doesn't
resolve them); `./budoux` is the plain-TS entry for `.ts` / `.tsx`
consumers. `vitest run` covers `src/__tests__/`: `blur-load` (selector
targeting, reveal on error), `budoux` (cached parser, `<wbr>` insertion,
tags preserved), `favicon` (data-URI inlining, rejections, per-URL cache),
`infinite-scroll` (trigger margin, page append, spinner minimum, end /
error announcements, re-init on replaced markup), `link-metadata`
(disabled placeholder, caching, failure retry, SVG og:image dropped), and
`toc-active` (`pickActiveId`).
