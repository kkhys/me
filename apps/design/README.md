# design

Source code for [design.kkhys.me](https://design.kkhys.me) — the design system docs for kkhys.me and its sibling sites, built with Astro. Token pages are rendered by parsing the `@kkhys/styles` CSS at build time, and the component pages show live `@kkhys/ui` instances, so the docs cannot drift from the shared packages. The `@kkhys/design` app of the [kkhys monorepo](../../README.md).

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [astro-pagefind](https://github.com/shishkin/astro-pagefind) — Full-text search, with a build-time check that the index covers every doc page
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (`@kkhys/styles`)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Playwright](https://playwright.dev/) — Visual regression tests (local only)
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

From the monorepo root:

```bash
direnv allow      # Loads Node.js, pnpm, Bun via Nix Flake
pnpm install
pnpm build:design # Search is served from dist/pagefind on the dev server
pnpm dev:design   # or: pnpm --filter @kkhys/design dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site. There is no content submodule; everything is documented from the shared packages in this repo.

## Pages

| URL               | Content                                                        |
| ----------------- | -------------------------------------------------------------- |
| `/`               | Principles, usage, page index                                  |
| `/colors`         | Semantic color tokens + uchu palette                           |
| `/typography`     | Font size / weight / line-height tokens with live samples      |
| `/layout`         | Spacing, radius, content width, shadow                         |
| `/icons`          | `@kkhys/ui/icons` inventory                                    |
| `/components`     | Live `@kkhys/ui` demos with usage guidance                     |
| `/conventions`    | Cross-app UI/UX conventions with source references             |
| `/accessibility`  | Build-time WCAG contrast table, a11y rules, checklist          |
| `/preview/<kind>` | Standalone demo documents for the phone-width iframe (noindex) |

## Scripts

Run from this directory, or prefix with `pnpm --filter @kkhys/design`:

| Command                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `pnpm dev`                    | Start development server                           |
| `pnpm build`                  | Production build (static) + search index           |
| `pnpm preview`                | Preview production build locally                   |
| `pnpm check`                  | Astro check + `tsc --noEmit`                       |
| `pnpm test`                   | Run unit tests                                     |
| `pnpm test:vrt`               | Playwright screenshots against committed baselines |
| `pnpm test:vrt:update`        | Re-record the screenshot baselines                 |
| `pnpm coverage`               | Unit tests with coverage                           |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with oxlint + oxfmt               |
| `pnpm all`                    | build → check → lint:fix → test → coverage         |
| `pnpm deploy`                 | Build and deploy to Cloudflare Pages               |

VRT runs locally only (the baselines use macOS system fonts) and needs the Playwright browser once: `pnpm exec playwright install chromium`.

## Project Structure

```
apps/design/
├── src/
│   ├── components/   # sidebar, stage + demo bodies, search dialog, code block, swatches, rule lists
│   ├── data/         # conventions, accessibility rules, icon annotations (hand-curated)
│   ├── integrations/ # verify-pagefind-index (fails the build on index gaps)
│   ├── layouts/      # base-layout.astro (sidebar shell), preview-layout.astro (iframe documents)
│   ├── pages/        # the eight doc pages + preview/
│   ├── styles/       # global.css (tokens + site shell)
│   ├── utils/        # token / color / prose / search / icon helpers
│   └── __tests__/    # Vitest unit tests
├── vrt/              # Playwright spec, static server, committed screenshots
└── public/           # favicon.svg, robots.txt, preview/og.svg
```

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## Deployment

Built and deployed locally via wrangler:

```bash
pnpm deploy   # wrangler pages deploy dist --project-name=design
```

design is not deployed from CI. No analytics yet.

## License

Code is licensed under [MIT](../../LICENSE.md).
