# LGTM

<a href="https://lgtm.kkhys.me/01kdg0h1dnmjgpqw8rxwmbakeh"><img src="https://lgtm.kkhys.me/01kdg0h1dnmjgpqw8rxwmbakeh.avif" alt="LGTM!!" width="400" /></a>

A curated collection of LGTM images for GitHub Pull Requests. High-performance image delivery with multiple formats, progressive loading, and infinite scroll pagination.

**Live**: [lgtm.kkhys.me](https://lgtm.kkhys.me)

## Overview

LGTM generates and serves optimized review approval images with dynamic text overlay rendering. Built on Astro with server-side image processing, delivering AVIF/WebP/PNG formats with aggressive caching strategies.

## Browser Extension

**[LGTM Chrome Extension](https://github.com/kkhys/lgtm-chrome-extension)** – One-click LGTM image insertion for GitHub code reviews.

Simply click the extension icon while browsing GitHub, and a random LGTM image is automatically copied to your clipboard as ready-to-paste HTML. The extension activates exclusively on GitHub domains with visual feedback (checkmark badge) and requires minimal permissions for privacy.

**Key Features:**
- One-click operation with GitHub-only activation
- Random image selection from the full gallery
- Instant clipboard copy with AVIF format
- Privacy-focused with minimal required permissions
- Lightweight design (< 50KB total)

**Status:** Currently available via manual installation. Chrome Web Store publication coming soon.

**Get it:** [GitHub Repository](https://github.com/kkhys/lgtm-chrome-extension) | [Releases](https://github.com/kkhys/lgtm-chrome-extension/releases)

## Features

- **Dynamic Image Generation** – Server-rendered text overlays using Satori + Sharp
- **Multi-Format Delivery** – AVIF, WebP, PNG with automatic format negotiation
- **Progressive Loading** – Low-res WebP placeholder blur with smooth transitions
- **Infinite Scroll** – Paginated gallery with IntersectionObserver-based loading
- **Responsive Images** – Multiple size variants (400/1000/1200px) with 2x density support
- **One-Click Markdown** – Copy-to-clipboard with format selection (AVIF/WebP/PNG)
- **SEO Optimized** – Complete Open Graph, Twitter Card, JSON-LD, PWA manifest
- **Edge Cached** – Immutable responses with max-age 1 year

## Tech Stack

**Core**
- Astro 5.16 – Static site generation with Content Collections and pagination
- TypeScript 5.9 – Strictest compiler mode
- React 19 – Image generation components (JSX for Satori)

**Image Processing**
- Satori 0.18 – SVG/text rendering with custom fonts (BBHBartle-Regular)
- Sharp 0.34 – High-performance image manipulation (libvips)

**Styling**
- kiso.css 1.2 – Minimal CSS framework
- Custom design system with light/dark mode

**Infrastructure**
- Vercel – Edge deployment
- pnpm 10.26 – Workspace monorepo
- Biome 2.3 – Linting + formatting

**Testing**
- Vitest 4.0 – Unit testing framework
- Coverage: 100% statements, 88% branch, 100% functions

## Architecture

### Image Generation Pipeline

```
1. Load source image from private-content submodule
2. Resize to target width (Sharp)
3. Render "LGTM" text as SVG (Satori, 2x resolution)
4. Composite text overlay with 85% opacity (blend mode: over)
5. Convert to AVIF/WebP/PNG
6. Serve with immutable cache headers
```

**Implementation**: `src/components/lgtm-image.tsx`

### URL Structure

```
/                        → Gallery (paginated, 20 images per page)
/{page}                  → Gallery page N (infinite scroll target)
/{id}                    → Detail page with format selector
/{id}.{format}           → 800px image (default endpoint)
/{id}-{size}.{format}    → Custom size (400|1000|1200)
/api/og/default.png      → Default Open Graph image
/api/og/{id}.png         → Per-image Open Graph image
/api/favicon/*           → Dynamic favicon generation
```

### Content Collections

Astro Content Collections with environment-based loader:

```typescript
// src/content.config.ts
const lgtmBasePath = GITHUB_ACTIONS
  ? "./src/__fixtures__/lgtm-sample"
  : "./private-content/lgtm";

const lgtm = defineCollection({
  loader: glob({ pattern: "**/index.md", base: lgtmBasePath }),
  schema: z.object({
    color: z.enum(["white", "black"]),  // Text color
    image: z.string(),                   // Source image filename
    isDraft: z.boolean().default(false), // Publishing control
  }),
});
```

### Private Content Submodule

Images stored in private Git submodule with ULID-based identifiers:

```
private-content/lgtm/{ulid}/
  ├── index.md           # Frontmatter: color, image, isDraft
  └── {filename}.jpg     # Source image
```

### Pagination & Infinite Scroll

- Gallery shows 20 images per page (IMAGES_PER_PAGE constant)
- Fisher-Yates shuffle on build for randomized display order
- IntersectionObserver triggers next page load 200px before scroll end
- Minimum 500ms loading indicator for better UX
- Non-first pages redirect to home if accessed directly

## Development

### Prerequisites

- Node.js 24.12 (via Volta)
- pnpm 10.26
- Bun (for utility scripts in private-content/)

### Setup

```bash
# Clone with submodules
git clone --recursive https://github.com/kkhys/lgtm.git

# Install dependencies
pnpm install

# For private-content access, set:
export GITHUB_ACCESS_TOKEN=ghp_xxx
```

### Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # Production build to ./dist
pnpm preview      # Preview production build
pnpm check        # Type checking (Astro + tsc)
pnpm lint         # Biome linting
pnpm lint:fix     # Auto-fix issues
pnpm test         # Run unit tests (Vitest)
pnpm coverage     # Test coverage report
pnpm all          # Full validation (build + check + lint:fix + test + coverage)
```

### Utility Scripts

```bash
# Generate lowercase ULID for new images
cd private-content
pnpm id

# Create timestamped memo
pnpm memo

# Create release tag (date-based versioning)
pnpm release [--dry-run]
```

## Performance

### Optimization Strategies

1. **Progressive Enhancement**
   - 20x13px WebP placeholder with CSS blur filter (36px)
   - Full image fades in on load (300ms transition)
   - `loading="eager"` on detail page, lazy on gallery

2. **Format Priorities** (via `<Picture>` component)
   - AVIF: Best compression (~50% smaller than WebP)
   - WebP: Broad browser support
   - PNG: Lossless fallback

3. **Build-Time Processing**
   - Static generation of all image variants at build time
   - Pre-rendered text overlays with Satori
   - HTML/CSS/JS compression via @playform/compress

4. **Runtime Caching**
   - `Cache-Control: public, max-age=31536000, immutable`
   - CDN edge caching on Vercel
   - Static assets served from Vercel Edge Network

5. **Infinite Scroll**
   - Fetch next page in background
   - Pre-connect and load images on demand
   - Smooth transition with loading states

## Deployment

### Vercel Configuration

```json
{
  "installCommand": "pnpm vercel-install",
  "git": {
    "deploymentEnabled": {
      "renovate/*": false
    }
  }
}
```

Custom install script (`scripts/vercel-submodule-workaround.sh`) handles private submodule authentication.

### Environment Variables

```bash
GITHUB_ACCESS_TOKEN    # Required: Private submodule access
NODE_ENV              # development | production (auto-set)
GITHUB_ACTIONS        # CI detection (auto-set, switches to fixtures)
```

### CI/CD

GitHub Actions uses fixture data (`src/__fixtures__/lgtm-sample/`) to avoid private submodule dependency in public CI.

## Project Structure

```
lgtm/
├── src/
│   ├── assets/               # Static assets (fonts, images)
│   ├── components/
│   │   ├── icon/            # SVG icon components
│   │   ├── seo/             # SEO meta components
│   │   ├── lgtm-image.tsx   # Image generation logic
│   │   └── *.astro          # UI components
│   ├── config/              # Constants and configuration
│   ├── layouts/             # Page layouts
│   ├── pages/
│   │   ├── [...page].astro  # Paginated gallery
│   │   ├── [id].astro       # Detail page
│   │   ├── [id].[format].ts # Default image API
│   │   ├── [id]-[size].[format].ts # Sized image API
│   │   └── api/             # OG images and favicons
│   ├── styles/              # Global CSS
│   ├── content.config.ts    # Content Collections config
│   ├── __fixtures__/        # Test fixtures for CI
│   └── __tests__/           # Unit tests (Vitest)
│       ├── components/      # Component tests
│       ├── pages/           # API route tests
│       └── config/          # Configuration tests
├── private-content/         # Git submodule (private)
├── scripts/                 # Build and release scripts
├── vitest.config.ts         # Vitest configuration
└── public/                  # Static public assets
```

## Release Management

Automated versioning with date-based tags:

```bash
pnpm release
# Creates tag: YYYY.MM.DD[-N]
# Generates GitHub release with changelog comparison
```

**Process**:
1. Generate version from current date
2. Check for existing tags, increment suffix if needed
3. Create and force-push Git tag
4. Generate GitHub Release via API
5. Return to original branch

## License

MIT © [Keisuke Hayashi](https://github.com/kkhys)

---

Built with precision. Served with speed.
