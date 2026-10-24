import { describe, expect, it, vi } from "vitest";
import {
  createSearchRunner,
  formatErrorStatus,
  formatResultStatus,
  type SearchStage,
} from "../runner";
import type {
  PagefindIndexesSearchResults,
  PagefindModule,
  PagefindSearchFragment,
  PagefindSearchResult,
} from "../types";

const searchConfig = { pageSize: 10, debounceMs: 120, noun: "メモ" } as const;

const fragment = (url: string): PagefindSearchFragment => ({
  url,
  raw_url: url,
  content: "",
  excerpt: "",
  word_count: 0,
  meta: {},
  filters: {},
  sub_results: [],
});

const result = (
  url: string,
  data: () => Promise<PagefindSearchFragment> = () => Promise.resolve(fragment(url)),
): PagefindSearchResult => ({ id: url, score: 1, words: [], data });

const response = (results: PagefindSearchResult[]): PagefindIndexesSearchResults => ({
  results,
  unfilteredResultCount: results.length,
  filters: {},
  totalFilters: {},
  timings: { preload: 0, search: 0, total: 0 },
});

const urls = (from: number, to: number) =>
  Array.from({ length: to - from }, (_, i) => `/${from + i}.html`);

const fragmentsOf = (from: number, to: number) => urls(from, to).map((url) => fragment(url));

/** `length` hits whose `data()` records its URL; `override` swaps the load of an index. */
const trackedResults = (
  length: number,
  override: Record<number, () => Promise<PagefindSearchFragment>> = {},
) => {
  const loaded: string[] = [];
  const results = Array.from({ length }, (_, i) =>
    result(`/${i}.html`, () => {
      loaded.push(`/${i}.html`);
      return (override[i] ?? (() => Promise.resolve(fragment(`/${i}.html`))))();
    }),
  );
  return { loaded, results };
};

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
    search: vi.fn<PagefindModule["search"]>().mockResolvedValue(response([])),
    debouncedSearch: respond([]),
    ...pagefind,
  };
  const deps = {
    loadPagefind: vi.fn<() => Promise<PagefindModule>>(() => Promise.resolve(module)),
    render: vi.fn<(fragments: readonly PagefindSearchFragment[]) => void>(),
    append: vi.fn<(fragments: readonly PagefindSearchFragment[]) => void>(),
    setStatus: vi.fn<(text: string) => void>(),
    setHasMore: vi.fn<(hasMore: boolean) => void>(),
    onError: vi.fn<(stage: SearchStage, error: unknown) => void>(),
  };
  const runner = createSearchRunner(deps, searchConfig);
  return { module, deps, run: runner.search, loadMore: runner.loadMore };
};

// Starts `run(first)` with its search still `pending`, then runs `second` to
// completion; `older` settles once the caller resolves or rejects `pending`.
const startSuperseded = async (
  first: string,
  second: string,
  pending: Promise<PagefindIndexesSearchResults | null>,
) => {
  const debouncedSearch = vi
    .fn<PagefindModule["debouncedSearch"]>()
    .mockReturnValueOnce(pending)
    .mockResolvedValueOnce(response([result("/new.html")]));
  const harness = createHarness({ debouncedSearch });
  const older = harness.run(first);
  await vi.waitFor(() => expect(debouncedSearch).toHaveBeenCalledTimes(1));
  await harness.run(second);
  return { ...harness, older };
};

describe("formatResultStatus", () => {
  it("names the query when nothing matched", () => {
    expect(formatResultStatus({ query: "abc", total: 0, shown: 0, failed: 0 }, "メモ")).toBe(
      "「abc」に一致するメモはありません",
    );
  });

  it("shows only the total when every hit is rendered", () => {
    expect(formatResultStatus({ query: "q", total: 3, shown: 3, failed: 0 }, "メモ")).toBe("3 件");
  });

  it("says how many of the hits are on screen when the list is capped", () => {
    expect(formatResultStatus({ query: "q", total: 42, shown: 10, failed: 0 }, "メモ")).toBe(
      "42 件中 10 件を表示",
    );
  });

  it("mentions fragments that failed to load", () => {
    expect(formatResultStatus({ query: "q", total: 5, shown: 4, failed: 1 }, "メモ")).toBe(
      "5 件中 4 件を表示（1 件を読み込めませんでした）",
    );
  });
});

