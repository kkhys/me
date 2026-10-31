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
- `packages/search` — `@kkhys/search`, the Pagefind search dialog shell, setup script, runner, memoised bundle loader, and helpers shared by me, memo, design, and trends.
- `packages/release` — `@kkhys/release`, date-based release tagging used by `scripts/release.ts`.

Shared packages are consumed as source (no build step); each app supplies its own config via thin wrappers. Dependency versions are centralized in the `catalog:` of `pnpm-workspace.yaml`.

## Commands

Run from the repo root:

- `pnpm build` / `pnpm test` / `pnpm check` — workspace-wide via `pnpm -r`
- `pnpm coverage` — the test suite with coverage thresholds enforced; this is what CI runs instead of `pnpm test`
- `pnpm lint` / `pnpm lint:fix` — oxlint + oxfmt over the whole repo
- `pnpm dev:me` / `pnpm build:me` / `pnpm deploy:me` — me shortcuts (`:lgtm` / `:diary` / `:trends` / `:design` / `:art` variants too)
- `pnpm --filter @kkhys/memo <script>` — target a single app
- `pnpm release` — tag a repo-wide release (the apps ship independently; one tag for the repo)

## CI / Deploy

- `.github/workflows/ci.yml` — runs on PRs. Lint → test with coverage thresholds → type check → build across the workspace against fixtures (all apps read `USE_FIXTURE_DATA`); content submodules are skipped. There is no opt-out label: a skipped required check counts as passing.
- CodeQL runs through GitHub's default setup (no workflow file) on every PR and push to main; the `main` ruleset requires its results, so an error-level or high-severity alert blocks the merge.
- `.github/workflows/update-behind-prs.yml` — on every push to main, merges main into each open, auto-merge-armed, non-Renovate PR that fell behind, so its checks re-run against the new main. Needed because the ruleset requires an up-to-date branch and auto-merge never updates a branch itself. Uses `SUBMODULE_TOKEN`, since a branch updated with `GITHUB_TOKEN` triggers no workflows.
- `.github/workflows/deploy-memo.yml` — on push to main touching `apps/memo/**` or `packages/**`, re-runs memo's checks then deploys to Cloudflare Pages.
- `.github/workflows/verify-lockfile.yml` — runs `gh actions-lock --verify` on PRs and weekly. Every `uses:` is a version tag; the commit it resolves to is pinned in `.github/workflows/actions.lock`, which is machine-generated (never edit by hand). After adding a workflow or changing any `uses:` (including `.github/actions/*/action.yml`), run `gh actions-lock` and commit the lockfile with the change. Same-repo actions are referenced as `$/.github/actions/...`, which runs at the workflow's own commit. Renovate regenerates the lockfile when it bumps an action.
- me, lgtm, diary, trends, design, and art are built and deployed locally (`pnpm deploy:me` / `pnpm deploy:lgtm` / `pnpm deploy:diary` / `pnpm deploy:trends` / `pnpm deploy:design` / `pnpm deploy:art`), not from CI. trends is normally published end-to-end by the `creating-trend-digest` skill in `.claude/skills/` (data commit → deploy → push).
- PRs land through GitHub auto-merge: the `main` ruleset requires the CI check, `Verify actions.lock`, CodeQL results, and an up-to-date branch (a merge queue is unavailable on user-owned repositories), and two skills in `.claude/skills/` follow `creating-pr`: `labeling-pr` gives the PR its `type: *` label as soon as it opens, then `enabling-auto-merge` marks it ready and enables auto-merge with a merge commit as the last step.
- The daily trends digest is the one direct push to main (the `creating-trend-digest` skill); the ruleset's admin bypass exists for that, so keep `bypass_mode` at `always`.

## Gotchas

- `exactOptionalPropertyTypes: true` — optional props need `| undefined`, not just `?:`
- `.astro` files can't be imported from `.ts` (tsc doesn't resolve them)
- Coverage thresholds in every `vitest.config.ts` ratchet: `autoUpdate` rewrites them when coverage improves, so commit the bumped values with the change; a drop fails `pnpm coverage` and therefore CI. Lower a threshold by hand only when the drop is deliberate.
- Per-app specifics (content schemas, blog/memo conventions) live in each app's `CLAUDE.md` — read those first when working inside an app.
- UI changes (`.astro` / `.css` / `.tsx` under `apps/*/src`, `packages/ui`, `packages/styles`) follow the design system in `apps/design` (design.kkhys.me). `.claude/rules/design-system.md` loads for those files and names the sources to read — consult it first when a task is UI work, even before opening a file.
