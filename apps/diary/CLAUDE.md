# CLAUDE.md

Photo diary site (diary.kkhys.me), the `@kkhys/diary` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. A single gallery page renders photos from the `diary-content` submodule with responsive AVIF/WebP variants, blur-up placeholders, and a photo-derived OG image. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css palette via `@kkhys/styles`). Light theme only. Path alias: `#/*` → `./src/*`.

## Project Map

```
src/
  pages/index.astro           # The gallery: globs diary-content photos, sorts by date, builds entries + OG image
  layouts/base-layout.astro   # HTML shell + inline SEO/OGP meta (bespoke, app-local)
  components/diary-image.astro # <Picture> with AVIF/WebP variants + blur-up placeholder
  styles/global.css           # Design tokens (--c-*, --ff-mono) + base styles; palette from @kkhys/styles
public/robots.txt
diary-content/                # Git submodule (private) — photos at diary/<YYYY-MM-DD>/<n>.jpg, not checked out in CI
```

## Shared Packages

Consumed as source (no build step).

- `@kkhys/styles` — uchu.css OKLCH palette, imported in `src/styles/global.css`. The `--c-*` semantic tokens stay app-local.

SEO and the OG image stay app-local: diary's OG image is the first (newest) photo resized to 1200px wide with a dynamic height (JPEG), and the `<meta>` block in `base-layout.astro` emits `og:image` and switches `twitter:card` only when a photo exists. `@kkhys/seo` (image required, fixed 1200×630 PNG) and `@kkhys/og` (Satori OG cards / favicons) do not fit this app and are not used.

## Key Design Decisions

- Photos load via `import.meta.glob("../../diary-content/diary/**/*.jpg", { eager: true })`; entries sort by date then file number, newest first.
- CI builds with the submodule absent → an empty gallery. The image service switches to `astro/assets/services/noop` when `GITHUB_ACTIONS` is set; locally it uses sharp.
- The first (newest) entry is eager / high-priority and supplies the OG image; the rest lazy-load with a blurred placeholder.

## How to Work

- Dev tools come from the Nix Flake at the repo root (`flake.nix`). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/diary <script>` (or `pnpm dev:diary` / `build:diary` / `deploy:diary`).
- CI: lint → test → type check → build across the workspace. diary has no unit tests, so `pnpm -r test` skips it. Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy:diary`; diary is not deployed from CI. Initialize `diary-content` first.
- Release: repo-wide from the root (`pnpm release`); diary has no separate release.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- `diary-content/` is a private Git submodule — initialize it before local builds or deploy
