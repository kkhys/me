# kkhys.me

Source code for [kkhys.me](https://kkhys.me) — a personal website and blog built with Astro.

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [React](https://react.dev/) — Server-side OG image generation (via Satori)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) — Styling with [kiso.css](https://github.com/build-trust/kiso.css) reset + [uchu.css](https://github.com/kkhys/uchu.css) color palette (OKLCH)
- [TypeScript](https://www.typescriptlang.org/) — Strictest mode type safety
- [Vitest](https://vitest.dev/) — Unit testing
- [Biome](https://biomejs.dev/) — Linting and formatting
- [Cloudflare Pages](https://pages.cloudflare.com/) — Hosting and deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24.13.0+
- [pnpm](https://pnpm.io/) v10.29.3+

### Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build (static) |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run Astro check + TypeScript validation |
| `pnpm lint` | Check code with Biome |
| `pnpm lint:fix` | Auto-fix Biome issues |
| `pnpm test` | Run unit tests |
| `pnpm coverage` | Run tests with coverage report |
| `pnpm render:mermaid` | Pre-render Mermaid diagrams to SVG cache |
| `pnpm create:entry` | Create a new blog post |
| `pnpm release` | Release automation (date-based versioning) |
| `pnpm deploy` | Build and deploy to Cloudflare Pages |

## Project Structure

```
src/
├── __fixtures__/     # Test fixtures
├── __tests__/        # Unit tests (Vitest)
├── assets/           # Static assets
├── components/       # Shared UI components
├── config/           # Site configuration
├── features/         # Feature modules
│   ├── blog/         # Blog system
│   ├── home/         # Home page
│   └── pages/        # Static pages (about, privacy, copyright)
├── layouts/          # Page layouts
├── lib/              # Libraries and custom plugins
│   ├── api/          # API wrappers (GitHub, Twitter, emoji, metadata)
│   ├── remark-*      # Custom remark plugins
│   └── rehype-*      # Custom rehype plugins
├── pages/            # File-based routing
├── styles/           # Global styles (kiso.css, uchu.css, prose.css)
├── utils/            # Pure helper functions
└── content.config.ts # Content schema definitions
content/
├── blog/             # Blog posts (MDX)
├── bucket-list/      # Bucket list data (YAML)
└── pages/            # Static pages (MDX)
scripts/
├── create-entry.ts   # Blog post scaffolding
├── render-mermaid.ts # Mermaid SVG pre-rendering
└── release.ts        # Release automation
```

## Content

Blog posts are organized by date (`content/blog/YYYY-MM-DD/index.mdx`) and categorized into 4 groups:

- **Tech** — Technology and programming
- **Life** — Daily life and experiences
- **Object** — Product reviews and things
- **DIY** — Do-it-yourself projects

## License

Code is licensed under [MIT](./LICENSE). Content and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
