# CLAUDE.md

Artwork gallery (art.kkhys.me), the `@kkhys/art` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. A single page renders two collections from the `art-content` submodule — titled works (landscape images, one per row with a title/year caption) and fashion design series (portrait illustrations in a two-column grid) — with responsive AVIF/WebP variants, blur-up placeholders, and a work-derived OG image. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). Light theme only. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro               # The gallery: collections + globbed images → sections, OG image
  pages/api/favicon/              # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro       # HTML shell wired to the @kkhys/seo primitives
  components/art-picture.astro    # <Picture> with AVIF/WebP variants + blur-up placeholder
  components/work-figure.astro    # One work: picture + title/year caption
  components/fashion-series.astro # One series: heading + two-column grid
  content.config.ts               # `works` / `fashion` collections (file loader over YAML)
  config/content-path.ts          # USE_FIXTURE_DATA switch between art-content and __fixtures__
  utils/works.ts                  # buildWorks: captions + images → ordered works
  utils/fashion.ts                # buildFashionSeries: captions + images → ordered series
  utils/caption.ts                # Shared caption type + ContentMismatchError
  __fixtures__/                   # Sample YAML + tiny JPEGs for CI builds
  __tests__/                      # Vitest unit tests
art-content/                      # Git submodule (private) — see its README for layout and `pnpm ingest`
```

## Content Model

- `art-content/works/works.yaml` — array of `{ slug, title, year }`; the image is `works/<slug>.jpg`. YAML order is display order.
- `art-content/fashion/fashion.yaml` — array of `{ slug, title, year }` per series; images are `fashion/<slug>/NN.jpg`, shown in numeric order. YAML order is display order.
- `buildWorks` / `buildFashionSeries` throw `ContentMismatchError` when a caption has no image or an image has no caption, so authoring mistakes fail the local build instead of silently dropping a work.
- Images are pre-sized by `art-content`'s `pnpm ingest` (2400px long edge, sRGB, metadata stripped). Sources are often Adobe RGB; Astro's sharp service discards metadata, so the sRGB conversion has to happen before commit.

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css`, imported in `src/styles/global.css`. Tokens resolve to their light values (no dark scheme opt-in).
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro`. The OG image is the first work (variable-height JPEG), passed via the `imageType`/`imageWidth`/`imageHeight` props; `twitter:card` switches to "summary" when no work exists.
- `@kkhys/ui` — `blurLoadHandlers` (inline load/error reveal) and `BlurLoadNoscript`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the red→indigo gradient). Static icons in `public/` are generated from those routes.

## Key Design Decisions

- Captions come from content collections (`file()` loader), images from `import.meta.glob`; both switch to `src/__fixtures__` under `USE_FIXTURE_DATA`, and the image service switches to `astro/assets/services/noop`. Glob patterns must be literals, so `index.astro` declares both trees and picks one.
- The first work is eager / high-priority and supplies the OG image; everything else lazy-loads behind a blurred placeholder.
- Fashion images render at 704 CSS px max (half of the 1440px main column minus the gap), so their `widths` stop at 1440.

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/art <script>` (or `pnpm dev:art` / `build:art` / `deploy:art`).
- CI: lint → test → type check → build across the workspace against fixtures. Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:art`; art is not deployed from CI. Initialize `art-content` first.
- Release: repo-wide from the root (`pnpm release`); art has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `art-content/` is a private Git submodule — initialize it before local builds or deploy. It is excluded from this app's `tsconfig` (its `ingest.ts` targets Bun) and from oxlint/oxfmt via the `**/*-content/**` ignore pattern.
