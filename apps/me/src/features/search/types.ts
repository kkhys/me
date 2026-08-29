// Browser-side surface of `/pagefind/pagefind.js`, hand-written after
// `pagefind_web_js/types/index.d.ts` at Pagefind 1.5.2: the `pagefind` npm
// package only types the Node indexing API. Only the members this app uses are
// declared, and `filters` / `sort` are narrowed to the shapes the dialog sends
// (the compound `{ any: [...] }` / `{ not: ... }` syntax is left out).

export interface PagefindIndexOptions {
  basePath?: string | undefined;
  baseUrl?: string | undefined;
  excerptLength?: number | undefined;
  highlightParam?: string | undefined;
  exactDiacritics?: boolean | undefined;
}

export interface PagefindSearchOptions {
  filters?: Record<string, string | string[]> | undefined;
  /** Pagefind honours a single key and warns on the rest. */
  sort?: Record<string, "asc" | "desc"> | undefined;
}

export interface PagefindFragment {
  url: string;
  raw_url: string;
  content: string;
  /** Matched words wrapped in `<mark>`; the page text around them has only `<` and `>` escaped. */
  excerpt: string;
  word_count: number;
  meta: Record<string, string>;
  filters: Record<string, string[]>;
}

export interface PagefindSearchResult {
  id: string;
  score: number;
  words: number[];
  data: () => Promise<PagefindFragment>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
  unfilteredResultCount: number;
  filters: Record<string, Record<string, number>>;
  totalFilters: Record<string, Record<string, number>>;
  timings: { preload: number; search: number; total: number };
}

export interface PagefindModule {
  /** Must run before `init`. */
  options: (options: PagefindIndexOptions) => Promise<void>;
  /**
   * Resolves as soon as the runtime wrapper exists; the index itself loads in
   * the background and a missing index surfaces as a rejection of the first
   * search instead.
   */
  init: () => Promise<void>;
  /** Resolves to `null` when a newer call superseded this one. */
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions,
    debounceMs?: number,
  ) => Promise<PagefindSearchResponse | null>;
}
