# CLAUDE.md

## Project Overview

LGTM is an Astro-based static site that generates "LGTM" images for GitHub Pull Requests. Satori renders text as SVG, Sharp composites it onto source images, and the result is served as static files at multiple sizes. Output format is determined per entry: still sources produce AVIF only, animated sources produce animated WebP only.

Live: https://lgtm.kkhys.me

## Codebase Map

```
src/
  components/lgtm-image.tsx       # Core image generation pipeline (Satori + Sharp). Exports formatForEntry helper
  content.config.ts               # Content Collections: lgtm, privacy, copyright. lgtm schema = { image, animated }
  loaders/lgtm-dir-loader.ts      # Custom Astro loader: one entry per ULID dir, image = first media file (ascending). Probes animation status via sharp
  config/constants.ts             # Shared constants (TITLE, IMAGES_PER_PAGE)
  layouts/layout.astro            # Base layout (Header, Main, Footer)
  assets/BBHBartle-Regular.ttf    # Custom font for LGTM text overlay
  pages/
    [...page].astro               # Gallery with pagination + infinite scroll
    [id].astro                    # Detail page with format selector
    [id].[format].ts              # Image API (800px default)
    [id]-[size].[format].ts       # Sized image API (400/1000/1200px)
    api/ids.json.ts               # JSON listing of all image IDs
    api/og/                       # Open Graph image generation
    api/favicon/                  # Dynamic favicon generation
    copyright.astro               # Legal pages (en/ja)
    privacy.astro
  __tests__/                      # Vitest unit tests
  __fixtures__/lgtm-sample/       # CI test fixtures (used when GITHUB_ACTIONS=true)
lgtm-content/                     # Git submodule (private) - source images
  lgtm/{ulid}/
    {image}.jpg                   # One media file per ULID dir (jpg/png/webp/gif/avif). First file ascending wins.
scripts/release.ts                # Date-based release versioning (YYYY.MM.DD[-N])
```

## Key Design Decisions

- Content loading switches by environment: `lgtm-content/` locally, `src/__fixtures__/lgtm-sample/` when `GITHUB_ACTIONS=true`
- All images are pre-rendered at build time. Infinite scroll fetches pre-built static HTML pages
- Text is rendered at 2x resolution via Satori, then downscaled with lanczos3 for anti-aliasing
- Output format is fixed per entry: still → AVIF, animated → animated WebP. Only one format URL exists per ID
- `/{id}.{format}` serves 800px images (not 400px — the `LgtmImage` function default of 400 is overridden by the API endpoint)
- Versioning is date-based (`YYYY.MM.DD[-N]`), not semver
- Deployment is local: build then `wrangler pages deploy dist` to Cloudflare Pages
- pnpm workspace at root, lgtm-content uses Bun for its scripts
- Path alias `#/*` → `./src/*`

## Environment Variables

Both are declared in `astro.config.ts` env schema:

- `GITHUB_ACTIONS` (boolean, optional, default: false) — triggers fixture mode in CI
- `NODE_ENV` (enum: development | production) — auto-set

## Gotchas

1. `lgtm-content/` is a private Git submodule — must be initialized before local builds or deploy
2. `BBHBartle-Regular.ttf` must exist in `src/assets/`
3. Biome overrides disable `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports` for `*.astro` files — these lint "errors" are expected
4. ULIDs must be lowercase
5. Non-first gallery pages (`/2`, `/3`, ...) redirect to `/` when accessed directly — they exist only for infinite scroll fetch
6. Branch coverage 80% in lgtm-image.tsx is expected (environment switching + nullish coalescing fallbacks)
7. The animated flag is computed once by the loader (`sharp.metadata().pages > 1`) and persisted in the collection entry — downstream code should rely on `entry.data.animated`, not re-probe the source
