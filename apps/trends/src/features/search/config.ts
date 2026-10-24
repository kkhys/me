interface SearchConfig {
  dialogId: string;
  /**
   * Fixed by astro-pagefind: it writes the bundle to `<outDir>/pagefind` and
   * serves `/pagefind/` from there in dev. `pagefind.js` is appended verbatim.
   */
  bundlePath: "/pagefind/";
  /** Pagefind metadata keys the dialog reads off each result fragment. */
  metaKeys: Record<"date", string>;
  /** Pagefind filter keys; `month` narrows the AI dialog's cross-day search to a range. */
  filterKeys: Record<"month", string>;
  /** Pagefind sort key of the run date, for the 新しい順 ordering. */
  sortKey: string;
  /** localStorage key of the chosen ordering. */
  sortStorageKey: string;
  maxResults: number;
  debounceMs: number;
  excerptLength: number;
}

export const searchConfig = {
  dialogId: "search-dialog",
  bundlePath: "/pagefind/",
  metaKeys: {
    date: "date",
  },
  filterKeys: {
    month: "month",
  },
  sortKey: "date",
  sortStorageKey: "trends:search-sort",
  maxResults: 10,
  debounceMs: 120,
  // Pagefind counts excerpt length in segmented words and centres the excerpt
  // on the match; with short Japanese segments the default 30 spills past the
  // two-line clamp and hides the <mark>.
  excerptLength: 24,
} as const satisfies SearchConfig;
