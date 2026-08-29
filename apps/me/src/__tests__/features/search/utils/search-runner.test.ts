import { describe, expect, it, vi } from "vitest";
import { searchConfig } from "#/features/search/config";
import type {
  PagefindFragment,
  PagefindModule,
  PagefindSearchResponse,
  PagefindSearchResult,
} from "#/features/search/types";
import {
  createSearchRunner,
  formatErrorStatus,
  formatResultStatus,
} from "#/features/search/utils/search-runner";

const fragment = (url: string): PagefindFragment => ({
  url,
  raw_url: url,
  content: "",
  excerpt: "",
  word_count: 0,
  meta: {},
  filters: {},
});

const result = (
  url: string,
  data: () => Promise<PagefindFragment> = () => Promise.resolve(fragment(url)),
): PagefindSearchResult => ({
  id: url,
  score: 1,
  words: [],
  data,
});

const response = (results: PagefindSearchResult[]): PagefindSearchResponse => ({
  results,
  unfilteredResultCount: results.length,
  filters: {},
  totalFilters: {},
  timings: { preload: 0, search: 0, total: 0 },
});

const respond = (results: PagefindSearchResult[]) =>
  vi.fn<PagefindModule["debouncedSearch"]>().mockResolvedValue(response(results));

const rejectWith = (error: unknown) =>
  vi.fn<PagefindModule["debouncedSearch"]>().mockRejectedValue(error);

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const createHarness = (pagefind: Partial<PagefindModule>) => {
  const module: PagefindModule = {
    options: vi.fn<PagefindModule["options"]>(() => Promise.resolve()),
    init: vi.fn<PagefindModule["init"]>(() => Promise.resolve()),
    debouncedSearch: respond([]),
    ...pagefind,
  };
  const deps = {
    loadPagefind: vi.fn<() => Promise<PagefindModule>>(() => Promise.resolve(module)),
    render: vi.fn<(fragments: PagefindFragment[]) => void>(),
    setStatus: vi.fn<(text: string) => void>(),
    onError: vi.fn<(stage: string, error: unknown) => void>(),
  };
  return { module, deps, run: createSearchRunner(deps) };
};

describe("formatResultStatus", () => {
  it("names the query when nothing matched", () => {
    expect(formatResultStatus({ query: "abc", total: 0, shown: 0, failed: 0 })).toBe(
      "「abc」に一致する記事はありません",
    );
  });

  it("shows only the total when every hit is rendered", () => {
    expect(formatResultStatus({ query: "q", total: 3, shown: 3, failed: 0 })).toBe("3 件");
  });

  it("says how many of the hits are on screen when the list is capped", () => {
    expect(formatResultStatus({ query: "q", total: 42, shown: 10, failed: 0 })).toBe(
      "42 件中 10 件を表示",
    );
  });

  it("mentions fragments that failed to load", () => {
    expect(formatResultStatus({ query: "q", total: 5, shown: 4, failed: 1 })).toBe(
      "5 件中 4 件を表示（1 件を読み込めませんでした）",
    );
  });
});

describe("formatErrorStatus", () => {
  it("advises a reload only for the stages a retry cannot fix", () => {
    expect(formatErrorStatus("load")).toMatch(/再読み込み/u);
    expect(formatErrorStatus("search")).toMatch(/再読み込み/u);
    expect(formatErrorStatus("fragments")).toMatch(/もう一度/u);
    expect(formatErrorStatus("render")).toMatch(/もう一度/u);
  });
});

