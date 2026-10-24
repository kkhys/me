# CLAUDE.md

`@kkhys/search` — the Pagefind search dialog shared by me, memo, design,
and trends, consumed as source (no build step). Workspace deps:
`@kkhys/seo` (`normalizePathname` in `src/query.ts`) and `@kkhys/ui` (the
search icon in `src/dialog.astro`).

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
  renderers. All four apps use `mountSearchDialog`.
- `loader` — `loadPagefind(bundlePath, options)`: imports
  `${bundlePath}pagefind.js`, applies the index options and runs `init()`,
  once per URL per page (the promise is memoised, rejections included).
  `pagefind.init()` reloads the entry, metadata and WASM on every call, so
  anything else on a page that searches — trends' AI dialog — goes through
  this and shares the dialog's load.
- `runner` — `createSearchRunner(deps, { maxResults, debounceMs, noun })`:
  stale-request discarding, partial fragment failures, and the status
  strings (`noun` is 記事 / メモ / ページ).
- `sub-result` — `pickSubResult(fragment, prefer?)`: the heaviest
  `sub_results` entry (Pagefind returns them in document order), chosen
  among the sections `prefer` accepts when any of them matched (trends
  prefers the h4 item rows over the h1 headline), `undefined` when the page
  has no heading ids. design and trends render one row per page out of it,
  "page / section"; `toSectionHref` in `query` keeps the `#heading` of its
  URL while dropping `.html`.
- `verify-index` — `verifyPagefindIndex({ noun, countPages })`, the Astro
  integration registered after `pagefind()` in every app: astro-pagefind
  logs an indexing failure and returns, so this hook reads
  `dist/pagefind/pagefind-entry.json` and fails the build unless the index
  covers exactly the pages `countPages(dir)` reports (the ones carrying
  `data-pagefind-body`). `countFiles(dir, isPage)` is the readdir helper the
  apps pass; `countIndexedPages` / `assertIndexCoversPages` are the pure
  pieces.
- `excerpt` — `parseExcerpt` (text + `<mark>` parts) and
  `stripLeadingText(parts, heading)`, which drops the heading a section
  excerpt opens with (Pagefind joins blocks with ". ") when the row already
  shows it; `renderExcerptParts` in `dialog-setup` renders the parts and
  `renderExcerpt` is the string shortcut.
- `keyboard`, `query`, `types` — the pure helpers and the hand-written
  Pagefind browser types.

App-local pieces: me, memo and trends keep them in `src/features/search/` —
`config.ts` (dialog id, bundle path, meta keys), `utils/meta.ts`
(data-pagefind-* attribute builders), me's `buildSearchOptions` (category
filter), the result-row markup + CSS, and the `verify-index.ts` wrapper
that names the indexable pages (memo: `/posts/*.html`; trends:
`/<YYYY-MM-DD>.html`). design has no `features/` dir: the dialog is
`src/components/search-dialog.astro`, config lives in `src/utils/search.ts`,
and the wrapper is `src/integrations/verify-pagefind-index.ts` over
`src/utils/pagefind-index.ts` (`isDocPage`). `vitest run` covers runner /
loader / keyboard / excerpt / query / sub-result / verify-index.
