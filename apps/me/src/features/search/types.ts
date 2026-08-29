// Browser-side surface of `/pagefind/pagefind.js`. The `pagefind` npm package
// only types the Node indexing API, so the runtime module is typed here.

export interface PagefindSearchOptions {
  filters?: Record<string, string | string[]> | undefined;
  sort?: Record<string, "asc" | "desc"> | undefined;
}

export interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
}

export interface PagefindFragment {
  url: string;
  raw_url: string;
  content: string;
  excerpt: string;
  word_count: number;
  meta: Record<string, string>;
  filters: Record<string, string[]>;
  sub_results: PagefindSubResult[];
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
  options: (options: Record<string, unknown>) => Promise<void>;
  init: () => Promise<void>;
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindSearchResponse>;
  /** Resolves to `null` when a newer call superseded this one. */
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions,
    debounceMs?: number,
  ) => Promise<PagefindSearchResponse | null>;
  preload: (query: string, options?: PagefindSearchOptions) => Promise<void>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  destroy: () => Promise<void>;
}
