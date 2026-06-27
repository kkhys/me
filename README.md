# kkhys

A pnpm monorepo for kkhys's personal sites, built with [Astro](https://astro.build/) and deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

## Workspace

### Apps

| Package | Site | Description |
| --- | --- | --- |
| [`@kkhys/me`](./apps/me) | [kkhys.me](https://kkhys.me) | Personal website and blog |
| [`@kkhys/memo`](./apps/memo) | [memo.kkhys.me](https://memo.kkhys.me) | Short threaded memos (max 500 chars) |

### Packages

| Package | Description |
| --- | --- |
| `@kkhys/styles` | uchu.css OKLCH color palette |
| `@kkhys/seo` | BaseSEO / OpenGraph / TwitterCard Astro primitives |
| `@kkhys/og` | Satori OG image + favicon generators |
| `@kkhys/release` | Date-based release tagging |

Shared packages are consumed as source (no build step); each app applies its own config via thin wrappers. Dependency versions are centralized in the `catalog:` of `pnpm-workspace.yaml`.

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [React](https://react.dev/) — Server-side OG image generation (via Satori)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (OKLCH)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Vitest](https://vitest.dev/) — Unit testing
- [Biome](https://biomejs.dev/) — Linting and formatting
- [pnpm](https://pnpm.io/) workspaces — Monorepo management
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

### Prerequisites

- [Nix](https://nixos.org/) with Flakes enabled
- [direnv](https://direnv.net/) with [nix-direnv](https://github.com/nix-community/nix-direnv)

### Setup

```bash
direnv allow   # Loads Node.js, pnpm, Bun via Nix Flake
pnpm install
pnpm dev:me    # or: pnpm --filter @kkhys/memo dev
```

## Scripts

Run from the repo root:

| Command | Description |
| --- | --- |
| `pnpm build` | Build every app and package (`pnpm -r`) |
| `pnpm test` | Run unit tests across the workspace |
| `pnpm check` | Type check across the workspace |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with Biome |
| `pnpm dev:me` / `pnpm build:me` / `pnpm deploy:me` | me shortcuts |
| `pnpm --filter @kkhys/memo <script>` | Target a single app |
| `pnpm release` | Tag a repo-wide release |

Per-app commands are documented in each app's README ([me](./apps/me/README.md), [memo](./apps/memo/README.md)).

## CI / Deploy

- `.github/workflows/ci.yml` — runs on pull requests and the merge queue: lint, test, type check, and build across the workspace against fixtures.
- `.github/workflows/deploy-memo.yml` — deploys memo to Cloudflare Pages on pushes to main that touch memo or shared packages.
- me is built and deployed locally via `pnpm deploy:me`.

## License

Code is licensed under [MIT](./LICENSE.md). Content and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
