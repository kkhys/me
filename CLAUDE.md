# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based memo posting site that displays short memos (max 500 characters) in a social media thread-like layout. Content is managed separately via a Git submodule in the `memo-content/` directory.

## Development Commands

### Setup
```bash
pnpm install
```

### Core Development
```bash
pnpm dev                # Start development server
pnpm build              # Production build
pnpm check              # Astro check + TypeScript type checking
pnpm lint               # Run Biome linter
pnpm lint:fix           # Auto-fix with Biome
```

### Testing
```bash
pnpm test               # Run all tests
pnpm coverage           # Generate coverage report

# Run specific test file
pnpm test src/__test__/utils/memo.test.ts

# Watch mode
pnpm test --watch
```

### Full Quality Check
```bash
pnpm all                # Runs build + check + lint:fix + test + coverage
```

## Architecture

### Content Management System

**Content Location**:
- Production: `./memo-content/memo` (Git submodule)
- Development/CI: `./src/__fixtures__/memo-sample` (sample data)

**Switching Logic** (src/content.config.ts:5-7):
- Uses `USE_FIXTURE_DATA` env variable to switch to fixture data in CI
- Deployed via Cloudflare Pages (Git integration)

**Content Structure**:
```
memo-content/memo/
└── <timestamp_id>/       # e.g., 20251001_204021
    ├── index.md          # Frontmatter + content (max 500 chars)
    ├── 01.jpg            # Optional images (max 4)
    └── 02.jpg
```

**Content Schema**:
- `id`: ULID string
- `images`: Optional array of filenames (max 4)
- `createdAt`: Date
- `isPublished`: Boolean (default: true)
- `author`: String (default: "Keisuke Hayashi")

### Data Flow

1. **Collection Loading** (src/content.config.ts:9-18):
   - Astro Content Collections with glob loader
   - Pattern: `**/index.md`

2. **Filtering & Sorting** (src/utils/memo.ts:4-14):
   - Development: Shows all memos including drafts
   - Production: Only `isPublished: true`
   - Filters out empty body content
   - Sorts by `createdAt` descending (newest first)

3. **Rendering**:
   - Index page: All published memos with priority loading for first 6
   - Detail page: Single memo via `[id].astro`

### Image Handling

**Import System** (src/utils/image.ts:3-6):
- Uses `import.meta.glob()` to dynamically import images from submodule
- Maps memo ID to image paths

**Optimization**:
- Astro `<Picture>` component with AVIF format
- Responsive widths: 320px, 640px, 1280px
- Priority loading on first 6 posts (src/pages/index.astro:13)

### Content Validation

**Character Limit** (src/lib/remark-word-limit.ts):
- Remark plugin enforces 500 character limit
- Throws error during build if exceeded
- Counts all text content (strips markdown syntax)

### Environment-Specific Behavior

**Development Mode**:
- Shows draft memos (`isPublished: false`)
- Uses fixture data when submodule unavailable

**Production Mode**:
- Only published memos
- Requires submodule content

## Key Constraints

1. **Character Limit**: Memo content must be ≤499 characters (enforced at build time)
2. **Image Limit**: Maximum 4 images per memo
3. **Image Formats**: JPG and PNG only (defined in src/utils/image.ts:4)
4. **Content Separation**: All memo content lives in `memo-content/` submodule, not in main repo

## Testing Notes

- **Mocked Modules**: `astro:content`, `astro:env/client`
- **Coverage Target**: `src/utils/*.ts` and `src/lib/*.ts` (excludes `image.ts`)
- **Test Data**: Mock collections in `src/__fixtures__/memo-collection.ts`

## TypeScript Configuration

- Extends `astro/tsconfigs/strictest`
- Path alias: `#/*` maps to `./src/*`
- Full type safety enforced

## Styling

- CSS Framework: kiso.css (reset) + custom variables
- Theme: Light/dark mode via `prefers-color-scheme`
- Color system: Uchu.css-based (src/styles/uchu.css)
- Layout: Centered feed with max-width 40rem
