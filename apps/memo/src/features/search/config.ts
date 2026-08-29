interface SearchConfig {
  dialogId: string;
  /**
   * Fixed by astro-pagefind: it writes the bundle to `<outDir>/pagefind` and
   * serves `/pagefind/` from there in dev. `pagefind.js` is appended verbatim.
   */
  bundlePath: "/pagefind/";
  /** Pagefind metadata keys the dialog reads off each result fragment. */
  metaKeys: Record<"author" | "date" | "datetime" | "avatar", string>;
  maxResults: number;
  debounceMs: number;
  excerptLength: number;
}

export const searchConfig = {
  dialogId: "search-dialog",
  bundlePath: "/pagefind/",
  metaKeys: {
    author: "author",
    date: "date",
    datetime: "datetime",
    avatar: "avatar",
  },
  maxResults: 10,
  debounceMs: 120,
  // Pagefind's own default, pinned because the layout depends on it: memos
  // have no title, so the excerpt is the whole result row under a three-line
  // clamp. Pagefind counts segmented words and centres the excerpt on the
  // match; 30 fills those lines without pushing the <mark> below the clamp
  // for short Japanese segments.
  excerptLength: 30,
} as const satisfies SearchConfig;
