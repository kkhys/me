# CLAUDE.md

LGTM image generator (lgtm.kkhys.me), the `@kkhys/lgtm` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Satori renders "LGTM" text as SVG, Sharp composites it onto source images, served as static files at multiple sizes. Output format is per entry: still sources → AVIF only, animated sources → animated WebP only. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). React is server-side only (Satori). Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  components/lgtm-image.tsx       # Core image pipeline (Satori + Sharp). Exports formatForEntry + LgtmImage
  content.config.ts               # Collections: lgtm, privacy, copyright. lgtm schema = { image, animated }
  loaders/lgtm-dir-loader.ts      # Custom loader: one entry per ULID dir, image = first media file. Probes animation via sharp
  config/constants.ts             # TITLE, TWITTER_ACCOUNT_NAME, IMAGES_PER_PAGE
  layouts/layout.astro            # Base layout (Header, Main, Footer)
  assets/BBHBartle-Regular.ttf    # Font for the LGTM text overlay
  components/seo/                 # SEO adapters + OG card + favicon (see Shared Packages)
  pages/
    [...page].astro               # Gallery with pagination + infinite scroll
    [id].astro                    # Detail page with format selector
    [id].[format].ts              # Image API (800px default)
    [id]-[size].[format].ts       # Sized image API (400/1000/1200px)
    api/ids.json.ts               # JSON listing of all image IDs
    api/og/                       # OG images: default.png (shared handler) + [id].png (per-image, app-local)
    api/favicon/                  # Dev-only favicon endpoints (404 in prod)
  __tests__/                      # Vitest unit tests
  __fixtures__/lgtm-sample/       # CI fixtures (used when GITHUB_ACTIONS=true)
lgtm-content/                     # Git submodule (private) — source images, one media file per ULID dir
scripts/convert-videos.ts         # Bun + ffmpeg: convert .mov sources to animated WebP
```

## Shared Packages

Consumed as source (no build step); this app supplies its own config via thin wrappers.

- `@kkhys/styles` — uchu.css OKLCH palette, imported in `src/styles/global.css`. The `--c-*` semantic tokens and the `prefers-color-scheme` dark mode stay app-local.
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard primitives, wrapped by thin adapters in `src/components/seo/`. `head-meta.astro` and `json-ld.astro` are app-local.
- `@kkhys/og` — favicon generators (`src/components/seo/favicon/index.ts`, bound to the green gradient) + route handlers. The default OG card (`opengraph-image.tsx`) and the per-id OG (`pages/api/og/[id].png.ts`) stay app-local (bespoke layouts).

## Key Design Decisions

- Content loading switches by env: `lgtm-content/` locally, `src/__fixtures__/lgtm-sample/` when `GITHUB_ACTIONS=true` (read from `astro:env/client`)
- All images are pre-rendered at build time. Infinite scroll fetches pre-built static HTML pages
- Text is rendered at 2x via Satori, then downscaled with lanczos3 for anti-aliasing
- Output format is fixed per entry: still → AVIF, animated → animated WebP. One format URL per ID
- `/{id}.{format}` serves 800px images (the `LgtmImage` default of 400 is overridden by the endpoint)
- The animated flag is computed once by the loader (`sharp.metadata().pages > 1`) and persisted; rely on `entry.data.animated`, not a re-probe

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`, includes ffmpeg). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/lgtm <script>` (or `pnpm dev:lgtm` / `build:lgtm` / `deploy:lgtm`).
- CI: lint → test → type check → build against fixtures (auto via `GITHUB_ACTIONS`). Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:lgtm`; lgtm is not deployed from CI. The `lgtm-content` submodule must be initialized first.
- Release: repo-wide from the root (`pnpm release`); lgtm has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `lgtm-content/` is a private Git submodule — initialize it before local builds or deploy
- `BBHBartle-Regular.ttf` must exist in `src/assets/`
- ULIDs must be lowercase
- Non-first gallery pages (`/2`, `/3`, …) redirect to `/` when accessed directly — they exist only for the infinite-scroll fetch
- Favicon endpoints (`api/favicon/*`) are dev-only (404 in production); production serves favicons as static assets
