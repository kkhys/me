export const searchConfig = {
  // Not "search-dialog": the Components page already uses that id on the
  // SearchDialog section heading, and the mount looks the dialog up by id.
  dialogId: "site-search",
  // astro-pagefind writes the bundle to `<outDir>/pagefind` and serves
  // `/pagefind/` from there in dev, so build and dev share this absolute path.
  bundlePath: "/pagefind/",
  maxResults: 10,
  debounceMs: 120,
  // Pagefind counts excerpt length in segmented words and centres the excerpt
  // on the match; with short Japanese segments the default 30 spills past the
  // two-line clamp and hides the <mark>.
  excerptLength: 24,
} as const;
