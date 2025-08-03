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

## Content Review System

### Comprehensive Review System

**Important**: When instructed with "この記事のレビューを行なってください" or similar comprehensive review requests, **automatically execute all 4 specialized agents in parallel**:

#### Auto-Execution Process

When receiving comprehensive review requests, execute:

1. Launch `content-reviewer` agent using `Task` tool for structural and logical analysis
2. Launch `language-editor` agent using `Task` tool for language and style editing
3. Launch `readability-enhancer` agent using `Task` tool for readability improvement
4. Launch `technical-writer` agent using `Task` tool for technical accuracy verification
5. Integrate all agent results into a comprehensive review report

#### Review Agent Configuration

1. **content-reviewer** (Purple) - Structural & logical analysis
2. **language-editor** (Green) - Language & style editing
3. **readability-enhancer** (Orange) - Readability enhancement
4. **technical-writer** (Blue) - Technical accuracy verification

#### Integrated Review Output Format

```markdown
# 📝 Comprehensive Content Review Results

## 🔍 Structural & Logical Analysis (Content Review)
[content-reviewer analysis results]

## ✏️ Language & Style Editing (Language Editing)
[language-editor analysis results]

## 📖 Readability Enhancement (Readability Enhancement)
[readability-enhancer analysis results]

## 🔧 Technical Accuracy Verification (Technical Writing)
[technical-writer analysis results]

## 📋 Overall Assessment & Improvement Proposals
- High Priority: [Critical improvement points]
- Medium Priority: [Important improvement points]
- Low Priority: [Recommended improvement points]

## ✅ Actionable Implementation Steps
1. [Immediately executable improvements]
2. [Phased improvement plans]
3. [Long-term quality enhancement strategies]
```
