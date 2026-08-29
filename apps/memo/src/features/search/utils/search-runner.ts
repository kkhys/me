import { searchConfig } from "#/features/search/config";
import type { PagefindModule, PagefindSearchFragment } from "#/features/search/types";
import { normalizeQuery } from "#/features/search/utils/query";

export type SearchStage = "load" | "search" | "fragments" | "render";

export type SearchRunner = (rawQuery: string) => Promise<void>;

export interface SearchRunnerDeps {
  loadPagefind: () => Promise<PagefindModule>;
  /** Replaces the rendered list; an empty array clears it. May throw on template drift. */
  render: (fragments: readonly PagefindSearchFragment[]) => void;
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

export const createSearchRunner = (deps: SearchRunnerDeps): SearchRunner => {
  let requestId = 0;

  return async (rawQuery) => {
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
      // Status first: if the render itself is what failed, clearing the list
      // may throw again, and the status line must not be left on the old query.
      deps.setStatus(formatErrorStatus(stage));
      deps.render([]);
    }
  };
};
