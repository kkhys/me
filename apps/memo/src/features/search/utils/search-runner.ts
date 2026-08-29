import { searchConfig } from "#/features/search/config";
import type { PagefindFragment, PagefindModule } from "#/features/search/types";
import { normalizeQuery } from "#/features/search/utils/query";

export type SearchStage = "load" | "search" | "fragments" | "render";

export interface SearchRunnerDeps {
  loadPagefind: () => Promise<PagefindModule>;
  /** Replaces the rendered list; an empty array clears it. May throw on template drift. */
  render: (fragments: PagefindFragment[]) => void;
  setStatus: (text: string) => void;
  /** Called for every failure, including partial fragment loads that still render. */
  onError: (stage: SearchStage, error: unknown) => void;
}

export interface ResultStatusInput {
  query: string;
  total: number;
  shown: number;
  failed: number;
}

export const formatResultStatus = ({ query, total, shown, failed }: ResultStatusInput): string => {
  if (total === 0) return `「${query}」に一致するメモはありません`;
  const count = shown < total ? `${total} 件中 ${shown} 件を表示` : `${total} 件`;
  return failed > 0 ? `${count}（${failed} 件を読み込めませんでした）` : count;
};

// A failed module fetch is cached in the module map for the page lifetime and
// a missing index is only reported by the first search, so both stages share
// the reload advice; later stages are per-result and worth retrying in place.
export const formatErrorStatus = (stage: SearchStage): string =>
  stage === "load" || stage === "search"
    ? "検索を読み込めませんでした。ページを再読み込みしてください"
    : "検索結果を取得できませんでした。もう一度お試しください";

export const createSearchRunner = (deps: SearchRunnerDeps) => {
  let requestId = 0;

  return async (rawQuery: string): Promise<void> => {
    const query = normalizeQuery(rawQuery);
    const id = ++requestId;
    if (query === "") {
      deps.render([]);
      deps.setStatus("");
      return;
    }

    let stage: SearchStage = "load";
    try {
      const pagefind = await deps.loadPagefind();
      stage = "search";
      const response = await pagefind.debouncedSearch(query, {}, searchConfig.debounceMs);
      if (response === null || id !== requestId) return;

      stage = "fragments";
      const settled = await Promise.allSettled(
        response.results.slice(0, searchConfig.maxResults).map((result) => result.data()),
      );
      if (id !== requestId) return;
      const fragments = settled.flatMap((entry) =>
        entry.status === "fulfilled" ? [entry.value] : [],
      );
      const failures = settled.flatMap((entry) =>
        entry.status === "rejected" ? [entry.reason as unknown] : [],
      );
      if (failures.length > 0 && fragments.length === 0) {
        throw new Error("Every result fragment failed to load", { cause: failures });
      }
      if (failures.length > 0) deps.onError("fragments", failures);

      stage = "render";
      deps.render(fragments);
      deps.setStatus(
        formatResultStatus({
          query,
          total: response.results.length,
          shown: fragments.length,
          failed: failures.length,
        }),
      );
    } catch (error) {
      // A newer request owns the UI now; reporting here would overwrite its result.
      if (id !== requestId) return;
      deps.onError(stage, error);
      deps.render([]);
      deps.setStatus(formatErrorStatus(stage));
    }
  };
};
