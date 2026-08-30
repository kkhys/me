# CLAUDE.md

pnpm monorepo for kkhys's personal sites: eight apps (seven Astro static sites deployed on Cloudflare Pages, plus studio, which is local-only) and shared packages. TypeScript strictest mode throughout. Dev tools are managed by a Nix Flake (`flake.nix`) — run `direnv allow` to autoload Node.js, pnpm, and Bun.

## Workspace

Apps:

- `apps/me` — `@kkhys/me`, the blog at kkhys.me. See `apps/me/CLAUDE.md`.
- `apps/memo` — `@kkhys/memo`, short threaded memos at memo.kkhys.me. See `apps/memo/CLAUDE.md`.
- `apps/lgtm` — `@kkhys/lgtm`, LGTM images for GitHub PRs at lgtm.kkhys.me. See `apps/lgtm/CLAUDE.md`.
- `apps/diary` — `@kkhys/diary`, photo diary at diary.kkhys.me. See `apps/diary/CLAUDE.md`.
- `apps/trends` — `@kkhys/trends`, daily tech trend digest at trends.kkhys.me. See `apps/trends/CLAUDE.md`.
- `apps/design` — `@kkhys/design`, design system docs at design.kkhys.me. See `apps/design/CLAUDE.md`.
- `apps/art` — `@kkhys/art`, artwork and fashion design gallery at art.kkhys.me. See `apps/art/CLAUDE.md`.
- `apps/studio` — `@kkhys/studio`, local-only memo composer (never deployed). See `apps/studio/CLAUDE.md`.

Packages:

- `packages/styles` — `@kkhys/styles`, uchu.css OKLCH palette + shared semantic tokens (`tokens.css`), base styles (`base.css`), component classes (`components.css`: `.btn` and its modifiers), and Satori hex mirrors (`colors`).
- `packages/seo` — `@kkhys/seo`, BaseSEO / OpenGraph / TwitterCard Astro primitives.
- `packages/og` — `@kkhys/og`, Satori OG image + favicon generators.
- `packages/ui` — `@kkhys/ui`, shared Astro components: site header / footer chrome, head meta, skip link, blur-up images, link card, infinite scroll + paginated guard, TOC scrollspy, link-metadata fetcher, Lucide icons, and the BudouX wrapper + cached parser.
- `packages/analytics` — `@kkhys/analytics`, self-hosted Umami tracker component.
- `packages/search` — `@kkhys/search`, the Pagefind search dialog shell, setup script, runner, and helpers shared by me, memo, and design.
- `packages/release` — `@kkhys/release`, date-based release tagging used by `scripts/release.ts`.

Shared packages are consumed as source (no build step); each app supplies its own config via thin wrappers. Dependency versions are centralized in the `catalog:` of `pnpm-workspace.yaml`.

## Commands

Run from the repo root:

- `pnpm build` / `pnpm test` / `pnpm check` — workspace-wide via `pnpm -r`
- `pnpm lint` / `pnpm lint:fix` — oxlint + oxfmt over the whole repo
- `pnpm dev:me` / `pnpm build:me` / `pnpm deploy:me` — me shortcuts (`:lgtm` / `:diary` / `:trends` / `:design` / `:art` variants too)
- `pnpm --filter @kkhys/memo <script>` — target a single app
- `pnpm release` — tag a repo-wide release (the apps ship independently; one tag for the repo)

## CI / Deploy

- `.github/workflows/ci.yml` — runs on PRs and the merge queue. Lint → test → type check → build across the workspace against fixtures (all apps read `USE_FIXTURE_DATA`); content submodules are skipped. The `skip-ci` label opts out.
- `.github/workflows/deploy-memo.yml` — on push to main touching `apps/memo/**` or `packages/**`, re-runs memo's checks then deploys to Cloudflare Pages.
- me, lgtm, diary, trends, design, and art are built and deployed locally (`pnpm deploy:me` / `pnpm deploy:lgtm` / `pnpm deploy:diary` / `pnpm deploy:trends` / `pnpm deploy:design` / `pnpm deploy:art`), not from CI. trends is normally published end-to-end by the `creating-trend-digest` skill (data commit → deploy → push).

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- Per-app specifics (content schemas, blog/memo conventions) live in each app's `CLAUDE.md` — read those first when working inside an app.
- UI changes (`.astro` / `.css` / `.tsx` under `apps/*/src`, `packages/ui`, `packages/styles`) follow the design system in `apps/design` (design.kkhys.me). `.claude/rules/design-system.md` loads for those files and names the sources to read — consult it first when a task is UI work, even before opening a file.
