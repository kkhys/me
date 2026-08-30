// Browser-side surface of `/pagefind/pagefind.js`, hand-written after
// `pagefind_web_js/types/index.d.ts` at Pagefind 1.5.2 (the `pagefind` npm
// package only types the Node indexing API). Names follow the upstream file
// so it can be diffed on a Pagefind upgrade; only the members the dialogs call
// or read are declared, and `filters` / `sort` keep their simple forms (the
// compound `{ any: [...] }` / `{ not: ... }` syntax is left out).

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

export interface PagefindWordLocation {
  weight: number;
  balanced_score: number;
  location: number;
}

export interface PagefindSearchAnchor {
  element: string;
  id: string;
  text?: string | undefined;
  location: number;
}

/**
 * One section of a page: the text between a heading with an id and the next.
 * The first entry stands for the page itself (no `anchor`) when the query
 * matches before the first such heading.
 */
export interface PagefindSubResult {
  title: string;
  /** The page URL plus `#<heading id>` when `anchor` is set. */
  url: string;
  excerpt: string;
  weighted_locations: PagefindWordLocation[];
  anchor?: PagefindSearchAnchor | undefined;
}

export interface PagefindSearchFragment {
  url: string;
  raw_url: string;
  content: string;
  /** Matched words wrapped in `<mark>`; the page text around them has only `<` and `>` escaped. */
  excerpt: string;
  word_count: number;
  meta: Record<string, string>;
  filters: Record<string, string[]>;
  /** In document order, never sorted by relevance. */
  sub_results: PagefindSubResult[];
}

export interface PagefindSearchResult {
  id: string;
  score: number;
  words: number[];
  data: () => Promise<PagefindSearchFragment>;
}

export interface PagefindIndexesSearchResults {
  results: PagefindSearchResult[];
  unfilteredResultCount: number;
  filters: Record<string, Record<string, number>>;
  totalFilters: Record<string, Record<string, number>>;
  timings: { preload: number; search: number; total: number };
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
