# CLAUDE.md

Daily tech trend digest site (trends.kkhys.me), the `@kkhys/trends` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Renders one page per daily run from JSON committed to this repo; data is written by the `creating-trend-digest` Claude Code skill, which also commits, deploys, and pushes. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`), light/dark via `light-dark()`. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  content.config.ts           # runs collection: glob loader over src/content/runs/*.json + zod schema
  content/runs/<date>.json    # One digest per day, written by the skill — do not edit by hand
  pages/index.astro           # Latest run, fully rendered (/ always shows today)
  pages/[date].astro          # Permanent per-day URL (/2026-08-10) with prev/next nav
  pages/archive.astro         # Date-descending list of all runs
  pages/api/favicon/          # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro   # HTML shell wired to the @kkhys/seo primitives
  components/
    site-header.astro         # Sticky header + market tabs + keyword filter (client JS lives here)
    digest-view.astro         # One day's body: DateNav + hero + markets + generated-at footer
    digest-hero.astro         # headline / lead / numbered highlights
    market-section.astro      # 日本 / グローバル section
    service-card.astro        # Per-service card (brand-color dot, count, error note)
    item-row.astro            # rank / score bar / title / stars / category chip / summary
    date-nav.astro            # prev / archive / next links
  utils/runs.ts               # sortRunsByDateDesc, adjacentRuns (pure, unit-tested)
  utils/search.ts             # buildSearchText — server-side twin of the client filter
  utils/score.ts              # scoreLevel: 80+/60+ thresholds → hi/mid/lo bar colors
  styles/global.css           # --c-* tokens (light-dark over uchu palette) + .hidden helper
  __tests__/                  # Vitest unit tests
public/                       # robots.txt, manifest, static favicons (generated from dev routes)
```

## Data Contract

- The `creating-trend-digest` skill (claude-code-marketplace repo) writes `src/content/runs/<YYYY-MM-DD>.json`, commits only that file, runs `pnpm deploy:trends`, then pushes main.
- The zod schema in `content.config.ts` is the single validation gate: a schema violation fails `astro build`, which blocks both deploy and push.
- `digest` is `.strict()` on purpose — retired fields (e.g. `action_note`) must fail the build rather than silently pass.
- When changing the schema, update in the same change: `content.config.ts`, the JSON example in the skill's SKILL.md, and every existing file in `src/content/runs/`.
- File name must equal the `date` field; `[date].astro`'s getStaticPaths throws on mismatch.
- All string fields are required with `""` for absent values (no nulls) — keeps `exactOptionalPropertyTypes` out of the data path.

## Key Design Decisions

- `/` renders the latest run in full (duplicate of its `/[date]` page, accepted); `/[date]` is the permanent URL.
- Tabs and keyword filter are the only client JS, colocated in `site-header.astro`. The `.hidden` class they toggle lives in `global.css` because it targets elements owned by other components.
- Service dot colors are upstream brand colors, intentionally not mapped to the uchu palette.
- `runs/**` JSON is excluded from oxlint/oxfmt via root `ignorePatterns` — data, not code.

## How to Work

- Run scripts from this directory, or from the repo root via `pnpm dev:trends` / `build:trends` / `deploy:trends`.
- CI builds with the real JSON in this repo (no fixtures, no submodule).
- Deploy: `pnpm deploy:trends` → `wrangler pages deploy dist --project-name=trends`. Normally invoked by the skill, not by hand.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `sharp` must stay in dependencies even though only `@kkhys/og` uses it — pnpm's strict node_modules can't resolve it from the prerender chunk otherwise
