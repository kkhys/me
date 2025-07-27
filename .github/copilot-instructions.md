# GitHub Copilot Instructions

This file provides specific guidance for GitHub Copilot when working with this repository.

## Project Context

This is a personal blog built with:
- **Astro 5** with React islands
- **TailwindCSS v4** with `@theme` directive
- **TypeScript** with strict configuration
- **Feature-based architecture** in `src/features/`
- **File-based CMS** with Astro Content Collections

## Code Style & Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer type inference over explicit typing when obvious
- Use `#/*` path aliases for imports
- Implement proper error handling with Result types when applicable

### React Components
- Use functional components with hooks
- Implement proper TypeScript props interfaces
- Follow naming convention: PascalCase for components
- Use React islands pattern for interactivity

### Styling
- Use TailwindCSS v4 with `@theme` directive
- Avoid inline styles, prefer utility classes
- Use semantic class names for complex components
- Follow mobile-first responsive design

## File Organization

### Directory Structure
- `src/features/` - Feature-based modules
- `src/content/` - Blog posts and content
- `src/lib/` - Shared utilities and plugins
- `src/components/` - Reusable UI components

### Content Management
- Blog posts in `/content/blog/YYYY-MM-DD/index.mdx`
- Images co-located with content files
- Use Zod schemas for content validation

## Development Preferences

### Code Generation
- Generate comprehensive JSDoc comments for all functions
- Include usage examples in documentation
- Implement proper error boundaries for React components
- Add TypeScript interfaces for all props and data structures

### Testing Approach
- Focus on integration tests over unit tests
- Test user-facing functionality
- Mock external API calls (GitHub, Spotify)
- Verify content rendering and routing

### Performance Considerations
- Optimize for Core Web Vitals
- Use lazy loading for images
- Implement proper caching strategies
- Consider bundle size impact

## Language-Specific Guidelines

### Japanese Content Support
- Use BudouX for Japanese text line breaking
- Support bilingual content (English slugs, Japanese labels)
- Handle Japanese typography properly in CSS

### API Integration
- Cache API responses with Redis (Upstash)
- Implement proper rate limiting
- Handle API failures gracefully
- Use environment variables for secrets

## Build & Deployment

### Commands to Use
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm check` - TypeScript and Astro validation
- `pnpm lint:fix` - Auto-fix code issues

### Quality Checks
- Run `pnpm check` before suggesting code
- Ensure TypeScript compilation passes
- Verify Biome linting rules compliance
- Test content schema validation

## Suggestions & Improvements

When generating code:
1. **Always suggest performance optimizations**
2. **Identify opportunities for code reuse**
3. **Recommend better error handling patterns**
4. **Propose accessibility improvements**
5. **Suggest SEO enhancements when relevant**

## Avoid These Patterns

- Don't use `any` type in TypeScript
- Avoid direct DOM manipulation in React
- Don't hardcode API keys or secrets
- Avoid creating new files when editing existing ones is sufficient
- Don't ignore TypeScript errors or warnings
