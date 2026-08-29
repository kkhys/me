interface SearchConfig {
  dialogId: string;
  /** Leading and trailing slash required: `pagefind.js` is appended verbatim. */
  bundlePath: `/${string}/`;
  /** Pagefind metadata keys the dialog reads off each result fragment. */
  metaKeys: Record<"author" | "date" | "datetime" | "avatar", string>;
  maxResults: number;
  debounceMs: number;
  excerptLength: number;
}

export const searchConfig = {
  dialogId: "search-dialog",
  // astro-pagefind writes the bundle to `<outDir>/pagefind` and serves
  // `/pagefind/` from there in dev, so build and dev share this absolute path.
  bundlePath: "/pagefind/",
  metaKeys: {
    author: "author",
    date: "date",
    datetime: "datetime",
    avatar: "avatar",
  },
  maxResults: 10,
  debounceMs: 120,
  // Memos have no title, so the excerpt is the whole result row and gets a
  // three-line clamp. Pagefind counts the length in segmented words and
  // centres the excerpt on the match; 30 fills those lines without pushing
  // the <mark> below the clamp for short Japanese segments.
  excerptLength: 30,
} as const satisfies SearchConfig;
