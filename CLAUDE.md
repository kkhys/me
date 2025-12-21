# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LGTM is an Astro-based static site that generates and serves optimized "LGTM" images for GitHub Pull Requests. The core functionality centers around server-side image processing using Satori for text rendering and Sharp for image manipulation.

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
pnpm all          # Run build + check + lint:fix (full validation)
```

### Deployment & Release
```bash
pnpm vercel-install   # Custom install for Vercel (handles submodule)
pnpm release          # Create version tag and GitHub release
pnpm release --dry-run  # Preview release without executing
```

### Private Content Management
```bash
cd private-content
pnpm id           # Generate lowercase ULID for new images
pnpm memo         # Create timestamped memo entry
```

## Architecture

### Image Generation Pipeline

The core innovation is **dynamic text overlay generation** on user-provided images:

1. **Source Images**: Stored in `private-content/lgtm/{ulid}/` with frontmatter metadata
2. **Text Rendering**: Satori generates SVG "LGTM" text at 2x resolution with custom font (BBHBartle-Regular)
3. **Compositing**: Sharp blends text overlay (85% opacity) onto resized source image
4. **Multi-Format Output**: Generates PNG/AVIF/WebP variants at multiple sizes (400/1000/1200px)

**Key Implementation**: `src/components/lgtm-image.tsx:13-117`

### Content Collections System

Astro Content Collections manages LGTM image metadata:

```typescript
// src/content.config.ts
schema: {
  color: "white" | "black",  // Text color for overlay
  image: string,             // Source image filename
  isDraft: boolean           // Publishing control
}
```

**Environment-Based Loading**:
- **Production**: Loads from `private-content/lgtm/` (Git submodule)
- **CI/Testing**: Loads from `src/__fixtures__/lgtm-sample/` (GITHUB_ACTIONS env var)

### URL Structure & API Routes

**Static Pages**:
- `/` - Gallery with randomized order (Fisher-Yates shuffle)
- `/{id}` - Detail page with format selector

**Image APIs**:
- `/{id}.{format}` - Default 400px image (src/pages/[id].[format].ts)
- `/{id}-{size}.{format}` - Custom size: 400|1000|1200 (src/pages/[id]-[size].[format].ts)
- `/api/og/default.png` - Open Graph image
- `/api/favicon/*` - Dynamic favicon generation (dev only)

All image responses include: `Cache-Control: public, max-age=31536000, immutable`

### Private Content Submodule

**Critical**: The `private-content/` directory is a Git submodule pointing to a private repository.

**Structure**:
```
private-content/
├── lgtm/{ulid}/
│   ├── index.md      # Frontmatter: color, image, isDraft
│   └── {image}.jpg   # Source image
└── memo/             # Personal timestamped notes (not used by site)
```

**Vercel Deployment**: Custom `scripts/vercel-submodule-workaround.sh` handles authentication via `GITHUB_ACCESS_TOKEN` environment variable.

### Progressive Image Loading

**Implementation Pattern** (src/pages/index.astro:28-38, 207-254):
1. Generate 20x13px WebP placeholder using `getImage()`
2. Render as blurred background via inline style
3. Load full-resolution image with `<Picture>` component
4. Fade transition controlled by `.blur-load` CSS class
5. JavaScript detects image load and adds `.image-loaded` class

This pattern appears on both gallery (index.astro) and detail ([id].astro) pages.

### Design System

**Color Scheme**: Custom `uchu.css` system with CSS variables
- Automatic light/dark mode via `prefers-color-scheme`
- Variables: `--c-bg`, `--c-text`, `--c-border`, etc.

**Layout**: Body uses CSS Grid with three rows: `[top] header [main-start] content [main-end] footer [bottom]`

## TypeScript Configuration

- **Extends**: `astro/tsconfigs/strictest` (maximum type safety)
- **Path Alias**: `#/*` maps to `./src/*`
- **Module Resolution**: Astro handles `.astro` files with auto-generated types in `.astro/types.d.ts`

## Testing & Fixtures

For CI environments where private-content is unavailable:
1. Set `GITHUB_ACTIONS=true` environment variable
2. System automatically switches to `src/__fixtures__/lgtm-sample/`
3. Contains minimal sample image for build validation

## Biome Configuration

**Key Overrides** (biome.json):
- `**/*.astro` files: Disabled `useConst`, `useImportType`, `noUnusedVariables`, `noUnusedImports`
- Reason: Astro's frontmatter script handling conflicts with standard linting

## Release Workflow

**Versioning Scheme**: `YYYY.MM.DD[-N]` (date-based with optional suffix)

Process (scripts/release.ts):
1. Generate version from current date
2. Check for existing tags, increment suffix if needed
3. Create and force-push Git tag
4. Generate GitHub Release with comparison link to previous version
5. Return to original branch

## Critical Notes

### Environment Variables
```bash
GITHUB_ACCESS_TOKEN   # Required: Private submodule access
NODE_ENV             # development | production
GITHUB_ACTIONS       # Auto-set in CI, triggers fixture mode
```

### Image Processing Performance
- Sharp is configured with `ignoredBuiltDependencies` in pnpm-workspace.yaml
- Uses native libvips for high-performance image processing
- Text rendering at 2x resolution then downscaled for anti-aliasing

### Monorepo Structure
- pnpm workspace with root and `private-content` packages
- `private-content/` has its own package.json with Bun scripts
- Root project uses pnpm, utilities use Bun for speed

## Common Gotchas

1. **Missing LGTM Images**: Ensure `private-content/` submodule is initialized and up-to-date
2. **Type Errors in .astro Files**: These are expected; Biome overrides disable checks
3. **Font Loading Errors**: BBHBartle-Regular.ttf must exist in `src/assets/`
4. **Build Failures on Vercel**: Verify `GITHUB_ACCESS_TOKEN` is set in environment variables
5. **ULID Case Sensitivity**: Always use lowercase ULIDs (enforced by `pnpm id` script)
