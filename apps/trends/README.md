# @kkhys/trends

Daily tech trend digest at [trends.kkhys.me](https://trends.kkhys.me).

One JSON file per day lives in `src/content/runs/`, validated by the zod schema in `src/content.config.ts` at build time. The data is produced and published end-to-end (write → commit → deploy → push) by the `creating-trend-digest` Claude Code skill.

## Pages

| URL        | Content                                     |
| ---------- | ------------------------------------------- |
| `/`        | Latest digest                               |
| `/<date>`  | Permanent per-day page with prev/next nav   |
| `/archive` | All runs, newest first                      |
| `/about`   | How the site works, score and star criteria |

## Scripts

| Command                       | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `pnpm dev`                    | Start the dev server                            |
| `pnpm build`                  | Build to `dist/` (validates all run JSON)       |
| `pnpm preview`                | Preview the production build locally            |
| `pnpm check`                  | `astro check` + `tsc --noEmit`                  |
| `pnpm test`                   | Vitest unit tests                               |
| `pnpm coverage`               | Vitest with coverage                            |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with oxlint + oxfmt            |
| `pnpm all`                    | build → check → lint:fix → test → coverage      |
| `pnpm deploy`                 | Build and deploy to Cloudflare Pages (`trends`) |

From the repo root: `pnpm dev:trends` / `pnpm build:trends` / `pnpm deploy:trends`.
