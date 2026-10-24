import { normalizeQuery } from "./query";
import type {
  PagefindModule,
  PagefindSearchFragment,
  PagefindSearchOptions,
  PagefindSearchResult,
} from "./types";

export type SearchStage = "load" | "search" | "fragments" | "render";

export type SearchRunner = (rawQuery: string, options?: PagefindSearchOptions) => Promise<void>;

export interface SearchRunnerDeps {
  loadPagefind: () => Promise<PagefindModule>;
  /** Replaces the rendered list; an empty array clears it. May throw on template drift. */
  render: (fragments: readonly PagefindSearchFragment[]) => void;
  /** Adds rows below the rendered ones. May throw on template drift. */
  append: (fragments: readonly PagefindSearchFragment[]) => void;
  setStatus: (text: string) => void;
  /** Whether hits beyond the rendered rows remain for `loadMore`. */
  setHasMore: (hasMore: boolean) => void;
  /** Called for every failure, including partial fragment loads that still render. */
  onError: (stage: SearchStage, error: unknown) => void;
}

export interface SearchRunnerConfig {
  /** Rows rendered per search and per `loadMore`. */
  pageSize: number;
  debounceMs: number;
  /** What a result is called in the status line, e.g. 記事 / メモ. */
  noun: string;
}

export interface SearchRunnerHandle {
  search: SearchRunner;
  /**
   * Renders the next `pageSize` hits of the last search below the rows on
   * screen. Does nothing without a search to continue, while a batch is
   * loading, or once every hit is rendered.
   */
  loadMore: () => Promise<void>;
}

export interface ResultStatusInput {
  query: string;
  total: number;
  shown: number;
  failed: number;
}

export const formatResultStatus = (
  { query, total, shown, failed }: ResultStatusInput,
  noun: string,
): string => {
  if (total === 0) return `「${query}」に一致する${noun}はありません`;
  const count = shown < total ? `${total} 件中 ${shown} 件を表示` : `${total} 件`;
  return failed > 0 ? `${count}（${failed} 件を読み込めませんでした）` : count;
};

const RELOAD_STATUS = "検索を読み込めませんでした。ページを再読み込みしてください";

// Nothing short of a reload recovers the first three stages: a failed module
// fetch stays in the browser's module map, a missing index rejects every
// search, and Pagefind keeps rejected fragment loads in its own cache. A
// render failure is a template bug, so no advice is offered.
const errorStatus: Record<SearchStage, string> = {
  load: RELOAD_STATUS,
  search: RELOAD_STATUS,
  fragments: RELOAD_STATUS,
  render: "検索結果を表示できませんでした",
};

export const formatErrorStatus = (stage: SearchStage): string => errorStatus[stage];

// The hits of one search and how far down them the list has been rendered.
interface ResultState {
  id: number;
  query: string;
  results: PagefindSearchResult[];
  /** Hits consumed so far, rendered or failed; the next batch starts here. */
  consumed: number;
  shown: number;
  failed: number;
  loading: boolean;
}

const loadBatch = async (results: readonly PagefindSearchResult[], from: number, size: number) => {
  const settled = await Promise.allSettled(
    results.slice(from, from + size).map((result) => result.data()),
  );
  return {
    fragments: settled.flatMap((entry) => (entry.status === "fulfilled" ? [entry.value] : [])),
    failures: settled.flatMap((entry) =>
      entry.status === "rejected" ? [entry.reason as unknown] : [],
    ),
  };
};

export const createSearchRunner = (
  deps: SearchRunnerDeps,
  { pageSize, debounceMs, noun }: SearchRunnerConfig,
): SearchRunnerHandle => {
  let requestId = 0;
  let current: ResultState | undefined;

  const publish = (state: ResultState) => {
    deps.setStatus(
      formatResultStatus(
        {
          query: state.query,
          total: state.results.length,
          shown: state.shown,
          failed: state.failed,
        },
        noun,
      ),
    );
    deps.setHasMore(state.consumed < state.results.length);
  };

  const fail = (stage: SearchStage, error: unknown) => {
    current = undefined;
    deps.onError(stage, error);
    // Status first: if the render itself is what failed, clearing the list
    // may throw again, and the status line must not be left on the old query.
    deps.setStatus(formatErrorStatus(stage));
    deps.setHasMore(false);
    deps.render([]);
  };

  const search: SearchRunner = async (rawQuery, options = {}) => {
    const query = normalizeQuery(rawQuery);
    const id = ++requestId;
    if (query === "") {
      deps.render([]);
      deps.setStatus("");
      deps.setHasMore(false);
      return;
    }

    let stage: SearchStage = "load";
    try {
      const pagefind = await deps.loadPagefind();
      stage = "search";
      const response = await pagefind.debouncedSearch(query, options, debounceMs);
      if (response === null || id !== requestId) return;

      stage = "fragments";
      const { fragments, failures } = await loadBatch(response.results, 0, pageSize);
      if (id !== requestId) return;
      if (failures.length > 0 && fragments.length === 0) {
        throw new Error("Every result fragment failed to load", { cause: failures });
      }
      if (failures.length > 0) deps.onError("fragments", failures);

      stage = "render";
      deps.render(fragments);
      current = {
        id,
        query,
        results: response.results,
        consumed: Math.min(pageSize, response.results.length),
        shown: fragments.length,
        failed: failures.length,
        loading: false,
      };
      publish(current);
    } catch (error) {
      // A newer request owns the UI now; reporting here would overwrite its result.
      if (id !== requestId) return;
      fail(stage, error);
    }
  };

  const loadMore = async () => {
    const state = current;
    if (
      state === undefined ||
      state.id !== requestId ||
      state.loading ||
      state.consumed >= state.results.length
    ) {
      return;
    }
    state.loading = true;
    let stage: SearchStage = "fragments";
    try {
      const { fragments, failures } = await loadBatch(state.results, state.consumed, pageSize);
      if (state.id !== requestId) return;
      // Pagefind caches a rejected fragment load, so retrying the same hits
      // would fail again: the batch counts as consumed either way, and the
      // status line carries the number that never made it.
      if (failures.length > 0) deps.onError("fragments", failures);

      stage = "render";
      deps.append(fragments);
      state.consumed = Math.min(state.consumed + pageSize, state.results.length);
      state.shown += fragments.length;
      state.failed += failures.length;
      publish(state);
    } catch (error) {
      if (state.id !== requestId) return;
      fail(stage, error);
    } finally {
      state.loading = false;
    }
  };

  return { search, loadMore };
};
