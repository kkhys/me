# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LGTM is an Astro-based static site that generates and serves optimized "LGTM" images for GitHub Pull Requests. The core functionality centers around server-side image processing using Satori for text rendering and Sharp for image manipulation, with paginated gallery and infinite scroll.

**Live Site**: https://lgtm.kkhys.me

## Essential Commands

### Development
```bash
pnpm dev          # Start Astro dev server (localhost:4321)
pnpm build        # Production build to ./dist
pnpm preview      # Preview production build
pnpm check        # Astro check + TypeScript validation
pnpm lint         # Biome linting
pnpm lint:fix     # Auto-fix Biome issues
pnpm test         # Run unit tests (Vitest)
pnpm coverage     # Test coverage report
pnpm all          # Run build + check + lint:fix + test + coverage
```

### Deployment & Release
```bash
pnpm deploy           # Build and deploy to Cloudflare Pages
pnpm release          # Create version tag and GitHub release
pnpm release --dry-run  # Preview release without executing
```

### Private Content Management
```bash
cd lgtm-content
pnpm id           # Generate lowercase ULID for new images
pnpm memo         # Create timestamped memo entry
```

## Architecture

### Image Generation Pipeline

The core innovation is **dynamic text overlay generation** on user-provided images:

1. **Source Images**: Stored in `lgtm-content/lgtm/{ulid}/` with frontmatter metadata
2. **Text Rendering**: Satori generates SVG "LGTM" text at 2x resolution with custom font (BBHBartle-Regular)
3. **Compositing**: Sharp blends text overlay (85% opacity, blend mode: "over") onto resized source image
4. **Multi-Format Output**: Generates PNG/AVIF/WebP variants at multiple widths (400/1000/1200px)

**Key Implementation**: `src/components/lgtm-image.tsx:13-117`

### Content Collections System

Astro Content Collections manages LGTM image metadata with environment-based loader:

```typescript
// src/content.config.ts
const lgtmBasePath = GITHUB_ACTIONS
  ? "./src/__fixtures__/lgtm-sample"
  : "./lgtm-content/lgtm";

const lgtm = defineCollection({
  loader: glob({ pattern: "**/index.md", base: lgtmBasePath }),
  schema: z.object({
    color: z.enum(["white", "black"]),  // Text color for overlay
    image: z.string(),                   // Source image filename
    isDraft: z.boolean().default(false), // Publishing control
  }),
});
```

**Environment-Based Loading**:
- **Production**: Loads from `lgtm-content/lgtm/` (Git submodule)
- **CI/Testing**: Loads from `src/__fixtures__/lgtm-sample/` when `GITHUB_ACTIONS=true`

### URL Structure & API Routes

**Static Pages**:
- `/` (src/pages/[...page].astro) - Paginated gallery with infinite scroll (20 images per page)
- `/{page}` - Gallery page N (loaded via fetch for infinite scroll)
- `/{id}` (src/pages/[id].astro) - Detail page with format selector buttons

**Image APIs**:
- `/{id}.{format}` (src/pages/[id].[format].ts) - Default 800px image
- `/{id}-{size}.{format}` (src/pages/[id]-[size].[format].ts) - Custom size: 400|1000|1200
- `/api/og/default.png` - Default Open Graph image
- `/api/og/{id}.png` - Per-image Open Graph image
- `/api/favicon/*` - Dynamic favicon generation

All image responses include: `Cache-Control: public, max-age=31536000, immutable`

### Pagination & Infinite Scroll

**Implementation** (src/pages/[...page].astro):
- **Pagination**: Astro's `paginate()` function with `IMAGES_PER_PAGE = 20`
- **Shuffle**: Fisher-Yates shuffle applied to all entries at build time
- **Infinite Scroll**:
  - IntersectionObserver watches `#scroll-trigger` element
  - Triggers fetch 200px before reaching trigger (`rootMargin: "200px"`)
  - Minimum 500ms loading indicator for better UX
  - DOMParser parses fetched HTML, appends items to container
  - Non-first pages redirect to home if accessed directly (prevents broken deep links)

**Key Code**: src/pages/[...page].astro:362-484

### Private Content Submodule

**Critical**: The `lgtm-content/` directory is a Git submodule pointing to a private repository.

**Structure**:
```
lgtm-content/
├── lgtm/{ulid}/
│   ├── index.md      # Frontmatter: color, image, isDraft
│   └── {image}.jpg   # Source image
└── memo/             # Personal timestamped notes (not used by site)
```

**Deployment**: Local build and deploy via `wrangler pages deploy dist` (Cloudflare Pages).

### Progressive Image Loading

**Implementation Pattern**:
1. Generate 20x13px WebP placeholder using `getImage()` at build time
2. Render as blurred background (`filter: blur(36px)`) via inline style
3. Load full-resolution image with `<Picture>` component (AVIF → WebP → PNG fallback)
4. Fade transition (300ms) controlled by `.blur-load` CSS class
5. JavaScript detects image load and adds `.image-loaded` class

**Code Locations**:
- Gallery: src/pages/[...page].astro:39-48 (placeholder generation), 240-261 (CSS), 316-330 (JS)
- Detail: src/pages/[id].astro:31-36 (placeholder generation), 144-164 (CSS), 333-345 (JS)

### Design System

