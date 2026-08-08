# CLAUDE.md

`@kkhys/seo` — BaseSEO / OpenGraph / TwitterCard Astro primitives,
consumed as source by me, memo, lgtm (via thin app-local adapters in
`src/components/seo/`) and diary (directly in its layout).

## API notes

- `truncate.ts` holds the shared description clamping; the three
  components import it.
- `pathname.ts` normalizes `Astro.url.pathname` before it becomes a
  canonical / `og:url` value. Every app builds in file format, so Astro
  reports `/index.html` and `/privacy.html`; emitting those verbatim
  would contradict the extensionless URLs the sitemap advertises. me
  also imports it (`@kkhys/seo/pathname`) for nav active-state matching.
- `truncate.ts` and `pathname.ts` are the unit-tested modules
  (`pnpm test`); the `.astro` components have no tests.
- OpenGraph/TwitterCard image props are optional: omit `image` to emit no
  image block, and use `imageType` / `imageWidth` / `imageHeight` for
  non-1200×630-PNG images (diary passes variable-height JPEGs).
- All optional props are `| undefined` (`exactOptionalPropertyTypes`).

## Constraints

- `.astro` files cannot be imported from `.ts` (tsc does not resolve
  them); the reverse (`.astro` importing `truncate.ts`) is fine.
- Anything that renders a URL must go through `normalizePathname` — a raw
  `Astro.url.pathname` reintroduces the `.html` suffix.
- `check` runs tsc over the `.ts` sources only; the `.astro` components
  are type-checked by each consuming app's `astro check`.
- API changes ripple into four apps — grep consumers before changing
  props.
