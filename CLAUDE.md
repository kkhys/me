# CLAUDE.md

pnpm monorepo for kkhys's personal sites: four Astro static sites on Cloudflare Pages plus shared packages. TypeScript strictest mode throughout. Dev tools are managed by a Nix Flake (`flake.nix`) — run `direnv allow` to autoload Node.js, pnpm, and Bun.

## Workspace

Apps:

- `apps/me` — `@kkhys/me`, the blog at kkhys.me. See `apps/me/CLAUDE.md`.
- `apps/memo` — `@kkhys/memo`, short threaded memos at memo.kkhys.me. See `apps/memo/CLAUDE.md`.
- `apps/lgtm` — `@kkhys/lgtm`, LGTM images for GitHub PRs at lgtm.kkhys.me. See `apps/lgtm/CLAUDE.md`.
- `apps/diary` — `@kkhys/diary`, photo diary at diary.kkhys.me. See `apps/diary/CLAUDE.md`.

Packages:

- `packages/styles` — `@kkhys/styles`, uchu.css OKLCH palette.
- `packages/seo` — `@kkhys/seo`, BaseSEO / OpenGraph / TwitterCard Astro primitives.
- `packages/og` — `@kkhys/og`, Satori OG image + favicon generators.
- `packages/release` — `@kkhys/release`, date-based release tagging used by `scripts/release.ts`.

Shared packages are consumed as source (no build step); each app supplies its own config via thin wrappers. Dependency versions are centralized in the `catalog:` of `pnpm-workspace.yaml`.

## Commands

Run from the repo root:

- `pnpm build` / `pnpm test` / `pnpm check` — workspace-wide via `pnpm -r`
- `pnpm lint` / `pnpm lint:fix` — oxlint + oxfmt over the whole repo
- `pnpm dev:me` / `pnpm build:me` / `pnpm deploy:me` — me shortcuts (`:lgtm` / `:diary` variants too)
- `pnpm --filter @kkhys/memo <script>` — target a single app
- `pnpm release` — tag a repo-wide release (the apps ship independently; one tag for the repo)

## CI / Deploy

- `.github/workflows/ci.yml` — runs on PRs and the merge queue. Lint → test → type check → build across the workspace against fixtures (me/memo read `CONTENT_DIR` / `USE_FIXTURE_DATA`; lgtm uses the auto-set `GITHUB_ACTIONS`); content submodules are skipped. The `skip-ci` label opts out.
- `.github/workflows/deploy-memo.yml` — on push to main touching `apps/memo/**` or `packages/**`, re-runs memo's checks then deploys to Cloudflare Pages.
- me, lgtm, and diary are built and deployed locally (`pnpm deploy:me` / `pnpm deploy:lgtm` / `pnpm deploy:diary`), not from CI.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- Per-app specifics (content schemas, blog/memo conventions) live in each app's `CLAUDE.md` — read those first when working inside an app.
