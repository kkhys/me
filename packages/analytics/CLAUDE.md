# CLAUDE.md

`@kkhys/analytics` — Umami tracker script component, consumed as source by
six published apps (me, memo, lgtm, diary, trends, art); design does not
render it.

## API notes

- `umami.astro` renders a preconnect hint plus the tracker script for the
  self-hosted Umami instance (`analytics.kkhys.me`, the default of the
  `host` prop). Required props: `websiteId` and `domains` (comma-separated
  allowlist).
- The tracker only renders in production builds (`import.meta.env.PROD`),
  so dev servers never send events; `data-domains` additionally guards
  non-production hostnames (e.g. `*.pages.dev` previews).
  `data-exclude-search="true"` strips query strings from tracked URLs, so
  a search dialog's `?q=` never reaches the dashboard.
- Website IDs are public (they ship in the served HTML), so apps hardcode
  them at the call site in their root layout.

## Constraints

- No build step, no `.ts` sources, no scripts — the component is
  type-checked by each consuming app's `astro check`.
- Custom events stay app-local: add `data-umami-event` attributes in the
  consuming app (see apps/me for examples); this package only injects the
  tracker.
