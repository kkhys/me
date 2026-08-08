# CLAUDE.md

`@kkhys/og` — Satori-based OG image and favicon generation, consumed as
source by me, memo, lgtm, and diary.

## Exports

- `./favicon` — `createFaviconGenerators(gradient)`: five icon
  generators (SVG + PNGs) bound to one CSS gradient.
- `./handlers` — `createFaviconRoutes(gradient)`: a `[file].ts` route
  factory whose `getStaticPaths` emits paths only outside PROD, so
  favicons are served dynamically in dev and shipped as static files in
  production (prod builds emit no favicon routes at all).
  `createOgResponse(generator)`: production OG-image route handler.
- `./og` — `createSiteOgImage`: the fixed-layout site OG card. me and
  lgtm keep bespoke Satori layouts app-local instead.

## Notes

- `handlers.test.ts` covers the route table, headers, PNG signature, and
  prod emptiness; `check`/`test` run in recursive CI.
- Static favicon assets in each app's `public/` are generated from these
  generators (see diary's git history for a generation example); the dev
  routes exist for previewing changes.
- `astro` is a peer dependency; `react`/`satori`/`sharp` are real
  dependencies of this package, so consumers need not declare them.
