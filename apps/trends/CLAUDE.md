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
  pages/about.astro           # What the site is + score / star criteria for visitors
  pages/api/favicon/          # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro   # HTML shell wired to the @kkhys/seo primitives
  components/
    site-header.astro         # Static header (brand → /, Archive / About links)
    digest-view.astro         # One day's body: DateNav + hero + markets + generated-at footer
    digest-hero.astro         # headline / lead / numbered highlights
    market-section.astro      # グローバル / 日本 section (global first via sortMarketsGlobalFirst in digest-view; the run JSON stores japan first)
    service-card.astro        # Per-service section (brand-color dot, total + fresh counts, error note, 該当なし / すべて既出 states)
    source-toc.astro          # Always-visible source TOC (markets → services), ≥1280px only
    item-row.astro            # rank → title → summary → meta row (score, stars, chip, host, engagement)
    seen-filter.astro         # すべて / 既出を除く toggle; flips html[data-seen-filter], persisted in localStorage
    date-nav.astro            # ← 前日 / current date (plain text) / 翌日 →
  utils/runs.ts               # sortRunsByDateDesc, adjacentRuns, date formatters (pure, unit-tested)
  utils/host.ts               # formatHost — hostname without www. for the meta row
  utils/markets.ts            # sortMarketsGlobalFirst — display order of the markets (pure, unit-tested)
  utils/paragraphs.ts         # splitParagraphs — blank-line split for the summary folds (pure, unit-tested)
  utils/score.ts              # scoreLevel: 80+/60+ thresholds → hi/mid/lo score emphasis
  utils/seen.ts               # countSeen — 既出 item count for the seen filter (pure, unit-tested)
  utils/service-colors.ts     # Upstream brand colors, shared by service-card and source-toc
  styles/global.css           # Imports @kkhys/styles (uchu + tokens + base); app-local --c-star / --c-faint
  __tests__/                  # Vitest unit tests
public/                       # robots.txt, manifest, static favicons (generated from dev routes)
```

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css`, imported in `src/styles/global.css`; light/dark via `light-dark()`.
- `@kkhys/ui` — `Budoux` wraps the Japanese copy in `item-row.astro`, `digest-hero.astro`, and `pages/archive.astro`; `HeadMeta` / `SkipLink` in `base-layout.astro`; `observeActiveHeading` from `@kkhys/ui/toc-observer` drives the scrollspy in `source-toc.astro`.
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro` (`twitter:card` is "summary"; no OG image).
- `@kkhys/analytics` — Umami tracker in `base-layout.astro`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the blue radial gradient).

## Data Contract

- The `creating-trend-digest` skill (claude-code-marketplace repo) writes `src/content/runs/<YYYY-MM-DD>.json`, commits only that file, runs `pnpm deploy:trends`, then pushes main.
- The zod schema in `content.config.ts` is the single validation gate: a schema violation fails `astro build`, which blocks both deploy and push.
- `digest` is `.strict()` on purpose — retired fields (e.g. `action_note`) must fail the build rather than silently pass.
- When changing the schema, update in the same change: `content.config.ts`, the JSON example in the skill's SKILL.md, and every existing file in `src/content/runs/`.
- File name must equal the `date` field; `[date].astro`'s getStaticPaths throws on mismatch.
- All string fields are required with `""` for absent values (no nulls) — keeps `exactOptionalPropertyTypes` out of the data path.
- `discussion_summary` is non-empty only for the top items of comment-capable sources (HN / Lobsters / Reddit / はてなブックマーク, `comments_top_n` in the skill's config, default 10 = every displayed item). It is 2-3 short paragraphs separated by blank lines (`\n\n`); `item-row.astro` splits it with `splitParagraphs` (`utils/paragraphs.ts`) and renders one `<p>` per paragraph inside a `<details>` fold, so older single-paragraph runs render unchanged.
- `article_summary` is the same multi-paragraph format for the sources without a comment fetcher (GitHub Trending / dev.to / Zenn / Qiita / Hugging Face Daily Papers, `articles_top_n` in the skill's config), summarizing the article body the fetch script attaches. Mutually exclusive with `discussion_summary`; the fold label switches (コメントの要約 / 記事の要約). Techmeme items carry neither summary — the headline is already the condensed story. Older runs predate the field and rely on the zod default.
- `title_ja` (on items and digest highlights) is a Japanese translation of an originally non-Japanese title, `""` when the title is already Japanese. When present it becomes the linked title and the original renders beneath it. Older runs predate the field and rely on the zod default.

## Key Design Decisions

- The UI follows the kkhys.me design language (see apps/me): plain `--uchu-yang`/`--uchu-yin` background, hairline separators instead of cards, a `--content-width` content column, `2026.08.10` date format, and the shared `--c-*` / `--fs-*` / `--radius-*` tokens from `@kkhys/styles`.
- `/` renders the latest run in full (duplicate of its `/[date]` page, accepted); `/[date]` is the permanent URL.
- Markets display global first: `digest-view.astro` applies `sortMarketsGlobalFirst` before rendering the sections and the TOC, while the run JSON keeps japan first. Reorder there, not in the data.
- Client JS is minimal: `source-toc.astro` only wires `observeActiveHeading` from `@kkhys/ui/toc-observer` (the `pickActiveId` selection logic lives in `packages/ui/src/toc-active.ts`), and the 既出 filter toggle stays colocated in `seen-filter.astro`. Navigation between sources is the TOC's job — the header stays a plain brand link.
- The 既出 filter is CSS-driven: rows carry an `is-seen` class, per-service counts are prerendered for both modes (`service-card.astro` renders the total and the fresh count and swaps them with CSS), and `html[data-seen-filter="hide"]` switches everything. JS only flips that attribute and persists the choice (`trends:seen-filter`); without JS the toggle stays hidden and the site behaves as before.
- `service-card.astro` has two empty states: 該当なし when a service returned no items with `status: "ok"`, and すべて既出 (shown only in hide mode) when every item is 既出, so a fully-filtered service keeps more than a bare header.
- The source TOC descends from apps/me's `toc.astro` but stays visible instead of expanding on hover; the observer keeps one entry highlighted while scrolling. Anchor ids are `{market.id}` on h2 and `{market.id}-{service.id}` on h3.
- `about.astro` is the visitor-facing spec of the score (engagement percentile 75% + freshness decay 25%, hi/mid/lo at 80 / 60), the ★1-3 interest stars, and the 既出 / summary fold terms. Keep it in step with the skill's scoring when that changes.
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
