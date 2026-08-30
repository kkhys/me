# CLAUDE.md

Design system documentation site (design.kkhys.me), the `@kkhys/design` app
of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Documents
the shared tokens (`@kkhys/styles`) and components (`@kkhys/ui`) by parsing
the actual CSS sources at build time — token pages can never drift from the
real values. Also consumes `@kkhys/seo` (BaseSEO in `base-layout.astro`) and
`@kkhys/search` (the dialog shell in `components/search-dialog.astro`, the
query helpers in `utils/search.ts`). TypeScript strictest mode. Path alias:
`#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro           # Principles + usage + page index
  pages/colors.astro          # Semantic --c-* tokens (light/dark pairs) + uchu palette matrix
  pages/typography.astro      # --fs- / --fw- / --lh- / --font-mono with live samples
  pages/layout.astro          # --space- / --radius- / --content-width / --shadow-sm / selection
  pages/icons.astro           # @kkhys/ui/icons inventory (glob over the package), sizes, usage, how to add
  pages/components.astro      # Live @kkhys/ui demos on stages (+ 使う / 使わない / 配慮 guidance)
  pages/conventions.astro     # Cross-app UI/UX conventions rendered from data/conventions.ts
  pages/accessibility.astro   # Build-time WCAG contrast table + a11y rules / known gaps / checklist
  pages/preview/[kind].astro  # Standalone demo documents for the phone-width iframe (noindex)
  pages/preview/infinite-scroll/[page].astro  # Pages 2..N of the InfiniteScroll demo feed (fetch targets)
  layouts/base-layout.astro   # Sidebar + main shell: HeadMeta icons={false}, ThemeInit, BaseSEO, SkipLink label="本文へ移動", SiteFooter; runs enhanceProse over the rendered page; data-pagefind-body on <main>
  layouts/preview-layout.astro  # Shell of the /preview documents (no sidebar, noindex, not indexed)
  components/site-sidebar.astro  # Sticky page nav + current page's h2 sections + theme toggle
  components/site-footer.astro
  components/stage.astro      # Demo canvas with controls slot and the mobile (iframe) toggle
  components/demo.astro       # The demo bodies, keyed by DemoKind (shared with /preview)
  components/demo-feed.astro  # One page of the InfiniteScroll fixture feed (inline page 1 / fetched pages)
  components/search-dialog.astro  # This site's Pagefind dialog: @kkhys/search shell + page / section result row
  assets/preview.png          # Generated gradient used by the BlurImage demo
  components/code-block.astro # Shiki <Code> with light/dark themes resolved via light-dark()
  components/token-swatch.astro  # swatch pair / name / L+D values row
  components/rule-list.astro  # rule / detail / values / evidence / deviation cards (Conventions, Accessibility)
  components/source-refs.astro  # prose with `path:line` references turned into GitHub links
  components/theme-init.astro / theme-toggle.astro  # localStorage("theme") → :root[data-theme]
  utils/tokens.ts             # parseCustomProperties / splitLightDark / filterByPrefix (unit-tested)
  utils/color.ts              # OKLCH → sRGB, WCAG contrast + grading, token color resolver (unit-tested)
  utils/prose.ts              # enhanceProse: BudouX over prose blocks + h2[id] section index (unit-tested)
  utils/demos.ts              # DEMO_KINDS / DemoKind / isDemoKind / previewPath
  utils/feed-demo.ts          # FEED_DEMO paging constants + feedDemoPage (unit-tested)
  utils/search.ts             # searchConfig, pickSubResult, toSectionHref (unit-tested)
  utils/source-refs.ts        # splitSourceRefs / SourceRefPart — `path:line` refs in prose (unit-tested)
  utils/pagefind-index.ts     # Index coverage check helpers (unit-tested)
  integrations/verify-pagefind-index.ts  # Fails the build unless the index covers every doc page
  utils/icons.ts              # parseSvgAttributes / iconNameFromPath / iconImportName (unit-tested)
  data/conventions.ts         # Convention groups: rule / detail / values / evidence (path:line) / deviation
  data/accessibility.ts       # Contrast pairs, a11y rule groups, known gaps (with WCAG SC), new-screen checklist
  data/icons.ts               # Per-glyph role + usedBy annotations for the Icons page (hand-curated)
  styles/global.css           # Imports @kkhys/styles (uchu + tokens + base) + site shell
  __tests__/                  # Vitest unit tests
public/
  favicon.svg                 # The only icon; linked by hand since HeadMeta runs with icons={false}
  preview/og.svg              # imageSrc of the LinkCard demo (no network at build time)
  robots.txt
vrt/
  pages.spec.ts               # Playwright full-page screenshots of all eight pages
  serve.mjs                   # Foreground static server for dist/ (astro preview daemonizes)
  __screenshots__/            # Committed baselines, one directory per project (light / dark)
```

## Key Design Decisions

- Token pages import the shared CSS with Vite `?raw` and parse the custom
  properties with `utils/tokens.ts` — the stylesheet itself is the single
  source of truth, there is no duplicated token table to maintain.
- Light/dark swatch pairs render by pinning `color-scheme` per swatch, so
  the browser resolves each `light-dark()` token exactly as apps see it.
- The theme toggle works the same way one level up: it pins `color-scheme`
  on `:root[data-theme]`, so no token needs a second definition. Preview
  iframes follow through the `storage` event.
