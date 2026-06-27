# CLAUDE.md

Astro-based memo posting site. Short memos (max 500 chars) in a threaded social media layout with replies. Deployed on Cloudflare Pages.

## Codebase Map

```
src/
├── pages/
│   ├── [...page].astro        # Paginated feed with infinite scroll
│   ├── post/[id].astro        # Single memo detail
│   └── tag/[tag].astro        # Tag-filtered feed
├── components/                 # Astro components
├── utils/
│   ├── memo.ts                # Filtering, sorting, comment threading
│   └── image.ts               # Dynamic image imports from submodule
├── lib/                        # Remark plugins (word limit, link extraction, etc.)
├── styles/                     # CSS variables, theme (uchu.css, kiso.css)
├── __fixtures__/               # Test fixtures and sample data
└── __tests__/                  # Vitest tests

memo-content/                   # Git submodule — all production content/personal data lives here, not in main repo
├── memo/                        # Memo directories (index.md + images)
└── data/                        # Personal data: users.yaml (profiles), oss-projects.json (OSS feed)
```

## Content System

Each memo is a directory in `memo-content/memo/` containing `index.md` and optional images (max 4, JPG/PNG). Schema: `id` (ULID), `createdAt`, `tag?`, `images?`, `comment?` (parent ULID for threaded replies), `isDraft`, `author`, `hideLinkCard`.

Personal data (user profiles, OSS project list) lives in `memo-content/data/` to keep it out of the public repo. Avatar/cover images stay in `src/assets`. Site-level personal config (author name, site URL, blog RSS URL) is centralized in `src/config/constants.ts`.

Bot feeds: the memo loader injects entries from external RSS feeds as bot authors — `blog-feed` (`rss-` id prefix) and `zenn-feed` (`zenn-` id prefix), each with a distinct prefix so per-feed stale cleanup stays isolated. Feed XML is cached under `node_modules/.cache/memo-feeds/` with a TTL (default 10 min, override via `FEED_CACHE_TTL_MINUTES`); past the TTL the loader revalidates with conditional requests (ETag/Last-Modified) instead of re-downloading. OSS projects (`oss-` prefix) come from a local JSON file, not a feed.

`USE_FIXTURE_DATA=true` switches to `src/__fixtures__/memo-sample` (memos) and `src/__fixtures__/users.yaml` (sample profiles) for CI/development without the submodule. RSS/Zenn fetches and OSS entries are skipped in fixture mode.

## Constraints

- Memo body ≤500 characters (enforced at build by remark plugin)
- Max 4 images per memo (JPG/PNG only)
- Development shows drafts (`isDraft: true`); production filters them out
- Path alias: `#/*` → `./src/*`

## Testing

- Mocked modules: `astro:content`, `astro:env/client`
- Coverage target: `src/utils/*.ts` and `src/lib/*.ts` (excludes `image.ts`)
- Fixtures: `src/__fixtures__/memo-collection.ts`
