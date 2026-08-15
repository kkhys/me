# CLAUDE.md

Design system documentation site (design.kkhys.me), the `@kkhys/design` app
of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Documents
the shared tokens (`@kkhys/styles`) and components (`@kkhys/ui`) by parsing
the actual CSS sources at build time — token pages can never drift from the
real values. TypeScript strictest mode. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro           # Principles + usage + table of contents
  pages/colors.astro          # Semantic --c-* tokens (light/dark swatch pairs) + uchu palette
  pages/typography.astro      # --fs- / --fw- / --lh- / --font-mono with live samples
  pages/layout.astro          # --space- / --radius- / --content-width / --shadow-sm / selection
  pages/components.astro      # Live @kkhys/ui demos + base.css behaviors (focus ring, scrollbar)
  layouts/base-layout.astro   # HTML shell wired to @kkhys/seo BaseSEO
  components/site-header.astro / site-footer.astro
  components/token-swatch.astro  # name / light+dark swatch / value row
  utils/tokens.ts             # parseCustomProperties / splitLightDark / filterByPrefix (unit-tested)
  styles/global.css           # Imports @kkhys/styles (uchu + tokens + base) + page chrome
  __tests__/                  # Vitest unit tests
vrt/
  pages.spec.ts               # Playwright full-page screenshots of all five pages
  serve.mjs                   # Foreground static server for dist/ (astro preview daemonizes)
  __screenshots__/            # Committed baselines, one directory per project (light / dark)
```

## Key Design Decisions

- Token pages import the shared CSS with Vite `?raw` and parse the custom
  properties with `utils/tokens.ts` — the stylesheet itself is the single
  source of truth, there is no duplicated token table to maintain.
- Light/dark swatch pairs render by pinning `color-scheme` per swatch, so
  the browser resolves each `light-dark()` token exactly as apps see it.
- No analytics and no OG image pipeline yet — add `@kkhys/analytics` with a
  Umami website id when the site is registered there.

## How to Work

- Run scripts from this directory, or from the repo root via
  `pnpm dev:design` / `build:design` / `deploy:design`.
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
