# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev                   # Start development server (localhost:4321)
pnpm build                 # Production build (static)
pnpm preview               # Preview production build locally
pnpm check                 # Run Astro check + TypeScript validation
pnpm lint                  # Check code with Biome
pnpm lint:fix              # Auto-fix Biome issues
pnpm test                  # Run unit tests (Vitest)
pnpm coverage              # Run tests with coverage report
pnpm render:mermaid        # Pre-render Mermaid diagrams to SVG cache
pnpm create:entry          # Interactive blog post creation (runs with Bun)
pnpm release               # Release automation (date-based versioning, runs with Bun)
pnpm deploy                # Build and deploy to Cloudflare Pages
```

CI runs: lint → test → type check → build. Add `skip-ci` label to PRs to skip.

## Architecture Overview

Astro 5 static site deployed on Cloudflare Pages. React is used only for server-side OG image generation (Satori), not as client-side islands. Vanilla CSS with kiso.css reset + uchu.css color palette (OKLCH). TypeScript strictest mode.

### Path Aliases

All imports use `#/*` which maps to `./src/*`:
```typescript
import { categories } from "#/features/blog/config/category";
```

### Directory Structure

- `src/features/` — Feature modules, each self-contained with its own components, utilities, and config:
  - `blog/` — Blog system (config, components, utils, actions)
  - `home/` — Home page
  - `pages/` — Static pages (about, privacy, copyright)
- `src/lib/` — Libraries (remark/rehype plugins, API wrappers, structured modules)
  - `src/lib/api/` — API wrappers (GitHub, emoji, metadata) with in-memory caching
- `src/utils/` — Pure helper functions (date.ts, font-loader.ts, base-url.ts, hash.ts)
- `src/styles/` — Global CSS (kiso.css reset, uchu.css OKLCH palette, prose styles)
- `src/__tests__/` — Unit tests (mirrors src/utils/ and src/lib/ structure)
- `src/__fixtures__/` — Test fixtures

### API Routes

Astro file-based API routes in `src/pages/api/`:
- `og/[id].png`, `og/default.png` — Dynamic OG images (Satori)

### Environment Variables

Defined via `astro:env` in `astro.config.ts` (type-safe access). Server secrets: `GITHUB_ACCESS_TOKEN`.

## Content System

### Collections

4 collections defined in `src/content.config.ts`:
- **blog**: MDX files in `content/blog/YYYY-MM-DD/index.mdx` (images co-located in same directory)
- **pages**: MDX in `src/content/pages/`
- **bucketList**: YAML in `content/bucket-list/data.yaml`
- **externalPost**: YAML in `src/content/external-posts/data.yaml` (posts published on Hatena, note, Zenn)

### Categories & Tags

4 categories (Tech, Life, Object, DIY) defined in `src/features/blog/config/category.ts`. Tags are hierarchically scoped per category in `src/features/blog/config/tag.ts`. **Invalid category-tag combinations cause build failures** via Zod refinement in `content.config.ts`.

### Frontmatter

Required: `title`, `emoji`, `category`, `publishedAt`. Optional: `tags`, `status` (draft/published — drafts only visible in dev), `updatedAt`. Description is dynamically extracted from MDX body.

### Slugs

Auto-generated using Bech32m hashing (7 chars) via `src/utils/hash.ts`.

## Custom Markdown Plugins (`src/lib/`)

**Remark**: `remark-link-card` (bare URLs → rich previews), `remark-video-block`, `remark-youtube-block` (→ lite-youtube-embed), `remark-footnote-title`, `remark-blockquote-alert` (GitHub-style `[!NOTE]` etc.)

**Rehype**: `rehype-budoux` (Japanese natural line breaking with `<wbr>`), `rehype-slug-with-custom-id` (Bech32m heading IDs), `rehype-mermaid-cached` (pre-rendered SVG embedding with light/dark theme support)

## Testing

Unit tests use Vitest. Test files are in `src/__tests__/` mirroring the source structure. Fixtures in `src/__fixtures__/`.

```bash
pnpm test       # Run all tests
pnpm coverage   # Generate coverage report
```

Coverage targets: `src/utils/*.ts`, `src/lib/*.ts`, `src/lib/api/*.ts` (excluding static config files `expressive-code.ts` and `rehype-mermaid-options.ts`).

## Code Style

- **Formatter/Linter**: Biome (space indentation). Some rules disabled for `.astro` files.
- **Astro files**: `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports` are off.
- **CSS**: Vanilla CSS with `light-dark()` for theme switching, scoped `<style>` blocks, `class:list` directive for conditional classes.
- **Japanese content**: BudouX for line breaking, bilingual support (English titles/slugs, Japanese labels).

## Type Definition Placement

1. **`.astro` files**: Inline `interface Props` in the frontmatter
2. **`.ts` files**: Co-locate types tightly coupled with logic in the same file
3. **Shared types (3+ consumers)**: Extract to a dedicated `types.ts`
4. **Config constants**: Derive types with `as const satisfies` pattern

## Content Review System

When asked to review an article ("この記事のレビューを行なってください"), automatically launch all 4 review agents in parallel via the `Task` tool: `content-reviewer`, `language-editor`, `readability-enhancer`, `technical-writer`. Integrate results into a unified report.