describe("formatErrorStatus", () => {
  it("advises a reload for every stage whose failure Pagefind or the browser caches", () => {
    for (const stage of ["load", "search", "fragments"] as const) {
      expect(formatErrorStatus(stage)).toMatch(/再読み込み/u);
    }
  });

  it("offers no retry advice for a render failure", () => {
    expect(formatErrorStatus("render")).not.toMatch(/再読み込み|もう一度/u);
  });
});

describe("createSearchRunner", () => {
  it("clears the UI without touching Pagefind for a blank query", async () => {
    const { deps, run } = createHarness({});
    await run("  　 ");
    expect(deps.loadPagefind).not.toHaveBeenCalled();
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenCalledWith("");
    expect(deps.setHasMore).toHaveBeenCalledWith(false);
  });

  it("normalizes the query and forwards the options and debounce", async () => {
    const debouncedSearch = respond([result("/a.html")]);
    const { deps, run } = createHarness({ debouncedSearch });
    await run(" 分散型　SNS ", { filters: { category: "Tech" } });
    expect(debouncedSearch).toHaveBeenCalledWith(
      "分散型 SNS",
      { filters: { category: "Tech" } },
      searchConfig.debounceMs,
    );
    expect(deps.render).toHaveBeenCalledWith([fragment("/a.html")]);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);
  });

  it("clears the list and names the normalized query when nothing matched", async () => {
    const { deps, run } = createHarness({ debouncedSearch: respond([]) });
    await run(" foo   bar ");
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenLastCalledWith("「foo bar」に一致するメモはありません");
  });

  it("does nothing when Pagefind reports the call as superseded", async () => {
    const { deps, run } = createHarness({
      debouncedSearch: vi.fn<PagefindModule["debouncedSearch"]>(() => Promise.resolve(null)),
    });
    await run("q");
    expect(deps.render).not.toHaveBeenCalled();
    expect(deps.setStatus).not.toHaveBeenCalled();
  });

  it("only loads fragments for the first page and offers the rest", async () => {
    const { loaded, results } = trackedResults(15);
    const { deps, run } = createHarness({ debouncedSearch: respond(results) });
    await run("q");
    expect(loaded).toEqual(urls(0, 10));
    expect(deps.render).toHaveBeenCalledWith(fragmentsOf(0, 10));
    expect(deps.setStatus).toHaveBeenLastCalledWith("15 件中 10 件を表示");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(true);
  });

  it("drops a superseded response even when Pagefind still returns it", async () => {
    const first = deferred<PagefindIndexesSearchResults | null>();
    const { deps, older } = await startSuperseded("old", "new", first.promise);
    expect(deps.render).toHaveBeenLastCalledWith([fragment("/new.html")]);

    first.resolve(response([result("/old.html")]));
    await older;
    expect(deps.render).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("drops a late search failure once a newer request has rendered", async () => {
    const first = deferred<PagefindIndexesSearchResults | null>();
    const { deps, older } = await startSuperseded("old", "new", first.promise);

    first.reject(new Error("index"));
    await older;
    expect(deps.onError).not.toHaveBeenCalled();
    expect(deps.render).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("drops slow fragments once a newer request has rendered", async () => {
    const first = deferred<PagefindSearchFragment>();
    const { deps, older } = await startSuperseded(
      "old",
      "new",
      Promise.resolve(response([result("/old.html", () => first.promise)])),
    );
    expect(deps.render).toHaveBeenLastCalledWith([fragment("/new.html")]);

    first.resolve(fragment("/old.html"));
    await older;
    expect(deps.render).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("drops a late fragment failure once a newer request has rendered", async () => {
    const first = deferred<PagefindSearchFragment>();
    const { deps, older } = await startSuperseded(
      "old",
      "new",
      Promise.resolve(response([result("/old.html", () => first.promise)])),
    );

    first.reject(new Error("network"));
    await older;
    expect(deps.onError).not.toHaveBeenCalled();
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
  });

  it("invalidates an in-flight search when the input is cleared", async () => {
    const first = deferred<PagefindIndexesSearchResults | null>();
    const { deps, older } = await startSuperseded("old", "", first.promise);
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenCalledWith("");

    first.resolve(response([result("/old.html")]));
    await older;
    expect(deps.render).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenCalledTimes(1);
  });

  it("reports a bundle load failure with reload advice and clears the list", async () => {
    const error = new TypeError("Failed to fetch dynamically imported module");
    const { deps, run } = createHarness({});
    deps.loadPagefind.mockRejectedValue(error);
    await run("q");
    expect(deps.onError).toHaveBeenCalledWith("load", error);
    expect(deps.render).toHaveBeenCalledWith([]);
    expect(deps.setStatus).toHaveBeenCalledWith(formatErrorStatus("load"));
    expect(deps.setHasMore).toHaveBeenCalledWith(false);
  });

  it("treats a rejected search (missing index) as a load-class failure", async () => {
    const error = new Error("Failed to load the index");
    const { deps, run } = createHarness({ debouncedSearch: rejectWith(error) });
    await run("q");
    expect(deps.onError).toHaveBeenCalledWith("search", error);
    expect(deps.setStatus).toHaveBeenCalledWith(formatErrorStatus("search"));
  });

  it("renders the fragments that loaded and reports the ones that did not", async () => {
    const error = new Error("gunzip");
    const { deps, run } = createHarness({
      debouncedSearch: respond([result("/a.html"), result("/b.html", () => Promise.reject(error))]),
    });
    await run("q");
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
    await run("q");
    expect(deps.onError).toHaveBeenCalledTimes(1);
    expect(deps.onError.mock.calls[0]?.[0]).toBe("fragments");
    expect(deps.onError.mock.calls[0]?.[1]).toMatchObject({ cause: [error] });
    expect(deps.render).toHaveBeenLastCalledWith([]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("fragments"));
  });

  it("reports a render failure and clears the list", async () => {
    const error = new Error("template drift");
    const { deps, run } = createHarness({ debouncedSearch: respond([result("/a.html")]) });
    deps.render.mockImplementationOnce(() => {
      throw error;
    });
    await run("q");
    expect(deps.onError).toHaveBeenCalledWith("render", error);
    expect(deps.render).toHaveBeenLastCalledWith([]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("render"));
  });

  it("sets the error status even when clearing the list throws again", async () => {
    const error = new Error("template drift");
    const { deps, run } = createHarness({ debouncedSearch: respond([result("/a.html")]) });
    deps.render.mockImplementation(() => {
      throw error;
    });
    await expect(run("q")).rejects.toBe(error);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("render"));
  });
});

describe("loadMore", () => {
  it("appends the next page and stops offering more once every hit is on screen", async () => {
    const { loaded, results } = trackedResults(25);
    const { deps, run, loadMore } = createHarness({ debouncedSearch: respond(results) });
    await run("q");

    await loadMore();
    expect(loaded).toEqual(urls(0, 20));
    expect(deps.append).toHaveBeenLastCalledWith(fragmentsOf(10, 20));
    expect(deps.setStatus).toHaveBeenLastCalledWith("25 件中 20 件を表示");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(true);

    await loadMore();
    expect(deps.append).toHaveBeenLastCalledWith(fragmentsOf(20, 25));
    expect(deps.setStatus).toHaveBeenLastCalledWith("25 件");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);

    await loadMore();
    expect(deps.append).toHaveBeenCalledTimes(2);
    expect(loaded).toHaveLength(25);
    expect(deps.render).toHaveBeenCalledTimes(1);
  });

  it("does nothing before a search has rendered", async () => {
    const { deps, loadMore } = createHarness({});
    await loadMore();
    expect(deps.append).not.toHaveBeenCalled();
    expect(deps.setStatus).not.toHaveBeenCalled();
  });

  it("does nothing once the input was cleared", async () => {
    const { results } = trackedResults(15);
    const { deps, run, loadMore } = createHarness({ debouncedSearch: respond(results) });
    await run("q");
    await run("");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);
    await loadMore();
    expect(deps.append).not.toHaveBeenCalled();
  });

  it("drops a batch that lands after a newer search has rendered", async () => {
    const pending = deferred<PagefindSearchFragment>();
    const { results } = trackedResults(15, { 10: () => pending.promise });
    const debouncedSearch = vi
      .fn<PagefindModule["debouncedSearch"]>()
      .mockResolvedValueOnce(response(results))
      .mockResolvedValueOnce(response([result("/new.html")]));
    const { deps, run, loadMore } = createHarness({ debouncedSearch });
    await run("old");
    const older = loadMore();
    await run("new");
    expect(deps.render).toHaveBeenLastCalledWith([fragment("/new.html")]);

    pending.resolve(fragment("/10.html"));
    await older;
    expect(deps.append).not.toHaveBeenCalled();
    expect(deps.setStatus).toHaveBeenLastCalledWith("1 件");
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);
  });

  it("loads one batch at a time", async () => {
    const pending = deferred<PagefindSearchFragment>();
    const { loaded, results } = trackedResults(30, { 10: () => pending.promise });
    const { deps, run, loadMore } = createHarness({ debouncedSearch: respond(results) });
    await run("q");
    const first = loadMore();
    await loadMore();
    expect(loaded).toHaveLength(20);

    pending.resolve(fragment("/10.html"));
    await first;
    expect(deps.append).toHaveBeenCalledTimes(1);
    expect(deps.setStatus).toHaveBeenLastCalledWith("30 件中 20 件を表示");

    await loadMore();
    expect(loaded).toHaveLength(30);
    expect(deps.setStatus).toHaveBeenLastCalledWith("30 件");
  });

  it("moves past fragments that failed to load and keeps counting them", async () => {
    const error = new Error("gunzip");
    const { results } = trackedResults(22, {
      3: () => Promise.reject(error),
      15: () => Promise.reject(error),
    });
    const { deps, run, loadMore } = createHarness({ debouncedSearch: respond(results) });
    await run("q");
    expect(deps.setStatus).toHaveBeenLastCalledWith(
      "22 件中 9 件を表示（1 件を読み込めませんでした）",
    );

    await loadMore();
    expect(deps.append).toHaveBeenLastCalledWith([...fragmentsOf(10, 15), ...fragmentsOf(16, 20)]);
    expect(deps.onError).toHaveBeenLastCalledWith("fragments", [error]);
    expect(deps.setStatus).toHaveBeenLastCalledWith(
      "22 件中 18 件を表示（2 件を読み込めませんでした）",
    );
    expect(deps.setHasMore).toHaveBeenLastCalledWith(true);

    await loadMore();
    expect(deps.setStatus).toHaveBeenLastCalledWith(
      "22 件中 20 件を表示（2 件を読み込めませんでした）",
    );
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);
  });

  it("reports a failed append and clears the list", async () => {
    const error = new Error("template drift");
    const { results } = trackedResults(15);
    const { deps, run, loadMore } = createHarness({ debouncedSearch: respond(results) });
    await run("q");
    deps.append.mockImplementationOnce(() => {
      throw error;
    });
    await loadMore();
    expect(deps.onError).toHaveBeenCalledWith("render", error);
    expect(deps.setStatus).toHaveBeenLastCalledWith(formatErrorStatus("render"));
    expect(deps.render).toHaveBeenLastCalledWith([]);
    expect(deps.setHasMore).toHaveBeenLastCalledWith(false);

    await loadMore();
    expect(deps.append).toHaveBeenCalledTimes(1);
  });
});
