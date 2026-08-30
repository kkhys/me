# CLAUDE.md

Astro-based memo posting site. Short memos (max 500 chars) in a threaded social media layout with replies. Deployed on Cloudflare Pages.

## Codebase Map

```
src/
├── pages/
│   ├── [...page].astro        # Paginated feed with infinite scroll (pinned memos first)
│   ├── posts/[id].astro       # Single memo detail
│   ├── tag/[tag]/[...page].astro  # Tag-filtered feed, paginated
│   ├── @[slug]/[...page].astro    # Author profile feed: pinned + paginated
│   └── api/
│       ├── posts/[id].json.ts # Public JSON per memo (consumed by apps/me)
│       ├── og/default.png.ts  # Default OG image via @kkhys/og
│       └── favicon/[file].ts  # Favicon set via @kkhys/og
├── components/                 # Astro components; seo/ wraps @kkhys/seo primitives
├── layouts/                    # layout.astro: head meta, skip link, header/footer, Umami
├── features/
│   └── search/                # Pagefind dialog; pure logic in utils/ (unit-tested); verify-index.ts build check
├── loaders/
│   ├── memo-loader.ts         # Content Layer loader: memo dirs + bot feed entries
│   ├── feed-cache.ts          # On-disk feed cache with TTL + conditional revalidation
│   └── rss-parser.ts          # Minimal RSS parsing for the bot feeds
├── utils/
│   ├── memo.ts                # Filtering, sorting, pinning, comment threading
│   ├── user.ts                # users collection lookup + avatar/cover resolution
│   ├── date.ts                # UTC date formatting
│   ├── image.ts               # Dynamic image imports from submodule
│   └── image-alt.ts           # images[].alt lookup with numbered fallback
├── lib/                        # Remark plugins (word limit, link extraction, etc.) + metadata.ts (link-card fetcher)
├── config/                     # constants.ts: site-level personal config
├── assets/                     # Avatars, covers, bot icons, OG font
├── styles/                     # global.css: @kkhys/styles (uchu/tokens/base) + kiso.css imports, app tokens
├── __fixtures__/               # Test fixtures and sample data
└── __tests__/                  # Vitest tests

memo-content/                   # Git submodule — all production content/personal data lives here, not in main repo
├── memo/                        # Memo directories (index.md + images)
└── data/                        # Personal data: users.yaml (profiles), oss-projects.json (OSS feed)
```

## Content System

Each memo is a directory in `memo-content/memo/` containing `index.md` and optional images (max 4, JPG/PNG). Schema: `id` (ULID), `createdAt`, `tag?`, `images?` (`{ file, alt }[]` — alt text keyed by file name; the files themselves are discovered from the directory by `utils/image.ts`), `comment?` (parent ULID for threaded replies), `quote?` (quoted ULID), `isDraft`, `author`, `hideLinkCard`, `isBot`, `isPinned` (listed first in the main and author feeds), `hideComments` (feeds collapse the replies to a count; the detail page still shows them). Images without an `images[].alt` entry render with a numbered placeholder alt; new memos get their alt from the studio composer.

Personal data (user profiles, OSS project list) lives in `memo-content/data/` to keep it out of the public repo. Avatar/cover images stay in `src/assets`. Site-level personal config (author name, site URL, blog RSS URL) is centralized in `src/config/constants.ts`.

Bot feeds: the memo loader injects entries from external RSS feeds as bot authors — `blog-feed` (`rss-` id prefix) and `zenn-feed` (`zenn-` id prefix), each with a distinct prefix so per-feed stale cleanup stays isolated. Feed XML is cached under `node_modules/.cache/memo-feeds/` with a TTL (default 10 min, override via `FEED_CACHE_TTL_MINUTES`); past the TTL the loader revalidates with conditional requests (ETag/Last-Modified) instead of re-downloading. OSS projects (`oss-` prefix) come from a local JSON file, not a feed.

`USE_FIXTURE_DATA=true` switches to `src/__fixtures__/memo-sample` (memos) and `src/__fixtures__/users.yaml` (sample profiles) for CI/development without the submodule. RSS/Zenn fetches and OSS entries are skipped in fixture mode.

## Shared Packages

Consumed as source (no build step); memo supplies its own config via thin wrappers.

- `@kkhys/ui` — site-header (`src/components/header.astro`), site-footer / skip-link / head-meta / blur-load-noscript (`src/layouts/layout.astro`), blur-image (`memo-images.astro`), link-card + link-metadata + favicon (`link-card.astro`, `lib/metadata.ts`), infinite-scroll + paginated-guard (`paginated-feed.astro`), search icon
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard wrapped in `src/components/seo/`; `@kkhys/seo/json-ld.astro` used directly by the pages
- `@kkhys/og` — OG image + favicon generators behind `src/pages/api/og/` and `src/pages/api/favicon/`
- `@kkhys/styles` — uchu.css palette, semantic tokens, base styles imported by `src/styles/global.css`
- `@kkhys/analytics` — Umami tracker in `src/layouts/layout.astro`
- `@kkhys/search` — Pagefind dialog shell, runner, query helpers (see Search)

## Public JSON API

`src/pages/api/posts/[id].json.ts` statically emits one JSON per published memo: `id`, `body` (raw markdown), `createdAt`, `author` (name / username / absolute avatar URL), `tag`, and `images` (absolute `src`, `width`, `height`, `alt` via `utils/image-alt.ts`). `public/_headers` sets `Access-Control-Allow-Origin: https://kkhys.me` (GET only) on `/api/*`; the consumer is `apps/me/src/lib/api/memo.ts`, which embeds memos in blog posts. Changing the shape breaks me.

## Search

`astro-pagefind` indexes `dist` after `astro build`. Only the root post of each `/posts/[id]` page is indexed: `ThreadPost` gets `indexable` from that page and marks its `.post-text` with `data-pagefind-body` and the author / date / avatar meta the dialog renders. Comments have their own pages, so they are found there; so do bot entries (`rss-` / `zenn-` / `oss-`), which are therefore indexed alongside memos. `verifyPagefindIndex` (`src/features/search/verify-index.ts`, registered after `pagefind()` in `astro.config.ts`) fails the build when the index is missing or covers a different number of pages than `dist/posts/*.html` — astro-pagefind itself only logs indexing errors. The dev server serves `/pagefind/` from `dist`, so run `pnpm build` once before `pnpm dev` to try search locally. The dialog lives in `src/features/search/` as a thin wrapper over `@kkhys/search` (shell, runner, keyboard handling); only the result-row template and the Pagefind meta keys are app-local.

## Constraints

- Memo body ≤500 characters (enforced at build by remark plugin)
- Max 4 images per memo (JPG/PNG only)
- Development shows drafts (`isDraft: true`); production filters them out
- Path alias: `#/*` → `./src/*`

## Testing

- Mocked modules: `astro:content`, `astro:env/client`
- Coverage target: `src/utils/*.ts`, `src/lib/*.ts`, `src/loaders/*.ts`, and `src/features/**/*.ts` (excludes `image.ts`, `memo-loader.ts`)
- Fixtures: `src/__fixtures__/memo-collection.ts`
