# CLAUDE.md

Photo diary site (diary.kkhys.me), the `@kkhys/diary` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. A single gallery page renders photos from the `diary-content` submodule with responsive AVIF/WebP variants, blur-up placeholders, and a photo-derived OG image. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). Light theme only. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro           # The gallery: globs diary-content photos, builds entries + OG image
  pages/api/favicon/          # Dev-only favicon endpoints via @kkhys/og (omitted from prod builds)
  layouts/base-layout.astro   # HTML shell wired to the @kkhys/seo primitives
  components/diary-image.astro # <Picture> with AVIF/WebP variants + blur-up placeholder
  utils/entries.ts            # buildEntries: glob paths → dated, numbered entries (newest first)
  styles/global.css           # Design tokens (--c-*, --ff-mono) + base styles; palette from @kkhys/styles
  __tests__/                  # Vitest unit tests
public/robots.txt
diary-content/                # Git submodule (private) — photos at diary/<YYYY-MM-DD>/<n>.jpg, not checked out in CI
```

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css OKLCH palette, imported in `src/styles/global.css`. The `--c-*` semantic tokens stay app-local.
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard in `base-layout.astro`. diary's OG image is the newest photo (variable-height JPEG), passed via the `imageType`/`imageWidth`/`imageHeight` props; `twitter:card` switches to "summary" when no photo exists.
- `@kkhys/og` — favicon routes (`src/pages/api/favicon/[file].ts`, bound to the grayscale gradient). The OG image stays app-local (a photo, not a Satori card).

## Key Design Decisions

- Photos load via `import.meta.glob("../../diary-content/diary/**/*.jpg", { eager: true })`; entries sort by date then file number, newest first.
- CI builds with the submodule absent → an empty gallery. The image service switches to `astro/assets/services/noop` when `GITHUB_ACTIONS` is set; locally it uses sharp.
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
