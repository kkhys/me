# diary

Source code for [diary.kkhys.me](https://diary.kkhys.me) — a photo diary built with Astro. The `@kkhys/diary` app of the [kkhys monorepo](../../README.md).

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (`@kkhys/styles`)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Biome](https://biomejs.dev/) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

From the monorepo root:

```bash
direnv allow   # Loads Node.js, pnpm, Bun via Nix Flake
pnpm install
pnpm dev:diary    # or: pnpm --filter @kkhys/diary dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Content

Photos live in the `diary-content` Git submodule. Development works without it (an empty gallery). A production build needs the submodule:

```bash
git submodule update --init apps/diary/diary-content
```

## Scripts

Run from this directory, or prefix with `pnpm --filter @kkhys/diary`:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build (static) |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Astro check + `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with Biome |
| `pnpm deploy` | Build and deploy to Cloudflare Pages |

## Project Structure

```
apps/diary/
├── src/
│   ├── components/   # diary-image.astro (<Picture> + blur-up placeholder)
│   ├── layouts/      # base-layout.astro (HTML shell + SEO/OGP meta)
│   ├── pages/        # index.astro (the gallery)
│   └── styles/       # global.css (tokens + base styles)
├── diary-content/    # Photos (Git submodule, private)
└── public/           # Static assets (robots.txt)
```

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## Deployment

Built and deployed locally via wrangler:

```bash
pnpm deploy   # Build and deploy to Cloudflare Pages
```

The `diary-content` submodule must be initialized first. diary is not deployed from CI.

## License

Code is licensed under [MIT](../../LICENSE.md). Content and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
