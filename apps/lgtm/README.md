# LGTM

<a href="https://lgtm.kkhys.me/01kdg0h1dnmjgpqw8rxwmbakeh"><img src="https://lgtm.kkhys.me/01kdg0h1dnmjgpqw8rxwmbakeh.avif" alt="LGTM!!" width="400" /></a>

Source code for [lgtm.kkhys.me](https://lgtm.kkhys.me) — a curated collection of LGTM images for GitHub Pull Requests, built with Astro. The `@kkhys/lgtm` app of the [kkhys monorepo](../../README.md).

## Features

- "LGTM" text rendered by Satori and composited onto each source image by sharp at build time
- Still sources ship as AVIF, animated sources as animated WebP — one format per image
- Three sizes per image (400 / 1000 / 1200px) plus an 800px default endpoint
- Paginated gallery (20 per page, shuffled at build) with infinite scroll over pre-built pages
- Blur-up placeholders, one-click "Copy embed code" (HTML `<a><img></a>` snippet)
- Per-image Open Graph cards, JSON-LD, sitemap, PWA manifest
- Privacy policy and copyright pages in English and Japanese
- Light/dark mode via `light-dark()`

## Browser Extension

[LGTM Chrome Extension](https://github.com/kkhys/lgtm-chrome-extension) copies a random image from this gallery to the clipboard while browsing GitHub. Get it from the [Chrome Web Store](https://chromewebstore.google.com/detail/lgtm-chrome-extension/pekflahhcpfnbllbphcjnjngkhlabohh).

## Tech Stack

- [Astro](https://astro.build/) — Static site generator (Content Collections + pagination)
- [Satori](https://github.com/vercel/satori) + [sharp](https://sharp.pixelplumbing.com/) — Text overlay rendering and image compositing
- [React](https://react.dev/) — Server-side only, as Satori's JSX runtime
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) palette (`@kkhys/styles`)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Vitest](https://vitest.dev/) — Unit testing
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

Dependency versions are pinned in the `catalog:` of [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml); Node.js, pnpm, Bun, and ffmpeg come from the Nix Flake at the repo root.

## Getting Started

From the monorepo root:

```bash
git clone --recurse-submodules https://github.com/kkhys/me.git
cd me
direnv allow   # Loads Node.js, pnpm, Bun, ffmpeg via Nix Flake
pnpm install
pnpm dev:lgtm  # or: pnpm --filter @kkhys/lgtm dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

### Content

Images live in the private `lgtm-content` Git submodule. Without it, set `USE_FIXTURE_DATA=true` to build against the sample entries in `src/__fixtures__/lgtm-sample` (CI does this automatically). A production build needs the submodule:

```bash
git submodule update --init apps/lgtm/lgtm-content
```

Each entry is a directory named by a lowercase ULID:

```
lgtm-content/lgtm/{ulid}/
  ├── 01.jpg             # Source image (jpg / png / webp / gif / avif; the first media file by name is used)
  └── description.txt    # One line describing the picture — required, the build fails without it
```

The loader probes each file with sharp: a multi-frame source is served as animated WebP, everything else as AVIF. The description becomes the image alt (`LGTM over <description>`).

Inside `lgtm-content/`, `pnpm lgtm` creates a new ULID directory (drop the image and write `description.txt` by hand), `pnpm strip-exif` scrubs EXIF from all images, and a lefthook pre-commit hook scrubs staged images automatically. `.mov` sources are converted to animated WebP with `pnpm convert-videos` from this directory (Bun + ffmpeg).

## Routes

```
/                         → Gallery (paginated)
/{page}                   → Gallery page N — infinite-scroll fetch target; direct visits redirect to /
/{id}                     → Detail page with the image and a "Copy embed code" button
/{id}.{avif|webp}         → 800px image (the embed URL)
/{id}-{size}.{avif|webp}  → 400 / 1000 / 1200px image
/privacy, /privacy/ja     → Privacy policy (en / ja)
/copyright, /copyright/ja → Copyright (en / ja)
/api/ids.json             → All image IDs with their format
/api/og/default.png       → Default Open Graph image
/api/og/{id}.png          → Per-image Open Graph image
/api/favicon/*            → Favicon generation (dev only; production serves static files from public/)
```

The format of an image is fixed by its source: `.avif` for still images, `.webp` for animated ones. There is no format negotiation.

## Scripts

Run from this directory, or prefix with `pnpm --filter @kkhys/lgtm`:

| Command                       | Description                                               |
| ----------------------------- | --------------------------------------------------------- |
| `pnpm dev`                    | Start development server                                  |
| `pnpm build`                  | Production build (static)                                 |
| `pnpm preview`                | Preview production build locally                          |
| `pnpm check`                  | Astro check + `tsc --noEmit`                              |
| `pnpm test` / `pnpm coverage` | Run unit tests / with coverage                            |
| `pnpm lint` / `pnpm lint:fix` | Check / auto-fix with oxlint + oxfmt                      |
| `pnpm all`                    | build + check + lint:fix + test + coverage                |
| `pnpm convert-videos`         | Convert `.mov` sources in `lgtm-content` to animated WebP |
| `pnpm deploy`                 | Build and deploy to Cloudflare Pages                      |

Releases are tagged for the whole repo with `pnpm release` from the monorepo root.

## Project Structure

```
apps/lgtm/
├── src/
│   ├── assets/           # BBHBartle-Regular.ttf (the overlay font)
│   ├── components/       # lgtm-image.tsx (Satori + sharp pipeline), seo/ adapters + OG card, legal-layout / legal-page
│   ├── config/           # constants.ts, content-path.ts (fixture switch)
│   ├── content/          # privacy/ and copyright/ pages ({en,ja}.md)
│   ├── layouts/          # layout.astro (HTML shell: head meta, header, footer, Umami)
│   ├── loaders/          # lgtm-dir-loader.ts (one entry per ULID directory)
│   ├── pages/            # Gallery, detail, image endpoints, legal pages, api/
│   ├── styles/           # global.css (@kkhys/styles + app-local tokens)
│   ├── utils/            # alt, date, embed, shuffle
│   ├── content.config.ts # lgtm / privacy / copyright collections
│   ├── __fixtures__/     # Sample entries for CI builds
│   └── __tests__/        # Vitest unit tests (components, pages, config, loaders, utils)
├── scripts/              # convert-videos.ts (Bun + ffmpeg)
├── lgtm-content/         # Images (Git submodule, private)
└── public/               # Static assets (icons, manifest, robots.txt)
```

Shared packages from the monorepo: `@kkhys/ui` (head meta, header / footer, infinite scroll, icons), `@kkhys/seo`, `@kkhys/og`, `@kkhys/styles`, `@kkhys/analytics`.

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## Deployment

Built and deployed locally via wrangler:

```bash
pnpm deploy:lgtm   # from the repo root; runs pnpm build then wrangler pages deploy dist --project-name=lgtm
```

The `lgtm-content` submodule must be initialized first. lgtm is not deployed from CI; CI only verifies the build against fixtures.

## License

Code is licensed under [MIT](../../LICENSE.md). Image usage terms are on the [copyright page](https://lgtm.kkhys.me/copyright).
