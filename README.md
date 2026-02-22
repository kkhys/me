# Memo

A simple memo posting site that displays short memos (max 500 characters) in a social media thread-like layout.

**Live Site**: [memo.kkhys.me](https://memo.kkhys.me)

## Features

- Short memo posts (up to 500 characters)
- Up to 4 images per post
- Light/dark mode support
- Responsive design
- Fast static site generation with Astro
- Optimized images with AVIF format

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Language**: TypeScript (strictest mode)
- **Styling**: CSS (kiso.css + custom properties)
- **Testing**: Vitest
- **Lint/Format**: Biome
- **Package Manager**: pnpm
- **Deployment**: Vercel

See `package.json` for specific version requirements.

## Setup

### Prerequisites

See `package.json` for required Node.js and pnpm versions (managed via Volta).

### Installation

```bash
# Clone the repository
git clone https://github.com/kkhys/memo.git
cd memo

# Install dependencies
pnpm install
```

### Content Setup

This project manages content in a separate repository (Git submodule).

**Development**: Works without submodule (uses fixture data)

**Production Build**: Requires `memo-content/` submodule

```bash
# Initialize submodule
git submodule update --init --recursive
```

## Development

```bash
# Start development server
pnpm dev

# Open http://localhost:4321 in browser
```

### Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm check        # Type checking
pnpm lint         # Run linter
pnpm lint:fix     # Auto-fix lint issues
pnpm test         # Run tests
pnpm coverage     # Generate coverage report
pnpm all          # Run all checks (build + check + lint:fix + test + coverage)
```

## Content Management

### Creating Memos

Memos are placed in the `memo-content/memo/` directory.

**Directory Structure**:
```
memo-content/memo/
└── <timestamp_id>/          # e.g., 20251001_204021
    ├── index.md              # Memo content
    ├── 01.jpg                # Image 1 (optional)
    ├── 02.jpg                # Image 2 (optional)
    └── ...                   # Up to 4 images
```

**index.md Format**:
```markdown
---
id: 01k6fs5j48ep20vqcvvgh4r4c2  # ULID format
createdAt: 2025-10-01 20:40:21
images:                          # Optional (max 4)
  - 01.jpg
  - 02.jpg
isPublished: true                # Publication status
author: Keisuke Hayashi
---

Write your memo content here (max 500 characters)
```

### Constraints

- **Character Limit**: Max **499 characters** (validated at build time)
- **Image Limit**: Max **4 images** per post
- **Image Formats**: JPG and PNG only

## Deployment

For Vercel deployment, use the submodule workaround script:

```bash
pnpm vercel-install
```

### Required Environment Variables

- `GITHUB_ACCESS_TOKEN`: For accessing private submodule (set in Vercel)

## Project Structure

```
memo/
├── src/
│   ├── components/       # UI components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page files
│   │   ├── index.astro   # Memo list
│   │   └── [id].astro    # Memo detail
│   ├── utils/            # Utility functions
│   ├── lib/              # Remark plugins, etc.
│   └── styles/           # Global styles
├── memo-content/      # Content (Git submodule)
├── scripts/              # Build scripts
└── CLAUDE.md             # AI development assistance doc
```

For detailed architecture, see [CLAUDE.md](./CLAUDE.md).

## CI/CD

GitHub Actions runs automated tests and build validation:

- Triggered on push and pull requests
- Build, type checking, linting, testing, coverage

Renovate for automated dependency updates:

- DevDependencies: All versions auto-merged
- Dependencies: Minor/patch versions auto-merged

## License

MIT License - See [LICENSE.md](./LICENSE.md) for details

## Author

Keisuke Hayashi ([@kkhys](https://github.com/kkhys))
