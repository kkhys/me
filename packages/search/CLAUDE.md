# CLAUDE.md

`@kkhys/search` — the Pagefind search dialog shared by me, memo, and
design, consumed as source (no build step). Workspace deps: `@kkhys/seo`
(`normalizePathname` in `src/query.ts`) and `@kkhys/ui` (the search icon in
`src/dialog.astro`).

- `dialog.astro` — the command-palette shell: field, close button, status
  line, results list, and the shared CSS (open/close transitions, light
  dismiss look). Props: `id`, `label`, `placeholder` — nothing else is
  configurable; the field / close button / results aria labels are
  hardcoded Japanese (検索キーワード / 閉じる / 検索結果). Slots: `filters`
  (optional chips under the field) and `template` (the app's
  `<template class="search-result-template">` for one result row).
- `dialog-setup` (`src/dialog-setup.ts`) —
  `setupSearchDialog(dialog, options)` wires Pagefind loading and warm-up,
  the runner, keyboard handling (⌘K / Ctrl+K, arrows, Escape, IME
  composition), invoker and light-dismiss fallbacks on a `<dialog>` element
  you already hold;
  `mountSearchDialog(id, options)` looks the dialog up by id and calls it
  (logs and returns `undefined` on a miss). The app supplies
  `renderResult(fragment, template)` and, optionally, `searchOptions()`
  for filters; it gets back `{ input, runSearch, openDialog }`.
  `requireElement` / `isHTMLElement` / `renderExcerpt` are exported for
  renderers. All three apps use `mountSearchDialog`.
- `runner` — `createSearchRunner(deps, { maxResults, debounceMs, noun })`:
  stale-request discarding, partial fragment failures, and the status
  strings (`noun` is 記事 / メモ).
- `keyboard`, `excerpt`, `query`, `types` — the pure helpers and the
  hand-written Pagefind browser types.

App-local pieces: me and memo keep them in `src/features/search/` —
`config.ts` (dialog id, bundle path, meta keys), `utils/meta.ts`
(data-pagefind-* attribute builders), me's `buildSearchOptions` (category
filter), the result-row markup + CSS, and memo's `verify-index.ts` (the
Astro integration that fails the build when the Pagefind index does not
cover every post). design has no `features/` dir: the dialog is
`src/components/search-dialog.astro`, config + result ranking live in
`src/utils/search.ts`, and the index check is split into
`src/utils/pagefind-index.ts` + `src/integrations/verify-pagefind-index.ts`.
That check is a near-duplicate of memo's `verify-index.ts` — a known
candidate to fold into this package. `vitest run` covers runner / keyboard
/ excerpt / query.
