# kkhys.me

Source code for [kkhys.me](https://kkhys.me) — a personal website and blog built with Astro. The `@kkhys/me` app of the [kkhys monorepo](../../README.md).

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [React](https://react.dev/) — Server-side OG image generation (via Satori, `@kkhys/og`)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (`@kkhys/styles`)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Vitest](https://vitest.dev/) — Unit testing
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

From the monorepo root:

```bash
direnv allow   # Loads Node.js, pnpm, Bun via Nix Flake
pnpm install
pnpm dev:me    # or: pnpm --filter @kkhys/me dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Content

Blog content lives in the `me-content` Git submodule. Development works without it (fixtures). A production build needs the submodule:

```bash
git submodule update --init apps/me/me-content
```

## Scripts

Run from this directory, or prefix with `pnpm --filter @kkhys/me`:

| Command                       | Description                              |
| ----------------------------- | ---------------------------------------- |
| `pnpm dev`                    | Start development server                 |
| `pnpm build`                  | Production build (static)                |
| `pnpm preview`                | Preview production build locally         |
| `pnpm check`                  | Astro check + `tsc --noEmit`             |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with oxlint + oxfmt     |
| `pnpm test` / `pnpm coverage` | Run unit tests / with coverage           |
| `pnpm render:mermaid`         | Pre-render Mermaid diagrams to SVG cache |
| `pnpm create:entry`           | Scaffold a new blog post                 |
| `pnpm deploy`                 | Build and deploy to Cloudflare Pages     |

## Project Structure

```
apps/me/
├── src/
│   ├── components/       # Shared UI components + SEO wrappers
│   ├── config/           # Site configuration
│   ├── features/         # Feature modules (blog, pages)
│   ├── layouts/          # Page layouts
│   ├── lib/              # Custom remark/rehype plugins, API wrappers
│   ├── pages/            # File-based routing
│   ├── styles/           # Global styles (global.css, prose.css)
│   ├── utils/            # Pure helper functions
│   └── content.config.ts # Content schema definitions
├── me-content/           # Blog MDX + bucket-list YAML (Git submodule)
└── scripts/              # create-entry, render-mermaid
```

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## Content

Blog posts are organized by date (`me-content/blog/YYYY-MM-DD/index.mdx`) and categorized into 4 groups:

- Tech — Technology and programming
- Life — Daily life and experiences
- Object — Product reviews and things
- DIY — Do-it-yourself projects

## Deployment

Built and deployed locally to [Cloudflare Pages](https://pages.cloudflare.com/) via `pnpm deploy`. Unlike memo, me is not deployed from CI.

## License

Code is licensed under [MIT](../../LICENSE.md). Content and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
