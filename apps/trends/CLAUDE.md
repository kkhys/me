# CLAUDE.md

Daily tech trend digest site (trends.kkhys.me), the `@kkhys/trends` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Renders one page per daily run from JSON committed to this repo; data is written by the `creating-trend-digest` Claude Code skill (`.claude/skills/creating-trend-digest` at the repo root), which also commits, deploys, and pushes. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`), light/dark via `light-dark()`. Path alias: `#/*` → `./src/*`.

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
  pages/ask/[date].json.ts    # Per-day context JSON of the AI dialog (buildAskDigest over the run): every row + the hero
  pages/ask/months/[month].json.ts  # Per-month context JSON of the AI dialog (buildAskMonth): each day's hero, highlight scores and category counts, no rows
  layouts/base-layout.astro   # HTML shell wired to the @kkhys/seo primitives; mounts the SearchDialog
  features/search/
    config.ts                 # Dialog id, Pagefind bundle path, meta / filter / sort keys, the localStorage key of the ordering, result limits
    utils/meta.ts             # buildDateMeta / buildDateSort / buildMonthFilter — the data-pagefind-meta / -sort / -filter values of a digest page (pure, unit-tested)
    utils/query.ts            # SortMode (relevance / date), parseSortMode, buildSearchOptions — the Pagefind sort for 新しい順 (pure, unit-tested)
    utils/section.ts          # isItemSection — a Pagefind section whose anchor is an h4 row title (pure, unit-tested)
    verify-index.ts           # isDigestPage + the @kkhys/search verify-index wrapper: the build fails unless the index covers every /<date>.html
    components/search-button.astro  # Header icon button (commandfor → the dialog)
    components/search-dialog.astro  # @kkhys/search shell + the 関連度 / 新しい順 toggle in the filters slot + this site's result row (date / item heading / excerpt)
  features/ask/
    config.ts                 # Dialog id, the day / month JSON endpoints, reference / token / retrieval budgets, the four scopes with their labels, placeholders and suggested questions
    types.ts                  # The slice of Chrome's Prompt API this app calls (hand-written, both quota spellings) + AskScope, AskDigest / AskItem (day JSON), AskMonth / AskDay (month JSON), AskReference
    language-model.ts         # getLanguageModel — the one feature check for the `LanguageModel` global (pure, unit-tested) + LANGUAGE_MODEL_EXPECTATIONS, the Japanese text declaration every availability() / create() carries
    client.ts                 # createAskClient — one base session with the rules-only system prompt, a throwaway clone per question, packs the retriever's material into the context window, QuotaExceededError retry (unit-tested with a fake LanguageModel)
    retrieval.ts              # createRetriever — what the model is shown per scope: ranked rows (この日), Pagefind → day JSON rows (a topic across days), month JSON heroes + top highlights (+ a count table for a trend), memoised fetches, warm() (unit-tested with fake fetch / Pagefind)
    mount.ts                  # mountAskDialog — the DOM wiring, imported by ask-dialog.astro only once the Prompt API is found: scope toggle, download gate, rAF-batched streaming, 参考 links
    utils/digest.ts           # buildAskDigest — run JSON → the rows in page order with their anchors + the hero (pure, unit-tested)
    utils/month.ts            # buildAskDay / buildAskMonth — run JSON → the day's hero, highlight scores and top-level category counts (pure, unit-tested)
    utils/scope.ts            # scopeRange / previousRange / monthsOf / describeRange / jaDate — UTC date maths on ISO strings (pure, unit-tested)
    utils/question.ts         # searchTerms / classifyQuestion — Intl.Segmenter words minus grammar / phrasing / period words, plus the trend and timeline flags (pure, unit-tested)
    utils/days.ts             # topHighlights, formatCategoryTable, formatMonthlyTable — the counting the model cannot do (pure, unit-tested)
    utils/rank.ts             # tokenize / questionTokens / rankItems — lexical retrieval over rows: Latin words + Japanese bigrams + lone kanji, question phrasing cut out, BM25-style with a relevance floor, no model call (pure, unit-tested)
    utils/plain.ts            # plainText — strips the Markdown markers the model writes anyway (bullets → ・, **, #, `) before the answer hits textContent (pure, unit-tested)
    utils/context.ts          # estimateTokens, buildSystemPrompt, Block + packBlocks (tiered packing), rowBlock / heroBlocks / dayBlock / highlightBlock / tableBlock, buildQuestionMessage (pure, unit-tested)
    components/ask-button.astro     # Header icon button beside the search button, shipped `hidden`; mount.ts reveals it when the Prompt API is usable
    components/ask-dialog.astro     # The dialog shell (mirrors the search shell's CSS): scope row, per-scope suggestions, download gate, log, form + the inline gate script that imports mount.ts
  components/
    site-header.astro         # Header (brand → /, Archive / About links with aria-current, AskButton when `ask` is passed — the digest pages — then SearchButton)
    digest-view.astro         # One day's body: DateNav + main(hero + toolbar + markets) + bottom DateNav + generated-at footer + AskDialog; `indexable` puts data-pagefind-body / the date meta + sort / the month filter on main
    digest-hero.astro         # headline / lead / numbered highlights; service chips jump to the item row
    digest-toolbar.astro      # Sticky bar: date permalink, item count (total / fresh), SeenFilter
    group-section.astro       # Group heading (アップデート / グローバル / 日本) over the cards in its slot; digest-view renders the markets global first via sortMarketsGlobalFirst (the run JSON stores japan first)
    source-card.astro         # Section shell shared by service-card and update-card: sticky header with brand-color dot, total + fresh counts, error note, 該当なし / すべて既出 states
    service-card.astro        # Per-service card: SourceCard + an ItemRow per item
    updates-section.astro     # The アップデート group after the markets: an UpdateCard per product with entries (or an error), one 更新なし line for the quiet ones; not rendered when the run has no updates
    update-card.astro         # Per-product card: SourceCard + an UpdateRow per entry
    update-row.astro          # rank → h4 title (id = anchor) → summary → 変更点の要約 fold → meta row (source chip / host; stars right); trimmed sibling of item-row, no score, no date
    source-toc.astro          # Always-visible source TOC (markets → services, then updates → products, per-source counts), ≥1280px only
    item-row.astro            # rank → h4 title (id = anchor) → summary → fold → meta row (facts left: chips / host / engagement / comments link; signal right: score bar + stars)
    seen-filter.astro         # すべて / 既出を除く toggle; flips html[data-seen-filter], persisted in localStorage
    date-nav.astro            # ← 前日 / current date (permalink) / 翌日 →, rendered at top and bottom
  utils/runs.ts               # sortRunsByDateDesc, adjacentRuns, date formatters (pure, unit-tested)
  utils/host.ts               # formatHost — hostname without www. for the meta row
  utils/markets.ts            # sortMarketsGlobalFirst — display order of the markets (pure, unit-tested)
  utils/paragraphs.ts         # splitParagraphs — blank-line split for the summary folds (pure, unit-tested)
  utils/score.ts              # scoreLevel: 80+/60+ thresholds → hi/mid/lo score emphasis
  utils/seen.ts               # countSeen — 既出 item count for the seen filter (pure, unit-tested)
  utils/highlights.ts         # itemAnchorId / highlightAnchors — hero highlight → item row anchors (pure, unit-tested)
  utils/stars.ts              # interestStars — ★ counts; level 1 renders nothing (pure, unit-tested)
  utils/updates.ts            # UPDATES_ID / UPDATES_LABEL, splitProducts (cards vs the 更新なし line; pure, unit-tested)
  utils/service-colors.ts     # Upstream brand colors (services and products), shared by service-card, update-card and source-toc
  styles/global.css           # Imports @kkhys/styles (uchu + tokens + base); app-local --c-faint and the sticky chrome heights
  __tests__/                  # Vitest unit tests
