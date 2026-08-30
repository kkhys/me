# CLAUDE.md

LGTM image generator (lgtm.kkhys.me), the `@kkhys/lgtm` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. Satori renders "LGTM" text as SVG, Sharp composites it onto source images, served as static files at multiple sizes. Output format is per entry: still sources → AVIF only, animated sources → animated WebP only. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). React is server-side only (Satori). Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  components/lgtm-image.tsx       # Core image pipeline (Satori + Sharp). Exports formatForEntry + LgtmImage
  content.config.ts               # Collections: lgtm, privacy, copyright. lgtm schema = { image, animated, description }
  content/{privacy,copyright}/    # Legal pages as markdown, {en,ja}.md each (title, description, lang, lastUpdated)
  loaders/lgtm-dir-loader.ts      # Custom loader: one entry per ULID dir, image = first media file + description.txt. Probes animation via sharp
  config/constants.ts             # TITLE, TWITTER_ACCOUNT_NAME, IMAGES_PER_PAGE, SITE_URL (canonical origin for embed snippets)
  config/content-path.ts          # resolveLgtmBasePath: lgtm-content vs __fixtures__ (USE_FIXTURE_DATA)
  layouts/layout.astro            # Base layout (HeadMeta, Umami, SkipLink, SiteHeader, main, SiteFooter)
  assets/BBHBartle-Regular.ttf    # Font for the LGTM text overlay
  components/seo/                 # SEO adapters + OG card (see Shared Packages)
  components/legal-layout.astro   # en/ja toggle + prose styles for the legal pages
  components/legal-page.astro     # Renders a privacy/copyright entry with SEO, hreflang alternates, last-updated
  utils/alt.ts                    # lgtmAlt: "LGTM over <description>"
  utils/date.ts                   # formatDate (UTC getters; legal-page lastUpdated)
  utils/embed.ts                  # buildEmbedCode: the <a><img></a> snippet the copy buttons put on the clipboard
  utils/shuffle.ts                # Fisher-Yates for the gallery order
  pages/
    [...page].astro               # Gallery with pagination + infinite scroll; copy button per item
    [id].astro                    # Detail page: the entry's image + "Copy embed code" button (format is fixed per entry, no selector)
    [id].[format].ts              # Image API (800px default)
    [id]-[size].[format].ts       # Sized image API (400/1000/1200px)
    privacy/[...lang].astro       # /privacy (en) and /privacy/ja
    copyright/[...lang].astro     # /copyright (en) and /copyright/ja
    api/ids.json.ts               # JSON listing of all image IDs
    api/og/                       # OG images: default.png (shared handler) + [id].png (per-image, app-local)
    api/favicon/                  # Dev-only favicon endpoints (omitted from prod builds)
  __tests__/                      # Vitest unit tests
  __fixtures__/lgtm-sample/       # CI fixtures (used when USE_FIXTURE_DATA=true)
lgtm-content/                     # Git submodule (private) — one media file + description.txt per ULID dir
scripts/convert-videos.ts         # Bun + ffmpeg: convert .mov sources to animated WebP
```

## Shared Packages

Consumed as source (no build step); this app supplies its own config via thin wrappers.

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css`, imported in `src/styles/global.css`. Dark mode via `light-dark()`. Only lgtm-specific tokens (`--c-bg-gray`, `--c-text-emphasis`) stay app-local.
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard primitives, wrapped by thin adapters in `src/components/seo/`; `JsonLd` comes from `@kkhys/seo/json-ld.astro`.
- `@kkhys/ui` — in `layouts/layout.astro`: `HeadMeta` (charset / viewport / color-scheme / favicon set / sitemap), `SkipLink`, `SiteHeader` / `SiteFooter`, `BlurLoadNoscript`. In `pages/[...page].astro`: `InfiniteScroll` (which brings its own spinner) + `PaginatedGuard`, and `blurLoadHandlers` from `@kkhys/ui/blur-load` on the gallery images (the detail page inlines its own `onload`). Icons (`arrow-left`, `check`, `copy`) come from `@kkhys/ui/icons/*.svg`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the green gradient) + OG route handlers. The default OG card (`opengraph-image.tsx`) and the per-id OG (`pages/api/og/[id].png.ts`) stay app-local (bespoke layouts).
- `@kkhys/analytics` — the Umami tracker in `layouts/layout.astro`.

## Key Design Decisions

- Content loading switches by env: `lgtm-content/` locally, `src/__fixtures__/lgtm-sample/` when `USE_FIXTURE_DATA=true`
- All images are pre-rendered at build time. Infinite scroll fetches pre-built static HTML pages
- Text is rendered at 2x via Satori, then downscaled with lanczos3 for anti-aliasing
- Output format is fixed per entry: still → AVIF, animated → animated WebP. One format URL per ID
- `/{id}.{format}` serves 800px images (the `LgtmImage` default of 400 is overridden by the endpoint)
- The animated flag is computed once by the loader (`sharp.metadata().pages > 1`) and persisted; rely on `entry.data.animated`, not a re-probe
- Every entry dir must hold a one-line `description.txt` saying what the source picture shows; the loader fails the build without it. Pages render the alt through `utils/alt.ts` (`LGTM over <description>`), so the file holds only the description

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`, includes ffmpeg). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/lgtm <script>` (or `pnpm dev:lgtm` / `build:lgtm` / `deploy:lgtm`).
- CI: lint → test → type check → build against fixtures (via `USE_FIXTURE_DATA`). Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:lgtm`; lgtm is not deployed from CI. The `lgtm-content` submodule must be initialized first.
- Release: repo-wide from the root (`pnpm release`); lgtm has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `lgtm-content/` is a private Git submodule — initialize it before local builds or deploy
- `BBHBartle-Regular.ttf` must exist in `src/assets/`
- ULIDs must be lowercase
- A new entry needs both the media file and `description.txt` — the dev server logs the missing file and keeps the previous entries, the build stops. `pnpm lgtm "<description>"` in `lgtm-content/` (`scripts/create-lgtm.ts`) creates the ULID directory with the file written; it refuses to run without the description
- Non-first gallery pages (`/2`, `/3`, …) redirect to `/` when accessed directly — they exist only for the infinite-scroll fetch
- Favicon endpoints (`api/favicon/*`) are dev-only (their `getStaticPaths` emits no paths in prod builds); production serves favicons as static assets
