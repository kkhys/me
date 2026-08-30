# Memo

Short memos (max 500 characters, counted on rendered text) in a threaded
social media layout, part of the [kkhys monorepo](../../README.md).

**Live Site**: [memo.kkhys.me](https://memo.kkhys.me)

## Features

- Short memo posts with threaded replies and quotes
- Up to 4 images per post (JPG/PNG) with alt text
- Full-text search over posts (Pagefind)
- Per-author feed at `/@slug`, with pinned posts (`isPinned`) shown first
- Replies collapsed to a count in feeds per post (`hideComments`)
- Bot feeds: blog RSS, Zenn RSS, and OSS projects injected as entries
- Public JSON per post at `/api/posts/<id>.json` (CORS opened to `https://kkhys.me`, consumed by the blog)
- Light/dark mode via `light-dark()`
- Fully static build with infinite scroll over pre-built pages

## Tech Stack

Astro 7 static site, TypeScript (strictest), vanilla CSS (kiso.css +
uchu.css via `@kkhys/styles`), Vitest, oxlint + oxfmt. Shared monorepo
packages: `@kkhys/ui` (components), `@kkhys/seo`, `@kkhys/og` (OG image +
favicons), `@kkhys/search` (Pagefind dialog), `@kkhys/analytics` (Umami),
`@kkhys/styles`. Deployed to Cloudflare Pages by GitHub Actions
(`.github/workflows/deploy-memo.yml`) on pushes to main.

## Content

Each memo is a directory in the private `memo-content/` submodule
(`memo/<YYYYMMDD_HHMMSS>/index.md` + numbered images). Frontmatter:
`id` (lowercase ULID), `createdAt`, optional `tag`, `comment` (parent
ULID), `quote`, `images` (`{ file, alt }[]` — `file` matches
`/^\d{2}\.(jpg|png)$/`, `alt` is the image's alt text), `isDraft`,
`hideLinkCard`, `isPinned`, `hideComments`, `isBot`, and `author` (user
slug).

Memos are composed locally with [`@kkhys/studio`](../studio). Without the
submodule, set `USE_FIXTURE_DATA=true` to build against
`src/__fixtures__/` (CI does this automatically).

## Development

Dev tools come from the Nix Flake at the repo root — run `direnv allow`
once. Then, from the repo root:

```bash
pnpm dev:memo                       # dev server
pnpm --filter @kkhys/memo test      # unit tests
pnpm --filter @kkhys/memo check     # astro check + tsc
pnpm --filter @kkhys/memo build     # static build
```

See [CLAUDE.md](./CLAUDE.md) for the codebase map and conventions.