public/                       # robots.txt, manifest, static favicons (generated from dev routes)
```

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css` / `components.css` (the `.btn` of the AI dialog's download gate), imported in `src/styles/global.css`; light/dark via `light-dark()`.
- `@kkhys/ui` — `Budoux` wraps the Japanese copy in `item-row.astro`, `digest-hero.astro`, and `pages/archive.astro`; `HeadMeta` / `SkipLink` in `base-layout.astro`; `observeActiveHeading` from `@kkhys/ui/toc-observer` drives the scrollspy in `source-toc.astro`; the `sparkles` icon marks the AI dialog and its button.
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro` (`twitter:card` is "summary"; no OG image).
- `@kkhys/analytics` — Umami tracker in `base-layout.astro`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the blue radial gradient).
- `@kkhys/search` — the Pagefind dialog (`src/features/search/`, see below), plus `pickSubResult` / `toSectionHref` for the result rows, `verifyPagefindIndex` in `astro.config.ts`, and `loadPagefind` (`@kkhys/search/loader`), the memoised bundle load the AI dialog shares with the search dialog. `astro-pagefind` builds the index after the sitemap integration.

## Data Contract

- The `creating-trend-digest` skill writes `src/content/runs/<YYYY-MM-DD>.json`, commits only that file, runs `pnpm deploy:trends`, then pushes main.
- The zod schema in `content.config.ts` is the single validation gate: a schema violation fails `astro build`, which blocks both deploy and push.
- `digest` is `.strict()` on purpose — retired fields (e.g. `action_note`) must fail the build rather than silently pass.
- When changing the schema, update in the same change: `content.config.ts`, the JSON example in `.claude/skills/creating-trend-digest/SKILL.md`, and every existing file in `src/content/runs/`.
- File name must equal the `date` field; `[date].astro`'s getStaticPaths throws on mismatch.
- All string fields are required with `""` for absent values (no nulls) — keeps `exactOptionalPropertyTypes` out of the data path.
- `discussion_summary` is non-empty only for the top items of comment-capable sources (HN / Lobsters / Reddit / はてなブックマーク, `comments_top_n` in the skill's config, default 10 = every displayed item). It is 2-3 short paragraphs separated by blank lines (`\n\n`); `item-row.astro` splits it with `splitParagraphs` (`utils/paragraphs.ts`) and renders one `<p>` per paragraph inside a `<details>` fold, so older single-paragraph runs render unchanged.
- `article_summary` is the same multi-paragraph format for the sources without a comment fetcher (GitHub Trending / Zenn / Qiita, plus dev.to / Hugging Face Daily Papers in older runs, `articles_top_n` in the skill's config), summarizing the article body the fetch script attaches. Mutually exclusive with `discussion_summary`; the fold label switches (コメントの要約 / 記事の要約). Techmeme items carry neither summary — the headline is already the condensed story. Older runs predate the field and rely on the zod default.
- dev.to (`devto`) and Hugging Face Daily Papers (`hfpapers`) left the source set on 2026-09-05 via `disabled_sources` in the skill's config; new runs omit them. Runs up to that date still contain them, so `service-colors.ts` keeps their entries and the schema keeps accepting them.
- `title_ja` (on items and digest highlights) is a Japanese translation of an originally non-Japanese title, `""` when the title is already Japanese. When present it becomes the linked title and the original renders beneath it. Older runs predate the field and rely on the zod default.
- `updates` (since 2026-09-22; older runs rely on the `[]` default) holds one product per entry — `claude`, `openai`, `devin`, `cursor`, `github_changelog`, `orca`, `slack` — with the same `status` / `note` / `items` shape as a service but a different item: `title`, `title_ja`, `url`, `source` (which feed of the product: "Claude Code", "Platform", "Forum", GitHub's categories ...), `published_at` (ISO 8601 provenance, `""` for the month-dated Slack page), `interest`, `summary`, `article_summary` (the 変更点の要約 fold). No `score`, `engagement_label`, `comments_url`, `discussion_summary` or `seen_before`: the feeds carry no engagement and rows stay in publication order. Like a morning paper, a digest carries the entries that appeared since the previous run, whatever their publication time; earlier days' files are never edited. The run files, not `seen.json`, are the record of what has been shown, and the fetch script drops any URL already placed in one. The skill keeps only notable changes (new features, models, pricing, breaking changes, deprecations), leaves fix-only releases out and keeps fixes out of the summaries, and writes `items: []` for a product with nothing notable. A backfilled run writes `updates: []`.

## Key Design Decisions

- The UI follows the kkhys.me design language (see apps/me): plain `--uchu-yang`/`--uchu-yin` background, hairline separators instead of cards, a `--content-width` content column, `2026.08.10` date format, and the shared `--c-*` / `--fs-*` / `--radius-*` tokens from `@kkhys/styles`.
- `/` renders the latest run in full (duplicate of its `/[date]` page, accepted); `/[date]` is the permanent URL.
- Markets display global first: `digest-view.astro` applies `sortMarketsGlobalFirst` before rendering the sections and the TOC, while the run JSON keeps japan first. Reorder there, not in the data.
- The アップデート group renders last, after 日本; `splitProducts` (`utils/updates.ts`) turns the products with no entries into one 更新なし line so a quiet day costs one line, not seven empty cards, and a product with `status: "error"` keeps its card so the failure is visible. The group id `updates` works like a market id for anchors (`updates-{product}-{rank}`), the TOC and `highlightAnchors`. The toolbar count includes the entries; the 既出 filter ignores them (they are never 既出). Rows show no date; the digest's own date frames them.
- Client JS is minimal: `source-toc.astro` only wires `observeActiveHeading` from `@kkhys/ui/toc-observer` (the `pickActiveId` selection logic lives in `packages/ui/src/toc-active.ts`), and the 既出 filter toggle stays colocated in `seen-filter.astro`. Navigation between sources is the TOC's job — the header holds only the brand link, Archive / About, the AI button (digest pages, hidden until the Prompt API is found) and the search button.
- The 既出 filter is CSS-driven: rows carry an `is-seen` class, per-service counts are prerendered for both modes (`service-card.astro` renders the total and the fresh count and swaps them with CSS), and `html[data-seen-filter="hide"]` switches everything. JS only flips that attribute and persists the choice (`trends:seen-filter`); without JS the toggle stays hidden and the site behaves as before.
- `service-card.astro` has two empty states: 該当なし when a service returned no items with `status: "ok"`, and すべて既出 (shown only in hide mode) when every item is 既出, so a fully-filtered service keeps more than a bare header.
- The source TOC descends from apps/me's `toc.astro` but stays visible instead of expanding on hover; the observer keeps one entry highlighted while scrolling. Anchor ids are `{market.id}` on h2 and `{market.id}-{service.id}` on h3.
- `about.astro` is the visitor-facing spec of the score (engagement percentile 75% + freshness decay 25%, hi/mid/lo at 80 / 60 shown as the fill of a small bar), the interest stars (★★★ / ★★☆; level 1 renders no stars), and the 既出 / summary fold terms. Keep it in step with the skill's scoring when that changes.
- Sticky chrome: `digest-toolbar` sticks at the top of `main`, each `service-card` header sticks below it, and every anchor target (h2 / h3 / item h4) offsets its `scroll-margin-top` by `--toolbar-height` / `--service-header-height` from `global.css` (the h4 adds the row's top padding so the row lands whole). The toolbar's hairline appears only while stuck, via a `scroll-state()` container query.
- Hero highlights link to their own row: `highlightAnchors` (`utils/highlights.ts`) resolves each highlight URL to an item anchor (`{market}-{service}-{rank}`, the id of the row's h4), matching the service label first because the same URL can appear in several services; the matched rows show a ハイライト chip.
- Service dot colors are upstream brand colors, intentionally not mapped to the uchu palette.
- Search indexes one Pagefind page per day: `/[date]` passes `indexable` to `digest-view.astro`, which puts `data-pagefind-body`, `data-pagefind-meta="date:<date>"` and `data-pagefind-filter="month:<YYYY-MM>"` (the AI dialog narrows a cross-day search with it) on `<main>`; `/` renders the same run without them, and archive / about carry none, so a day appears once. Item titles are `h4` elements carrying the row anchor id (`{market}-{service}-{rank}`), so Pagefind splits a day into one `sub_result` per item; the dialog prefers an item row (`isItemSection`, the heaviest one when several matched) and shows it as "date / title" linking to `/<date>#<anchor>`, so a day whose headline merely mentions the query still lands on the article. Only when no row matched does it fall back to the heaviest section, i.e. the hero (the headline, linking to the page) or a group / source heading. The excerpt drops the heading it opens with (`stripLeadingText`), since the title line already shows it. The 関連度 / 新しい順 toggle under the field switches a Pagefind `sort` on the `date` value `digest-view.astro` puts in `data-pagefind-sort`; a sort replaces relevance entirely, so 新しい順 is the newest matching days. The choice persists in localStorage (`trends:search-sort`). Chrome inside `<main>` is excluded with `data-pagefind-ignore`: the toolbar, source-card counts / notes / empty states, the 更新なし line, fold labels, the ハイライト and 既出 badges, engagement, the comments link, the score / stars, and the sr-only 新しいタブ notes. Category chips and hosts stay indexed. `verify-index.ts` fails the build unless the index covers exactly the `/<YYYY-MM-DD>.html` files.
- `runs/**` JSON is excluded from oxlint/oxfmt via root `ignorePatterns` — data, not code.
- AI に質問 (`src/features/ask/`): a dialog on every digest page where Chrome's built-in Gemini Nano (the Prompt API, `LanguageModel`, Chrome 148+ desktop only) answers questions about the digests. Nothing leaves the device and there is no server. Progressive enhancement in two steps: the header button (an icon button beside the search button, since the dialog spans every digest and not just the open day) ships `hidden`, and the inline script in `ask-dialog.astro` only checks for the global and `availability()` — asked, like `create()`, with `LANGUAGE_MODEL_EXPECTATIONS` (text in / text out, `ja`), since Chrome answers per declared language (zh reports `unavailable` on a profile that has ja); when that is not `unavailable` it `import()`s `mount.ts` (a separate chunk, ~7KB gzip) which reveals the button — every other browser downloads the ~2KB gate and nothing else. Scopes: a この日 / 7日間 / 30日間 / 全期間 text toggle (`button[aria-pressed]`, same look as the search dialog's 関連度 / 新しい順) under the header; the dialog's `data-scope` picks that scope's suggested questions via CSS and `mount.ts` swaps the placeholder. A bounded scope is the N days ending on the open page (`scopeRange`, clamped to the first run), 全期間 is first run → open page, so an old page is its own vantage point. Context, by scope (`retrieval.ts`): この日 fetches `/ask/<date>.json` and hands over the rows `rankItems` picks lexically (Latin words + Japanese bigrams + lone kanji, BM25-style over title / category / source / group / summary / fold, rows under a quarter of the best score dropped; `questionTokens` cuts phrasing and period words — について / 教えて / この日 / 今週 … — out first, so 「この日の要点を教えて」 matches no row and gets the hero instead: the headline + lead unnumbered, then each highlight as a numbered block linking its row, so the `[n]` the model writes lead somewhere). A wider scope with a topic (`searchTerms`: Intl.Segmenter words minus grammar / phrasing / period / change words) runs one Pagefind `search` per term — Pagefind requires every word of a multi-word query and would drop the pages that miss the phrasing — merges by page, keeps the `searchDays` best in range (the `month` filter narrows every scope to the months of its range first; 全期間 on an old page stops at that page), fetches those days' JSON and ranks the rows the matched h4 sections point at — by date instead when the question asks for a 時系列 / 経緯, so the model narrates in the order it reads. A wider scope without a topic fetches `/ask/months/<YYYY-MM>.json` for the months in range and hands over each day's hero (headline always, highlight titles then lead as room allows, newest days first when days must go) plus the top-scored highlights; a trend question (`classifyQuestion`: 傾向 / 増え / 変化 …) adds `formatCategoryTable` against the same number of days before (skipped while the archive has under half a period before the range), and 全期間 always gets `formatMonthlyTable` with no day blocks — the model never counts, it puts the numbers into words. Everything is a `Block` (fullest → leanest renderings, priority, order, optional reference) that `packBlocks` lays into the room the session reports (`contextWindow - contextUsage`, or `inputQuota` / `inputUsage` in older builds; a fixed budget when neither exists): every block at its leanest first, then stepped up by priority, verified with `measureContextUsage` when offered, repacked smaller on a `QuotaExceededError`. The system prompt holds only the rules (plain text, cite `[n]`, dates as 10月18日, never invent), so one base session serves every scope; every question runs in a fresh clone of it that is destroyed with the answer — there is no conversation (a week's material fills most of the 9k window, so history would only push the next question's material out), the log is a record and 履歴を消す only empties it. Model output is written with `textContent` only, the whole answer so far rewritten once per animation frame through `plainText` (Gemini Nano writes `**` and `* ` bullets whatever the prompt says; the measured window is 9,216 tokens on Chrome 156); each answer lists what it was given as 参考 links (`#anchor` on the open page, `/<date>#anchor` or `/<date>` elsewhere, cross-day rows prefixed with their date). A `downloadable` model shows the download gate first, since the download needs a user activation and several GB; `availability()` is asked again on every open until the session exists, because Chrome evicts the model when the disk runs low and swaps it on an update while a page stays open. Month JSON and Pagefind are warmed on scope change and on hover of the header button, never the model. Dev works without a build for the JSON routes; the cross-day topic path needs `/pagefind/` and so a build, like the search dialog.

## How to Work

- Run scripts from this directory, or from the repo root via `pnpm dev:trends` / `build:trends` / `deploy:trends`.
- CI builds with the real JSON in this repo (no fixtures, no submodule).
- `/pagefind/` is served from `dist` in dev, so the dialog only finds results after a `pnpm build`; without one it reports a load failure and nothing else breaks.
- Deploy: `pnpm deploy:trends` → `wrangler pages deploy dist --project-name=trends`. Normally invoked by the skill, not by hand.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `sharp` must stay in dependencies even though only `@kkhys/og` uses it — pnpm's strict node_modules can't resolve it from the prerender chunk otherwise
- Pagefind only splits a page at headings with ids, so a title that stops being an `h4[id]` silently merges its row into the previous result; keep the id on the heading, not the `<article>`
