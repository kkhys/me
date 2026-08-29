# art

Source code for [art.kkhys.me](https://art.kkhys.me) — an artwork and fashion design gallery built with Astro. Thumbnail grids open per-image pages, with CSS cross-document view transitions morphing the image between them (no client JavaScript). The `@kkhys/art` app of the [kkhys monorepo](../../README.md).

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (`@kkhys/styles`)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

From the monorepo root:

```bash
direnv allow   # Loads Node.js, pnpm, Bun via Nix Flake
pnpm install
pnpm dev:art   # or: pnpm --filter @kkhys/art dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Content

Images and captions live in the `art-content` Git submodule. Without it, set `USE_FIXTURE_DATA=true` to build against the sample content in `src/__fixtures__`. A production build needs the submodule:

```bash
git submodule update --init apps/art/art-content
```

New images are added through the submodule's `pnpm ingest` script, which resizes, converts to sRGB, and strips metadata. See `art-content/README.md`.

## Scripts

Run from this directory, or prefix with `pnpm --filter @kkhys/art`:

| Command                       | Description                          |
| ----------------------------- | ------------------------------------ |
| `pnpm dev`                    | Start development server             |
| `pnpm build`                  | Production build (static)            |
| `pnpm preview`                | Preview production build locally     |
| `pnpm check`                  | Astro check + `tsc --noEmit`         |
| `pnpm test`                   | Run unit tests                       |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with oxlint + oxfmt |
| `pnpm deploy`                 | Build and deploy to Cloudflare Pages |

## Project Structure

```
apps/art/
├── src/
│   ├── components/   # art-picture (<Picture> + blur-up), gallery-thumb, work/fashion figures, header, pager
│   ├── config/       # content-path.ts (fixture switch), site.ts
│   ├── layouts/      # base-layout.astro (HTML shell + SEO/OGP meta)
│   ├── lib/          # gallery.ts (collections + globbed images)
│   ├── pages/        # index (thumbnail grids), works/[slug], fashion/[series]/[number]
│   ├── styles/       # global.css (tokens, base styles, view-transition opt-in)
│   ├── utils/        # caption pairing, route helpers
│   ├── __fixtures__/ # Sample content for CI builds
│   └── __tests__/    # Vitest unit tests
├── art-content/      # Images + captions (Git submodule, private)
└── public/           # Static assets (icons, manifest, robots.txt)
```

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## Deployment

Built and deployed locally via wrangler:

```bash
pnpm deploy   # Build and deploy to Cloudflare Pages
```

The `art-content` submodule must be initialized first. art is not deployed from CI.

## License

Code is licensed under [MIT](../../LICENSE.md). Artworks and images are © Keisuke Hayashi, all rights reserved.
