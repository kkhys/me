// Browser-side surface of `/pagefind/pagefind.js`, hand-written after
// `pagefind_web_js/types/index.d.ts` at Pagefind 1.5.2 (the `pagefind` npm
// package only types the Node indexing API). Names follow the upstream file
// so it can be diffed on a Pagefind upgrade; only the members this app calls
// or reads are declared, and `filters` / `sort` keep their simple forms (the
// compound `{ any: [...] }` / `{ not: ... }` syntax is left out).

export interface PagefindIndexOptions {
  excerptLength?: number | undefined;
}

export interface PagefindSearchOptions {
  filters?: Record<string, string | string[]> | undefined;
  /** Pagefind honours a single key and warns on the rest. */
  sort?: Record<string, "asc" | "desc"> | undefined;
}

export interface PagefindSearchFragment {
  url: string;
  /** Matched words wrapped in `<mark>`; the page text around them has only `<` and `>` escaped. */
  excerpt: string;
  meta: Record<string, string>;
}

export interface PagefindSearchResult {
  data: () => Promise<PagefindSearchFragment>;
}

export interface PagefindIndexesSearchResults {
  results: PagefindSearchResult[];
}

export interface PagefindModule {
  /** Path-like options lock at `init`; `excerptLength` also applies to a live instance. */
  options: (options: PagefindIndexOptions) => Promise<void>;
  /**
   * Resolves as soon as the runtime wrapper exists; the index loads in the
   * background, and a missing index surfaces as a rejection of every search
   * instead.
   */
  init: () => Promise<void>;
  /** Resolves to `null` when a newer call superseded this one. */
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions,
    debounceMs?: number,
  ) => Promise<PagefindIndexesSearchResults | null>;
}