**CSS Framework**: kiso.css 1.2.3 - Minimal CSS framework
- Automatic light/dark mode via `prefers-color-scheme`
- Variables: `--c-bg`, `--c-text`, `--c-border`, `--c-text-emphasis`, etc.

**Layout**: Simple structure with Header, Main, Footer (src/layouts/layout.astro)

### Copy-to-Clipboard Feature

**Gallery** (src/pages/[...page].astro):
- Copy button on each image (hidden on desktop, visible on mobile)
- Event delegation: Container listens for `.copy-button` clicks
- Copies HTML with AVIF format: `<a href=".../{id}"><img src=".../{id}.avif" alt="LGTM!!" width="400" /></a>`

**Detail Page** (src/pages/[id].astro):
- Three format buttons: AVIF, WebP, PNG
- Each button copies HTML with selected format
- Visual feedback: Checkmark icon replaces text for 1 second

## TypeScript Configuration

- **Extends**: `astro/tsconfigs/strictest` (maximum type safety)
- **Path Alias**: `#/*` maps to `./src/*`
- **Module Resolution**: Astro handles `.astro` files with auto-generated types in `.astro/types.d.ts`

## Testing & Coverage

### Test Infrastructure

**Framework**: Vitest 4.0 with v8 coverage provider

**Test Files**:
- `src/__tests__/components/lgtm-image.test.tsx` - Image generation component tests
- `src/__tests__/pages/api-id-format.test.ts` - Default image API tests
- `src/__tests__/pages/api-id-size-format.test.ts` - Sized image API tests
- `src/__tests__/config/content.config.test.ts` - Content Collections config tests

**Coverage Results**:
```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|--------
All files          |     100 |       88 |     100 |     100
 components        |     100 |       80 |     100 |     100
  lgtm-image.tsx   |     100 |       80 |     100 |     100
 pages             |     100 |      100 |     100 |     100
  [id].[format].ts |     100 |      100 |     100 |     100
  [id]-[size].[format].ts | 100 | 100 | 100 | 100
```

**Coverage Configuration** (vitest.config.ts):
- Includes: `src/components/**/*.{ts,tsx}`, `src/pages/**/*.ts`, `scripts/**/*.ts`
- Excludes: Config files, fixtures, auxiliary features (SEO, favicon, OG images)
- Branch coverage 80% in lgtm-image.tsx due to:
  - Environment variable path switching (GITHUB_ACTIONS true/false)
  - Nullish coalescing fallbacks for Sharp metadata (defensive programming)

### Test Fixtures

For CI environments where lgtm-content is unavailable:
1. Set `GITHUB_ACTIONS=true` environment variable (auto-set in GitHub Actions)
2. System automatically switches to `src/__fixtures__/lgtm-sample/`
3. Contains minimal sample image for build validation

### Type Safety in Tests

Tests use double type assertion for partial APIContext mocks:
```typescript
const context = {
  params: { id: "...", format: "png" },
} as unknown as APIContext;
```

This pattern allows testing with minimal mock objects while maintaining type safety.

## Biome Configuration

**Key Overrides** (biome.json):
- `**/*.astro` files: Disabled `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports`
- Reason: Astro's frontmatter script handling conflicts with standard linting rules

## Release Workflow

**Versioning Scheme**: `YYYY.MM.DD[-N]` (date-based with optional suffix)

**Process** (scripts/release.ts):
1. Generate version from current date (`2025.12.28`)
2. Check for existing tags, increment suffix if needed (`2025.12.28-2`)
3. Create and force-push Git tag
4. Generate GitHub Release with comparison link to previous version
5. Return to original branch

## Critical Notes

### Environment Variables
```bash
NODE_ENV             # development | production (auto-set)
GITHUB_ACTIONS       # Auto-set in CI, triggers fixture mode
```

### Image Processing Performance
- Sharp configured with native libvips for high-performance processing
- Text rendering at 2x resolution (scale = 2) then downscaled with lanczos3 kernel for anti-aliasing
- Font size calculated dynamically: `Math.floor((renderWidth / 800) * 90)`

### Monorepo Structure
- pnpm workspace with root and `lgtm-content` packages
- `lgtm-content/` has its own package.json with Bun scripts
- Root project uses pnpm, utilities use Bun for speed

### Image Size Details
The image generation pipeline uses specific widths:
- **Default API** (`/{id}.{format}`): 800px width
- **Sized API** (`/{id}-{size}.{format}`): 400/1000/1200px width
- Gallery uses 1000px images (515px display width, 2x density)
- Detail page uses 1200px images

## Common Gotchas

1. **Missing LGTM Images**: Ensure `lgtm-content/` submodule is initialized and up-to-date
2. **Type Errors in .astro Files**: These are expected; Biome overrides disable checks
3. **Font Loading Errors**: BBHBartle-Regular.ttf must exist in `src/assets/`
4. **Build Failures**: Ensure `lgtm-content/` submodule is initialized before running `pnpm deploy`
5. **ULID Case Sensitivity**: Always use lowercase ULIDs (enforced by `pnpm id` script)
6. **Infinite Scroll on Build**: Pagination routes are pre-rendered at build time; infinite scroll fetches static HTML
7. **Default Image Size**: `/{id}.{format}` returns 800px, not 400px (common misconception)
8. **Test Coverage**: Branch coverage at 80-88% is acceptable; uncovered branches are defensive edge cases that rarely occur in practice
