---
paths:
  - "apps/*/src/**/*.astro"
  - "apps/*/src/**/*.css"
  - "apps/*/src/**/*.tsx"
  - "apps/*/src/**/*.html"
  - "packages/ui/**"
  - "packages/styles/**"
---

# Design system

Every UI change follows the kkhys design system: `apps/design`
(design.kkhys.me). The site renders the real sources at build time, so
those sources are the reference — read them, not the rendered pages.

| Question                                                       | Read                                                                    |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Color, type scale, spacing, radius, shadow, focus ring         | `packages/styles/tokens.css` (`--c-*`, `--fs-*`, `--space-*`, `--ring`) |
| A component or class that may already exist                    | `packages/ui/CLAUDE.md`, `packages/styles/components.css` (`.btn`)      |
| How the apps do motion, links, images, focus, dark mode, head  | `apps/design/src/data/conventions.ts` (rule / values / evidence)        |
| Contrast, focus, landmarks, alt text, the new-screen checklist | `apps/design/src/data/accessibility.ts`                                 |
| An icon                                                        | `packages/ui/src/icons/*.svg` (Lucide; `@kkhys/ui/icons/<name>.svg`)    |

Principles (`apps/design/src/pages/index.astro`): hairline `--c-border`
and whitespace instead of cards and shadows; uchu only through the
semantic `--c-*` tokens; theming through `light-dark()` in the token, never
a media-query branch; body column `--content-width` (42rem); plain CSS in
cascade layers; small, dense type (`--fs-sm` body, `--fs-xs` notes).

Before editing:

1. Read the rows above that the change touches. A value in the diff is
   either a token from `tokens.css`, an app-local token declared in that
   app's `tokens` layer, or a documented deviation in `conventions.ts`.
2. Reach for `@kkhys/ui` and `components.css` before writing a new
   component; a new shared one goes into `packages/ui` with a demo on
   `apps/design/src/components/demo.astro`.
3. A new cross-app pattern, or an app departing from one, lands in
   `conventions.ts` (evidence as `path:line`, `deviation` when departing)
   or `accessibility.ts`. Run `pnpm --filter @kkhys/design test:vrt:update`
   after an intended visual change to the shared packages.

Done when every new value and component in the diff traces to one of the
files above, and the design site still builds (`pnpm build:design`).
