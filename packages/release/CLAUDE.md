# CLAUDE.md

`@kkhys/release` — date-based release tagging, driven by
`scripts/release.ts` at the repo root (`pnpm release`).

## Behavior

- Versions are `YYYY.MM.DD`, suffixed `-2`, `-3`, … for same-day
  re-releases (`version.ts`, anchored matching — tested).
- `release()` fetches origin tags first, refuses to tag a stale or
  diverged main (`pull --ff-only`), force-pushes the tag, and creates a
  GitHub Release; any failure sets a non-zero exit code.
- `dryRun: true` (CLI: `--dry-run`) previews without git/API mutations
  and needs no `GITHUB_ACCESS_TOKEN`.

## Constraints

- `index.ts` imports `bun` and can only run under Bun; keep testable
  logic in bun-free modules (`version.ts`, `github.ts`) so vitest (Node)
  can cover it.
