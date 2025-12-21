# LGTM

A curated collection of LGTM images for GitHub Pull Requests. High-performance image delivery with multiple formats and progressive loading.

**Live**: [lgtm.kkhys.me](https://lgtm.kkhys.me)

## Overview

LGTM generates and serves optimized review approval images with dynamic text overlay rendering. Built on Astro with server-side image processing, delivering AVIF/WebP/PNG formats with aggressive caching strategies.

## Features

- **Dynamic Image Generation** – Server-rendered text overlays using Satori + Sharp
- **Multi-Format Delivery** – AVIF, WebP, PNG with automatic format negotiation
- **Progressive Loading** – Low-res placeholder blur with smooth transitions
- **Responsive Images** – Multiple size variants (400/1000/1200px) with 2x density support
- **One-Click Markdown** – Copy-to-clipboard with format selection
- **SEO Optimized** – Complete Open Graph, JSON-LD, PWA manifest
- **Edge Cached** – Immutable responses with max-age 1 year

## Tech Stack

**Core**
- Astro 5.16 – Static site generation with Content Collections
- TypeScript – Strictest compiler mode
- React 19 – Image generation components

**Image Processing**
- Satori 0.18 – SVG/text rendering with custom fonts
- Sharp 0.34 – High-performance image manipulation (libvips)

**Styling**
- kiso.css – Minimal CSS framework
- Custom design system with light/dark mode

**Infrastructure**
- Vercel – Edge deployment
- pnpm – Workspace monorepo
- Biome – Linting + formatting

## Architecture

### Image Generation Pipeline

```
1. Load source image from private-content
2. Resize to target width (Sharp)
3. Render "LGTM" text as SVG (Satori, 2x resolution)
4. Composite text overlay with 85% opacity
5. Convert to AVIF/WebP/PNG
6. Serve with immutable cache headers
```

### URL Structure

```
/{id}.{format}           → 400px image (default)
/{id}-{size}.{format}    → Custom size (400|1000|1200)
/{id}                    → Detail page with format selector
```

### Content Management

Images stored in private Git submodule with ULID-based identifiers:

```
private-content/lgtm/{ulid}/
  ├── index.md           # Frontmatter: color, image, isDraft
  └── {filename}.jpg     # Source image
```

## Development

### Prerequisites

- Node.js 24.12 (via Volta)
- pnpm 10.26
- Bun (for utility scripts)

### Setup

```bash
# Clone with submodules
git clone --recursive https://github.com/kkhys/lgtm.git

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env
# Add GITHUB_ACCESS_TOKEN for private-content access
```

### Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm check        # Type checking (Astro + tsc)
pnpm lint         # Biome linting
pnpm lint:fix     # Auto-fix issues
pnpm all          # Full validation pipeline
```

### Scripts

```bash
# Generate ULID for new images
cd private-content
pnpm id

# Create timestamped memo
pnpm memo

# Create release tag
pnpm release [--dry-run]
```

## Performance

### Optimization Strategies

1. **Progressive Enhancement**
   - 20x13px WebP placeholder with blur filter
   - Full image fades in on load

2. **Format Priorities**
   - AVIF: Best compression (~50% smaller than WebP)
   - WebP: Broad browser support
   - PNG: Lossless fallback

3. **Build-Time Processing**
   - Static generation of all image variants
   - Pre-rendered text overlays
   - Compressed output via @playform/compress

4. **Runtime Caching**
   - `Cache-Control: public, max-age=31536000, immutable`
   - CDN edge caching on Vercel

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

Custom install script handles private submodule authentication using `GITHUB_ACCESS_TOKEN`.

### Environment Variables

```bash
GITHUB_ACCESS_TOKEN    # Private submodule access
NODE_ENV              # development | production
GITHUB_ACTIONS        # CI detection (uses fixtures)
```

## Project Stats

- **Total Lines**: ~1,570 (TypeScript + Astro)
- **Image Variants**: 3 formats × 3 sizes × N images
- **Bundle Size**: Optimized with Astro's zero-JS default
- **Lighthouse**: 100/100/100/100 (Performance/Accessibility/Best Practices/SEO)

## Release Management

Automated versioning with date-based tags:

```bash
pnpm release
# Creates tag: YYYY.MM.DD[-N]
# Generates GitHub release with changelog comparison
```

## License

MIT © [Keisuke Hayashi](https://github.com/kkhys)

---

Built with precision. Served with speed.
