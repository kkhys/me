**[kkhys.me](https://kkhys.me)**

My personal website powered by [Astro](https://astro.build).

<br>

<samp>Code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images
are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>
CC BY-NC-SA 4.0</a></samp>.

---

## Project Stats

![project stats](https://repobeats.axiom.co/api/embed/680a2ea2bfe127bcc8a58c668fc06635284db949.svg)

---

## Project Overview

This is a modern, full-featured personal website and blog platform built with cutting-edge web technologies. The project showcases advanced frontend architecture patterns, comprehensive content management capabilities, and seamless integration with external services, all while maintaining exceptional performance and user experience.

## Features

- **Static Site Generation** with hybrid rendering capabilities using Astro 5
- **Type-safe Development** with TypeScript strict mode and Zod schema validation
- **Modern Styling** using TailwindCSS v4 with CSS-first approach
- **Content Management** via MDX files with hierarchical tagging system
- **Japanese Language Support** with BudouX integration for natural line breaking
- **Full-text Search** powered by Pagefind with automatic indexing
- **External API Integration** for GitHub contributions and Spotify playback status
- **Performance Optimization** including image processing, caching, and prefetching strategies
- **Accessibility Compliance** following WCAG 2.1 standards
- **Progressive Web App** capabilities with offline functionality

## Architecture

### Core Technologies

- [Astro 5](https://astro.build) - Static site generator with island architecture
- [React 19](https://react.dev) - Component library for interactive elements
- [TypeScript 5](https://www.typescriptlang.org) - Type safety with strictest configuration
- [TailwindCSS v4](https://tailwindcss.com) - Utility-first CSS framework
- [pnpm](https://pnpm.io) - Fast, disk space efficient package manager

### Content System

The content management system is built around file-based storage with strict schema validation:

- **MDX Format** - Rich content with embedded React components
- **Date-based Organization** - Content stored in `/content/blog/YYYY-MM-DD/` structure
- **Hierarchical Categories** - Four main categories (Tech, Life, Object, DIY) with scoped tags
- **Build-time Validation** - Zod schemas prevent invalid content configurations
- **Automated Creation** - CLI tool for generating new blog posts with proper metadata

### External Integrations

- **GitHub GraphQL API** - Real-time contribution activity visualization
- **Spotify Web API** - Current playing track and listening history display
- **Upstash Redis** - Distributed caching for API responses
- **Mastodon** - Social media feed integration

## Development

### Prerequisites

- Node.js 22.17.1 or later
- pnpm 10.14.0 or later

### Installation

```bash
git clone https://github.com/kkhys/me.git
cd me
pnpm install
```

### Development Server

```bash
pnpm dev
```

The development server will start at `http://localhost:4321` with hot module reloading enabled.

### Available Scripts

| Command             | Description                               |
|---------------------|-------------------------------------------|
| `pnpm dev`          | Start development server with hot reload  |
| `pnpm build`        | Production build for Vercel deployment    |
| `pnpm build:node`   | Standalone Node.js build                  |
| `pnpm preview`      | Preview production build locally          |
| `pnpm check`        | Run Astro check and TypeScript validation |
| `pnpm lint`         | Code quality checks with Biome            |
| `pnpm lint:fix`     | Auto-fix formatting and linting issues    |
| `pnpm create:entry` | Interactive blog post creation tool       |
| `pnpm load-test`    | Performance testing with k6               |

### Content Creation

Create new blog posts using the interactive CLI:

```bash
pnpm create:entry
```

This will guide you through creating a new post with proper frontmatter, directory structure, and initial content template.

## Custom Markdown Features

### Remark Plugins

- **Link Cards** - Automatic rich preview generation for bare URLs
- **Video Blocks** - Custom syntax for embedded video content
- **Alert Blocks** - GitHub-style callout blocks for important information
- **Enhanced Footnotes** - Improved formatting and navigation

### Rehype Plugins

- **Japanese Text Processing** - Natural line breaking with BudouX
- **Search Indexing** - Automatic Pagefind index generation
- **Custom Anchors** - Enhanced heading links with custom IDs
- **Mermaid Diagrams** - Full diagram support with theme customization

## Performance

### Optimization Strategies

- **Image Processing** - Sharp-based optimization with responsive layouts
- **Code Splitting** - Automatic bundle optimization
- **Prefetching** - Viewport-based resource prefetching
- **Caching** - Multi-layer caching with Redis and CDN
- **Critical CSS** - Above-the-fold optimization

### Load Testing

The project includes comprehensive performance testing using k6:

```bash
# Basic load testing
pnpm load-test

# API endpoint testing
pnpm load-test:api

# Stress testing
pnpm load-test:stress
```

## Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment with serverless functions:

```bash
pnpm build
```

### Self-hosted

For self-hosted deployment, use the Node.js standalone build:

```bash
pnpm build:node
pnpm preview
```

### Environment Variables

Required environment variables for full functionality:

```bash
GITHUB_ACCESS_TOKEN=          # GitHub API access
SPOTIFY_CLIENT_ID=            # Spotify API credentials
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
UPSTASH_REDIS_REST_URL=       # Redis caching
UPSTASH_REDIS_REST_TOKEN=
```

## Code Quality

### Linting and Formatting

The project uses Biome for consistent code quality:

- **Strict TypeScript** configuration with custom rules
- **Automated formatting** with space indentation
- **Custom overrides** for Astro-specific patterns
- **Git integration** with pre-commit hooks

### Testing

- **Type checking** with `astro check` and TypeScript compiler
- **Performance testing** with k6 load testing framework
- **Bundle analysis** for dependency optimization

## Contributing

This is a personal website project, but contributions for bug fixes and improvements are welcome. Please ensure all tests pass and follow the existing code style.

## Browser Support

- **Modern browsers** with ES2022 support
- **Progressive enhancement** ensures core functionality without JavaScript
- **Mobile optimization** with touch-friendly interfaces
- **Accessibility** following WCAG 2.1 guidelines

## License

Code is licensed under [MIT](./LICENSE). Content and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
