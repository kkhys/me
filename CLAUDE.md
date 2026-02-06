# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev                   # Start development server (localhost:4321)
pnpm build                 # Production build (Vercel adapter)
pnpm build:node            # Node.js standalone build
pnpm preview               # Preview production build locally
pnpm check                 # Run Astro check + TypeScript validation
pnpm lint                  # Check code with Biome
pnpm lint:fix              # Auto-fix Biome issues
pnpm create:entry          # Interactive blog post creation (runs with Bun)
pnpm release               # Release automation (date-based versioning, runs with Bun)
```

CI runs: lint → type check → build. Add `skip-ci` label to PRs to skip.

## Architecture Overview

Astro 5 static site with React islands, deployed on Vercel. Hono handles API routes. TailwindCSS v4 with CSS-first `@theme` configuration. TypeScript strictest mode.

### Path Aliases

All imports use `#/*` which maps to `./src/*`:
```typescript
import { categories } from "#/features/blog/config/category";
```

### Feature-Based Structure

Each feature in `src/features/` is self-contained with its own components, utilities, and config:
- `blog/` — Blog system (config, components, utils, actions)
- `home/` — Home page
- `legal/` — Legal pages

### API Routes (Hono)

Entry point: `src/pages/api/[...path].ts` routes to services in `src/pages/api/_services/`:
- `github/contributions` — GitHub contribution data (GraphQL)
- `github/last-update-file` — Last file update info
- `spotify` — Now playing (OAuth)
- `og/[id].png`, `og/default.png` — Dynamic OG images (Satori)

API responses are cached with Upstash Redis.

### Environment Variables

Defined via `astro:env` in `astro.config.ts` (type-safe access). Server secrets: `GITHUB_ACCESS_TOKEN`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Copy `.env.example` to `.env` for local development.

## Content System

### Collections

3 collections defined in `src/content.config.ts`:
- **blog**: MDX files in `content/blog/YYYY-MM-DD/index.mdx` (images co-located in same directory)
- **legal**: Markdown in `content/legal/`
- **bucketList**: YAML in `content/bucket-list/data.yaml`

### Categories & Tags

4 categories (Tech, Life, Object, DIY) defined in `src/features/blog/config/category.ts`. Tags are hierarchically scoped per category in `src/features/blog/config/tag.ts`. **Invalid category-tag combinations cause build failures** via Zod refinement in `content.config.ts`.

### Frontmatter

Required: `title`, `description`, `emoji`, `category`, `publishedAt`. Optional: `tags`, `status` (draft/published — drafts only visible in dev), `updatedAt`, `sourceUrl`, `editUrl`, `revisionHistoryUrl`.

### Slugs

Auto-generated using Bech32m hashing (7 chars) via `src/lib/hash.ts`.

## Custom Markdown Plugins (`src/lib/`)

**Remark**: `remark-link-card` (bare URLs → rich previews), `remark-video-block`, `remark-youtube-block` (→ lite-youtube-embed), `remark-tweet-block` (→ react-tweet), `remark-footnote-title`, `remark-blockquote-alert` (GitHub-style `[!NOTE]` etc.)

**Rehype**: `rehype-budoux` (Japanese natural line breaking with `<wbr>`), `rehype-slug`, `rehype-slug-with-custom-id`, `rehype-mermaid` (build-time SVG generation)

## Code Style

- **Formatter/Linter**: Biome (space indentation). Some rules disabled for `.astro` files.
- **Astro files**: `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports` are off.
- **Japanese content**: BudouX for line breaking, bilingual support (English titles/slugs, Japanese labels).

## Content Review System

When asked to review an article ("この記事のレビューを行なってください"), automatically launch all 4 review agents in parallel via the `Task` tool: `content-reviewer`, `language-editor`, `readability-enhancer`, `technical-writer`. Integrate results into a unified report.
