interface SearchConfig {
  dialogId: string;
  /** Leading and trailing slash required: `pagefind.js` is appended verbatim. */
  bundlePath: `/${string}/`;
  /** Pagefind filter key that carries the post category. */
  filterKey: string;
  /** Pagefind metadata keys the dialog reads off each result fragment. */
  metaKeys: Record<"title" | "emoji" | "date" | "datetime", string>;
  maxResults: number;
  debounceMs: number;
  excerptLength: number;
}

export const searchConfig = {
  dialogId: "search-dialog",
  // astro-pagefind writes the bundle to `<outDir>/pagefind` and serves
  // `/pagefind/` from there in dev, so build and dev share this absolute path.
  bundlePath: "/pagefind/",
  filterKey: "category",
  metaKeys: {
    title: "title",
    emoji: "emoji",
    date: "date",
    datetime: "datetime",
  },
  maxResults: 10,
  debounceMs: 120,
  // Pagefind counts excerpt length in segmented words and centres the excerpt
  // on the match; with short Japanese segments the default 30 spills past the
  // two-line clamp and hides the <mark>.
  excerptLength: 24,
} as const satisfies SearchConfig;