- BudouX is applied once per page in `base-layout.astro` (`enhanceProse`
  over `Astro.slots.render`), not per element. `data-budoux="off"` opts a
  subtree out (the "without BudouX" demo, the type samples). The same pass
  collects `h2[id]` into the sidebar section list, so give every `h2` an
  id; a `<small>` inside it is the count badge and is excluded from the
  label.
- Code snippets go through `code-block.astro` (Astro's Shiki `<Code>`,
  `github-light` / `poimandres`, `defaultColor={false}`) so token colors
  resolve via `light-dark()` like everything else. Keep `---` fences out
  of snippet template literals — oxlint's Astro parser reads them as the
  end of the frontmatter.
- Search is real: `astro-pagefind` indexes the eight doc pages at build
  time (`data-pagefind-body` sits on `<main>` in `base-layout.astro`, so
  `/preview/*` stays out) and `verify-pagefind-index` fails the build if
  the index covers a different number of pages than `dist/*.html`. The
  dialog (`components/search-dialog.astro`, mounted by the SearchDialog
  demo) renders one row per page: the page title, the `h2` section with
  the heaviest match (`pickSubResult` — Pagefind lists `sub_results` in
  document order) and that section's excerpt, linking to the heading.
  Stages carry `data-pagefind-ignore` (demo labels and fixture text are not
  docs) and `enhanceProse` marks the `h2 > small` count badges the same
  way so they stay out of the anchor titles. The dialog id is
  `site-search`, not `search-dialog`, which the Components page uses as a
  heading id. In dev, `/pagefind/` is served from `dist/`, so run
  `pnpm build` once (and again after content changes) for search to work
  on the dev server.
- The InfiniteScroll demo pages through a fixture feed (`utils/feed-demo.ts`:
  24 items, 6 per page). Page 1 renders inline (in a scroll box on the
  Components page, as the document itself in the phone preview); pages 2–4
  are built at `/preview/infinite-scroll/<n>` and fetched for real, with
  `PaginatedGuard` bouncing direct visits. The feed opts out of BudouX so
  the fetched items match page 1. The stage's `reset` control restores a
  snapshot of the first page and calls `initInfiniteScroll` from
  `@kkhys/ui/infinite-scroll` on the fresh root (in the phone view it
  reloads the iframe); `data-mobile-control` keeps it visible there. HeadMeta and the script utilities
  (toc-observer, link-metadata, JSON-LD, OG handlers) are not on the page
  at all — they have no visual and are described in each package's
  CLAUDE.md.
- Components are demonstrated on `stage.astro`: real, operable instances.
  The `mobile` toggle swaps in `/preview/<kind>` inside a 375px iframe
  because `@kkhys/ui` responds to viewport media queries, which a narrow
  container cannot trigger. Demo markup lives in `demo.astro` so the stage
  and the preview page never drift.
- This site is wider than the apps (`--site-width` 84rem, sidebar 12rem);
  `--content-width` is documented on the Layout page, not used as the
  shell. Body text is `--fs-sm`, notes `--fs-xs`.
- The Conventions page is hand-curated data, not parsed from CSS: each
  rule needs evidence from two or more apps (or a shared package) as
  `path:line` on main, and a `deviation` when an app departs from it.
  Line numbers drift; re-check the cited files when they change. The
  component pages carry short 使う / 使わない / 配慮 guidance in the DADS
  style (spec, usage, caveats) above each stage.
- The Accessibility page is the a11y counterpart: `data/accessibility.ts`
  holds the rules (same `Convention` shape, rendered by `rule-list.astro`),
  the known gaps (each with a WCAG 2.2 success criterion and `path:line`
  evidence) and the checklist. Its contrast table is computed at build
  time by `utils/color.ts` from `uchu.css` + `tokens.css` (OKLCH → sRGB,
  translucent tokens composited over their background), so it tracks
  token changes on its own. WCAG 2.x ratios only — no APCA. Pairs with
  `use: "decorative"` (hairlines, surfaces, the scrollbar thumb) show their
  ratio but grade as 対象外, since 1.4.11 does not cover them; only real
  failures read 不足. The Conventions page keeps no a11y group; a11y rules
  live here.
- The Icons page globs `packages/ui/src/icons/*.svg` twice (component +
  `?raw`) so the inventory and the viewBox / stroke-width spec come from the
  package itself; `data/icons.ts` only adds role and `usedBy`, and the build
  fails if it annotates a glyph that no longer exists. Sizes are the four
  the apps actually render (12 / 14 / 16 / 18px).
- No analytics and no OG image pipeline yet — add `@kkhys/analytics` with a
  Umami website id when the site is registered there.

## How to Work

- Run scripts from this directory, or from the repo root via
  `pnpm dev:design` / `build:design` / `deploy:design`. The dev server
  serves the search bundle from `dist/pagefind`, so build once first.
- CI: lint → test → type check → build across the workspace; no content
  submodule, no fixtures needed.
- Deploy: built and shipped locally via `pnpm deploy:design`
  (`wrangler pages deploy dist --project-name=design`); not deployed from CI.
- Visual regression: `pnpm test:vrt` screenshots every page in light and dark
  against the committed baselines; `pnpm test:vrt:update` re-records them
  after an intended visual change. Run locally only — the baselines render
  with macOS system fonts, so CI would diff on fonts alone. Needs the
  Playwright browser once: `pnpm exec playwright install chromium`.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
