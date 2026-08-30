# CLAUDE.md

`@kkhys/search` — the Pagefind search dialog shared by me and memo,
consumed as source (no build step).

- `dialog.astro` — the command-palette shell: field, close button, status
  line, results list, and the shared CSS (open/close transitions, light
  dismiss look). Props: `id`, `label`, `placeholder`. Slots: `filters`
  (optional chips under the field) and `template` (the app's
  `<template class="search-result-template">` for one result row).
- `dialog-setup` (`src/dialog-setup.ts`) — `mountSearchDialog(id, options)`
  wires Pagefind loading and warm-up, the runner, keyboard handling (⌘K /
  Ctrl+K, arrows, Escape, IME composition), invoker and light-dismiss
  fallbacks. The app supplies `renderResult(fragment, template)` and,
  optionally, `searchOptions()` for filters; it gets back `{ input,
runSearch, openDialog }`. `requireElement` / `isHTMLElement` /
  `renderExcerpt` are exported for renderers.
- `runner` — `createSearchRunner(deps, { maxResults, debounceMs, noun })`:
  stale-request discarding, partial fragment failures, and the status
  strings (`noun` is 記事 / メモ).
- `keyboard`, `excerpt`, `query`, `types` — the pure helpers and the
  hand-written Pagefind browser types.

App-local pieces stay in each app's `src/features/search/`: `config.ts`
(dialog id, bundle path, meta keys), `meta.ts` (data-pagefind-* attribute
builders), me's `buildSearchOptions` (category filter), and the result-row
markup + CSS. `vitest run` covers runner / keyboard / excerpt / query.
