export const searchConfig = {
  dialogId: "search-dialog",
  // astro-pagefind writes the bundle to `dist/pagefind` and serves it from
  // there in dev, so the path is fixed regardless of the page.
  bundlePath: "/pagefind/",
  maxResults: 10,
  debounceMs: 120,
  // Pagefind measures excerpts in segmented words; Japanese segments are short,
  // so the default 30 runs to three lines at the dialog's width.
  excerptLength: 24,
} as const;