describe("createSearchRunner", () => {
  it("clears the UI without touching Pagefind for a blank query", async () => {
    const { deps, run } = createHarness({});
    await run("  　 ", undefined);
    expect(deps.loadPagefind).not.toHaveBeenCalled();
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenCalledWith("");
  });

  it("normalizes the query and forwards the category filter and debounce", async () => {
    const debouncedSearch = respond([result("/a.html")]);
    const { deps, run } = createHarness({ debouncedSearch });
    await run(" 分散型　SNS ", "Tech");
    expect(debouncedSearch).toHaveBeenCalledWith(
      "分散型 SNS",
      { filters: { [searchConfig.filterKey]: "Tech" } },
      searchConfig.debounceMs,
    );
    expect(deps.render).toHaveBeenCalledWith([fragment("/a.html")]);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("does nothing when Pagefind reports the call as superseded", async () => {
    const { deps, run } = createHarness({
      debouncedSearch: vi.fn<PagefindModule["debouncedSearch"]>(() => Promise.resolve(null)),
    });
    await run("q", undefined);
    expect(deps.render).not.toHaveBeenCalled();
    expect(deps.setStatus).not.toHaveBeenCalled();
  });

  it("only loads fragments for the first maxResults hits and reports the total", async () => {
    const loaded: string[] = [];
    const results = Array.from({ length: searchConfig.maxResults + 5 }, (_, i) =>
      result(`/${i}.html`, () => {
        loaded.push(`/${i}.html`);
        return Promise.resolve(fragment(`/${i}.html`));
      }),
    );
    const { deps, run } = createHarness({ debouncedSearch: respond(results) });
    await run("q", undefined);
    expect(loaded).toEqual(results.slice(0, searchConfig.maxResults).map((r) => r.id));
    expect(deps.setStatus).toHaveBeenLastCalledWith(
      `${searchConfig.maxResults + 5} 件中 ${searchConfig.maxResults} 件を表示`,
    );
  });

  it("drops a slow response once a newer request has rendered", async () => {
    const first = deferred<PagefindFragment>();
    const debouncedSearch = vi
      .fn<PagefindModule["debouncedSearch"]>()
      .mockResolvedValueOnce(response([result("/old.html", () => first.promise)]))
      .mockResolvedValueOnce(response([result("/new.html")]));
    const { deps, run } = createHarness({ debouncedSearch });

    const older = run("old", undefined);
    await vi.waitFor(() => expect(debouncedSearch).toHaveBeenCalledTimes(1));
    await run("new", undefined);
    expect(deps.render).toHaveBeenLastCalledWith([fragment("/new.html")]);

    first.resolve(fragment("/old.html"));
    await older;
    expect(deps.render).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("drops a late failure once a newer request has rendered", async () => {
    const first = deferred<PagefindFragment>();
    const debouncedSearch = vi
      .fn<PagefindModule["debouncedSearch"]>()
      .mockResolvedValueOnce(response([result("/old.html", () => first.promise)]))
      .mockResolvedValueOnce(response([result("/new.html")]));
    const { deps, run } = createHarness({ debouncedSearch });

    const older = run("old", undefined);
    await vi.waitFor(() => expect(debouncedSearch).toHaveBeenCalledTimes(1));
    await run("new", undefined);

    first.reject(new Error("network"));
    await older;
    expect(deps.onError).not.toHaveBeenCalled();
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("reports a bundle load failure with reload advice and clears the list", async () => {
    const error = new TypeError("Failed to fetch dynamically imported module");
    const { deps, run } = createHarness({});
    deps.loadPagefind.mockRejectedValue(error);
    await run("q", undefined);
    expect(deps.onError).toHaveBeenCalledWith("load", error);
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenCalledWith(formatErrorStatus("load"));
  });

  it("treats a rejected search (missing index) as a load-class failure", async () => {
    const error = new Error("Failed to load the index");
    const { deps, run } = createHarness({ debouncedSearch: rejectWith(error) });
    await run("q", undefined);
    expect(deps.onError).toHaveBeenCalledWith("search", error);
    expect(deps.setStatus).toHaveBeenCalledWith(formatErrorStatus("search"));
  });

  it("renders the fragments that loaded and reports the ones that did not", async () => {
    const error = new Error("gunzip");
    const { deps, run } = createHarness({
      debouncedSearch: respond([result("/a.html"), result("/b.html", () => Promise.reject(error))]),
    });
    await run("q", undefined);
    expect(deps.render).toHaveBeenCalledWith([fragment("/a.html")]);
    expect(deps.onError).toHaveBeenCalledWith("fragments", [error]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(
      "2 件中 1 件を表示（1 件を読み込めませんでした）",
    );
  });

  it("fails the search when every fragment fails to load", async () => {
    const error = new Error("gunzip");
    const { deps, run } = createHarness({
      debouncedSearch: respond([result("/a.html", () => Promise.reject(error))]),
    });
    await run("q", undefined);
    expect(deps.onError).toHaveBeenCalledTimes(1);
    expect(deps.onError.mock.calls[0]?.[0]).toBe("fragments");
    expect(deps.render).toHaveBeenLastCalledWith([]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("fragments"));
  });

  it("surfaces a render failure as a retryable error", async () => {
    const error = new Error("template drift");
    const { deps, run } = createHarness({ debouncedSearch: respond([result("/a.html")]) });
    deps.render.mockImplementationOnce(() => {
      throw error;
    });
    await run("q", undefined);
    expect(deps.onError).toHaveBeenCalledWith("render", error);
    expect(deps.render).toHaveBeenLastCalledWith([]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("render"));
  });
});
