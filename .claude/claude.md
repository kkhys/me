# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Development Commands

```bash
pnpm dev                   # Start development server
pnpm build                 # Production build (Vercel)
pnpm build:node            # Node.js standalone build
pnpm preview               # Preview production build locally
pnpm check                 # Run Astro check + TypeScript validation
pnpm lint                  # Check code with Biome
pnpm lint:fix              # Auto-fix Biome issues
pnpm create:entry          # Interactive blog post creation script
pnpm release               # Release automation script
```

## Architecture Overview

- **Astro 5.12.3** with React islands for interactive components
- **TailwindCSS v4** with CSS-first configuration using `@theme` directive
- **TypeScript** with strictest configuration and `#/*` path aliases
- **Feature-based structure**: Each feature in `src/features/` contains its own components, utilities, and configurations
- **File-based CMS**: Astro Content Collections with strict Zod schemas
- **Date-based content**: `/content/blog/YYYY-MM-DD/index.mdx`

## Content System

### Categories & Tags
- **4 Categories**: Tech, Life, Object, DIY
- **Hierarchical tagging**: Tags are scoped to specific categories
- **Build-time validation**: Invalid category-tag combinations cause build failures

### Frontmatter Requirements
- **Required**: title, description, emoji, category, publishedAt
- **Optional**: tags, status, updatedAt, sourceUrl, editUrl

### Japanese Language Features
- **BudouX integration** for natural Japanese line breaking
- **Bilingual support**: English titles/slugs with Japanese labels

## Custom Markdown Plugins

Located in `/src/lib/`:
- `remark-link-card`: Converts bare URLs to rich preview cards
- `remark-video-block`: Custom video embedding syntax
- `rehype-budoux`: Japanese text processing
- `rehype-pagefind`: Search index integration

## Key Files

- `astro.config.ts` - Central configuration
- `src/content.config.ts` - Content schema definitions
- `src/features/blog/config/` - Category and tag definitions
- `biome.json` - Code quality configuration
- `scripts/create-entry.ts` - Blog post creation automation

## Development Workflow

1. Use `pnpm create:entry` for new blog posts
2. Place images in the same directory as content files
3. Run `pnpm check` before committing
4. Run `pnpm lint:fix` to auto-format code

## External Integrations

- **GitHub**: Contribution data via GraphQL API
- **Spotify**: Now playing widget
- **Redis**: API response caching via Upstash
- **Pagefind**: Automatic search index generation
