# CLAUDE.md

Photo diary site (diary.kkhys.me), the `@kkhys/diary` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. A single gallery page renders photos from the `diary-content` submodule with responsive AVIF/WebP variants, blur-up placeholders, and a photo-derived OG image. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). Light theme only. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro           # The gallery: globs diary-content photos, builds entries + OG image
  pages/api/favicon/          # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro   # HTML shell: HeadMeta, @kkhys/seo primitives, Umami, BlurLoadNoscript
  components/diary-image.astro # Thin wrapper: entry frame + date/number meta around @kkhys/ui BlurImage
  utils/entries.ts            # buildEntries: glob paths → dated, numbered entries (newest first)
  styles/global.css           # Imports @kkhys/styles (uchu + tokens + base) + app-local base styles
  __tests__/                  # Vitest unit tests
astro.config.ts               # site, @astrojs/sitemap, image service switch (see below)
public/                       # robots.txt + the favicon set and manifest.webmanifest that HeadMeta links
diary-content/                # Git submodule (private) — photos at diary/<YYYY-MM-DD>/<n>.jpg, not checked out in CI
```

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css palette + shared `tokens.css` / `base.css`, imported in `src/styles/global.css`. Tokens resolve to their light values (no dark scheme opt-in).
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro`. diary's OG image is the newest photo (variable-height JPEG), passed via the `imageType`/`imageWidth`/`imageHeight` props; `twitter:card` switches to "summary" when no photo exists.
- `@kkhys/ui` — `BlurImage` in `components/diary-image.astro` (the `<Picture>` with AVIF/WebP variants and the 20px blurred placeholder live in `packages/ui/src/blur-image.astro`; diary only passes `widths` / `sizes` / `priority`), plus `BlurLoadNoscript` and `HeadMeta` (`colorScheme="light"`; links the favicon set, manifest, and the sitemap that `@astrojs/sitemap` emits) in `base-layout.astro`.
- `@kkhys/analytics` — the Umami tracker in `base-layout.astro`.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the grayscale gradient). Static icons in `public/` are generated from those routes. The OG image stays app-local (a photo, not a Satori card).

## Key Design Decisions

- Photos load via `import.meta.glob("../../diary-content/diary/**/*.jpg", { eager: true })`; entries sort by date then file number, newest first.
- CI builds with the submodule absent → an empty gallery. The image service switches to `astro/assets/services/noop` when `USE_FIXTURE_DATA` is set; locally it uses sharp.
- The first (newest) entry is eager / high-priority and supplies the OG image; the rest lazy-load with a blurred placeholder.

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/diary <script>` (or `pnpm dev:diary` / `build:diary` / `deploy:diary`).
- CI: lint → test → type check → build across the workspace. Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:diary`; diary is not deployed from CI. Initialize `diary-content` first.
- Release: repo-wide from the root (`pnpm release`); diary has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `diary-content/` is a private Git submodule — initialize it before local builds or deploy
