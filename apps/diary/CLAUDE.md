# CLAUDE.md

Photo diary site (diary.kkhys.me). Astro 6 static site on Cloudflare Pages. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css OKLCH palette). Light theme only. Path alias: `#/*` → `./src/*`.

## Project Map

- `src/pages/` — Astro pages
- `src/layouts/` — Layout components (SEO/OGP meta tags in base-layout)
- `src/components/` — Reusable components
- `src/styles/` — Global CSS (light theme only)
- `public/` — Static assets (images, robots.txt)
- `diary-content/` — Submodule with diary photos (not checked out in CI)

## How to Work

- Dev tools managed by Nix Flake (`flake.nix`). Run `direnv allow` to autoload.
- All commands: see `scripts` in `package.json`
- CI: lint → type check → build. Add `skip-ci` label to PRs to skip.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
