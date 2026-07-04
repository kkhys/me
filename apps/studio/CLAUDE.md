# CLAUDE.md

Local-only browser app for composing memos into `apps/memo/memo-content`. Never deployed — it runs on the developer's machine (`pnpm dev:studio`, binds to 127.0.0.1:5757) and writes directly to the memo-content submodule.

## Codebase Map

```
src/
├── server.ts        # Bun.serve: serves the UI (HTML import) + JSON API, git status/sync
├── memo-store.ts    # Pure Node module: list/create memos, frontmatter, validation
├── memo-filter.ts   # Pure Node module: free-text feed filtering (AND terms)
├── request-guard.ts # Pure Node module: Host/Origin validation for all API routes
├── index.html       # Single-page UI (bundled by Bun with client.ts / styles.css)
├── client.ts        # Frontend: compose form, image attach, reply/quote, search, feed, sync
├── styles.css       # Vanilla CSS on top of @kkhys/styles (uchu.css)
└── __tests__/       # Vitest tests for the pure modules (run on Node — no Bun APIs there)
```

## API

All API routes are guarded by a Host/Origin check (`request-guard.ts`) against DNS rebinding and cross-origin POSTs; non-localhost requests get 403.

- `GET /api/memos` — all memos, newest first
- `POST /api/memos` — multipart: `body`, `createdAt?`, `tag?`, `comment?`, `quote?`, `isDraft?`, `hideLinkCard?`, `images` (≤4, JPG/PNG)
- `GET /api/images/:dirName/:file` — serve memo images for the feed
- `GET /api/status` — uncommitted change count in memo-content
- `POST /api/sync` — git add/commit/push of memo-content (same message format as memo-content's sync.ts). With JSON body `{"deploy": true}` (the header's Deploy checkbox, off by default) it also triggers `sync-submodule.yml` via `gh workflow run` so the pushed content deploys

## Constraints

- Writes must follow memo conventions: dir `YYYYMMDD_HHMMSS`, ULID lowercased and derived from `createdAt`, images numbered `01.jpg`…; body ≤500 chars counted like remark-word-limit (rendered text, not raw markdown)
- `memo-store.ts` stays Bun-free so CI (Node + vitest) can test it; Bun APIs live in `server.ts` only
- EXIF stripping is handled by memo-content's lefthook pre-commit hook, not here
