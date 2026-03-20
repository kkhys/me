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

memo-content/                   # Git submodule — all production content lives here, not in main repo
```

## Content System

Each memo is a directory in `memo-content/memo/` containing `index.md` and optional images (max 4, JPG/PNG). Schema: `id` (ULID), `createdAt`, `tag?`, `images?`, `comment?` (parent ULID for threaded replies), `isDraft`, `author`, `hideLinkCard`.

`USE_FIXTURE_DATA=true` switches to `src/__fixtures__/memo-sample` for CI/development without the submodule.

## Constraints

- Memo body ≤499 characters (enforced at build by remark plugin)
- Max 4 images per memo (JPG/PNG only)
- Development shows drafts (`isDraft: true`); production filters them out
- Path alias: `#/*` → `./src/*`

## Testing

- Mocked modules: `astro:content`, `astro:env/client`
- Coverage target: `src/utils/*.ts` and `src/lib/*.ts` (excludes `image.ts`)
- Fixtures: `src/__fixtures__/memo-collection.ts`
