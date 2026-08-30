# CLAUDE.md

Personal blog (kkhys.me), the `@kkhys/me` app of the kkhys monorepo. Astro 7 static site on Cloudflare Pages. TypeScript strictest mode. Vanilla CSS (kiso.css reset + uchu.css OKLCH palette via `@kkhys/styles`). React is server-side only (Satori OG images via `@kkhys/og`). Path alias: `#/*` → `./src/*`.

## Project Map

- `src/features/` — Self-contained feature modules (blog, pages, search)
- `src/lib/` — remark/rehype plugins, API wrappers (`api/`), utilities
- `src/utils/` — Pure helpers (date, hash, font-loader, base-url, extract-description)
- `src/styles/` — Global CSS with light-dark() theme switching
- `src/__tests__/` — Vitest unit tests mirroring source structure
- `me-content/` — Blog MDX and bucket-list YAML (Git submodule)

## Shared Packages

Consumed as source (no build step); this app supplies its own config via thin wrappers.

- `@kkhys/styles` — uchu.css OKLCH palette + shared semantic tokens / base styles; me keeps only prose- and code-specific tokens local
- `@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard primitives, wrapped in `src/components/seo/`
- `@kkhys/og` — Satori OG image + favicon generators, wired in `src/pages/api/`
- `@kkhys/ui` — shared Astro components and the helpers behind them; me uses the cached BudouX parser (`src/lib/rehype-budoux.ts`, OG image titles)

## Content System

4 collections in `src/content.config.ts`: blog (MDX in `me-content/blog/`), pages (MDX), bucketList (YAML in `me-content/`), externalPost (YAML). Blog frontmatter requires `title`, `emoji`, `category`, `publishedAt`. Slugs are Bech32m hashed (7 chars) via `src/utils/hash.ts`.

4 categories (Tech, Life, Object, DIY) in `src/features/blog/config/category.ts`. Tags scoped per category in `src/features/blog/config/tag.ts`, validated via `z.enum`.

## How to Work

- Dev tools are managed by the Nix Flake at the repo root (`flake.nix`). Run `direnv allow` once.
- Run scripts from this directory, or from the repo root via `pnpm --filter @kkhys/me <script>`.
- CI: lint → test → type check → build, against fixtures. Add the `skip-ci` label to PRs to skip.
- Deploy: built and shipped locally via `pnpm deploy`; me is not deployed from CI.
- Lint/format: runs automatically via Stop hook (oxlint + oxfmt auto-fix). Fix remaining errors before completing.
- Search: `astro-pagefind` indexes `dist` after `astro build`; only elements marked `data-pagefind-body` (blog post title + body in `src/layouts/blog-layout.astro`) are indexed. The dev server serves `/pagefind/` from `dist`, so run `pnpm build` once before `pnpm dev` to try search locally. The dialog lives in `src/features/search/` as a thin wrapper over `@kkhys/search` (shell, runner, keyboard handling); only the category filter, the result-row template, and the Pagefind meta keys are app-local. No CSP is configured today; adding one needs `script-src` for the dynamic `import()` of `/pagefind/pagefind.js`, `wasm-unsafe-eval` for the Pagefind WASM, and `connect-src 'self'` for fragment fetches.

## Key Context Files

Read these when your task involves their domain:

- `astro.config.ts` — Markdown plugins, integrations (incl. Pagefind), env schema, experimental features
- `src/content.config.ts` — Collection schemas and validation rules
- `src/features/blog/config/` — Category and tag definitions
- `../../.oxlintrc.json` / `../../.oxfmtrc.json` — Linter / formatter configuration (shared across the monorepo)

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- Type placement: inline `interface Props` in `.astro`; co-locate in `.ts`; extract to `types.ts` at 3+ consumers; `as const satisfies` for config
