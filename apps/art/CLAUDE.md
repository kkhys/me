# CLAUDE.md

Artwork gallery (art.kkhys.me), the `@kkhys/art` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. The index shows two collections from the `art-content` submodule as thumbnail grids — titled works (landscape) and fashion design series (portrait sheets) — and each image has its own detail page. Thumbnails morph into the detail image through CSS-only cross-document view transitions; no client JavaScript. Responsive AVIF/WebP variants, blur-up placeholders, and per-page OG images derived from the work. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). Light theme only. Path alias: `#/*` → `./src/*`; `#gallery-images` → one of the two image trees (see below).

## Project Map

```
src/
  pages/index.astro                     # Thumbnail grids for both collections, OG image from the first work
  pages/works/[slug].astro              # Work detail page (getStaticPaths over loadWorks)
  pages/fashion/[series]/[number].astro # Sheet detail page (getStaticPaths over the flattened sheets)
  pages/api/favicon/                    # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro             # HTML shell: @kkhys/seo primitives, Umami, render-blocking <link rel="expect">
  lib/gallery.ts                        # loadWorks / loadFashionSeries: collections + globbed images
  lib/images/                           # art-content.ts / fixtures.ts: the two globbed image trees
  lib/og-image.ts                       # buildOgImage: 1200px JPEG of a work + its aspect-correct height
  loaders/caption-file.ts               # parseCaptionYaml (order, duplicate slugs) + readCaptionFile (up-front check)
  components/art-picture.astro          # <Picture> with AVIF/WebP variants, blur-up, view-transition-name
  components/gallery-thumb.astro        # Index grid item: linked picture + caption
  components/work-figure.astro          # Work detail: picture + title/year caption
  components/fashion-figure.astro       # Sheet detail: viewport-height picture + series/number caption
  components/site-header.astro          # Site title + section links (h1 on the index)
  components/pager.astro                # prev / back / next links on detail pages
  content.config.ts                     # `works` / `fashion` collections (file loader over YAML)
  config/content-path.ts                # USE_FIXTURE_DATA switch between art-content and __fixtures__
  utils/caption.ts                      # Caption schema/types, sortByOrder, pairCaptionsWithImages, ContentMismatchError
  utils/works.ts                        # buildWorks: captions + images → ordered works
  utils/fashion.ts                      # buildFashionSeries + flattenFashionSheets
  utils/sheet-number.ts                 # parseSheetNumber / padNumber: the NN.jpg convention
  utils/routes.ts                       # Detail paths and view-transition-name helpers
  __fixtures__/                         # Sample YAML + tiny JPEGs for CI builds
  __tests__/                            # Vitest unit tests
art-content/                            # Git submodule (private) — see its README for layout and `pnpm ingest`
```

## Content Model

- `art-content/works/works.yaml` — array of `{ slug, title, year }`; the image is `works/<slug>.jpg`. YAML order is display order: the `file()` loader's parser records each item's position as `order` because the data store returns entries sorted by id, and `sortByOrder` restores it (and drops `order`) on load.
- `art-content/fashion/fashion.yaml` — array of `{ slug, title, year }` per series; images are `fashion/<slug>/NN.jpg`, shown in numeric order. YAML order is display order.
- Routes: `/works/<slug>` and `/fashion/<series>/<NN>`. prev/next on fashion pages run through every sheet in order, crossing series boundaries.
- Authoring mistakes fail the build instead of silently dropping a work: `buildWorks` / `buildFashionSeries` throw `ContentMismatchError` for a caption without an image, an image without a caption, or a file in a series directory that is not `NN.jpg`; two files that resolve to the same sheet number (`1.jpg` and `01.jpg`) throw too. The caption files are read and validated once at content-config load (`readCaptionFile`) because Astro's `file()` loader swallows parser errors into an empty collection — that check is what rejects a non-array, an empty file, a duplicate slug, or a missing file (uninitialised submodule) with a message that names the cause.
- Images are pre-sized by `art-content`'s `pnpm ingest` (2400px long edge, sRGB, metadata stripped). Sources are often Adobe RGB; because ingest strips metadata, which would take the embedded profile with it, it converts to sRGB first and re-embeds the sRGB profile. Astro's sharp service honours an embedded profile but cannot recover a stripped one.

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css`, imported in `src/styles/global.css`. Tokens resolve to their light values (no dark scheme opt-in).
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro`. The OG image is the page's work (the first work on the index), a variable-height JPEG built by `lib/og-image.ts` and passed via the `imageType`/`imageWidth`/`imageHeight` props; `twitter:card` switches to "summary" when no work exists.
- `@kkhys/analytics` — the Umami tracker in `base-layout.astro` (production only).
- `@kkhys/ui` — `blurLoadHandlers` (inline load/error reveal) and `BlurLoadNoscript`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the pink→red→indigo gradient). Static icons in `public/` are generated from those routes.

## Key Design Decisions

- Captions come from content collections (`file()` loader), images from `import.meta.glob`; both switch to `src/__fixtures__` under `USE_FIXTURE_DATA`, and the image service switches to `astro/assets/services/noop`. Glob patterns must be literals and an `eager` glob is bundled even from a dead branch, so each image tree is its own module under `lib/images/` and the `#gallery-images` Vite alias in `astro.config.ts` picks one (tsconfig maps it to the art-content module for type checking; vitest maps it to the fixtures).
- View transitions are the cross-document kind: `@view-transition { navigation: auto }` inlined in `base-layout.astro`'s head (off under `prefers-reduced-motion: reduce`), a `view-transition-name` per image shared by thumbnail and detail (`utils/routes.ts`), and `<link rel="expect" href="#main" blocking="render">` so the morph target is parsed before the new page is snapshotted. The opt-in must be inline: with it only in the bundled stylesheet, Chromium ran fresh forward navigations without a transition (back/forward from cache still worked). Browsers without cross-document support (Firefox, as of 2026-08) just navigate. Speculation-rules prerendering was tried and removed: with it present Chromium skipped every transition.
- The first three works on the index and every detail image are eager / high-priority; everything else lazy-loads behind a blurred placeholder.
- Fashion detail images are sized by viewport height: `block-size: min(85dvh, 1500px, calc((100vw - 5rem) * 1.25))`, a definite size so the box exists before the image decodes. The second and third terms keep a 4:5 sheet inside its column without container units (the wrapper is a flex item, and inline-size containment would collapse it). `sizes` mirrors that as `68vh`, the width of a 4:5 sheet at 85vh.
- Detail images have `alt=""`: the figcaption already carries the title, and an alt would be read twice.

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/art <script>` (or `pnpm dev:art` / `build:art` / `deploy:art`).
- CI: lint → test → type check → build across the workspace against fixtures. Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:art`; art is not deployed from CI. Initialize `art-content` first — without it (and without `USE_FIXTURE_DATA`) the build fails at content-config load.
- Release: repo-wide from the root (`pnpm release`); art has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `art-content/` is a private Git submodule — initialize it before local builds or deploy. It is excluded from this app's `tsconfig` (its `ingest.ts` targets Bun) and from oxlint/oxfmt via the `**/*-content/**` ignore pattern.
- oxlint's `no-map-spread` rejects `{ ...x }` inside `.map` callbacks; that is why the caption parser uses `Object.assign` and `pairCaptionsWithImages` takes a combine callback instead of returning pairs.
