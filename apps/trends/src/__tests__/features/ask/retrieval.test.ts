import type {
  PagefindIndexesSearchResults,
  PagefindModule,
  PagefindSearchFragment,
  PagefindSearchResult,
} from "@kkhys/search/types";
import { describe, expect, it, vi } from "vitest";

import { createRetriever, type RetrieverDeps } from "#/features/ask/retrieval";
import type { AskDay, AskDigest, AskItem, AskMonth } from "#/features/ask/types";
import { shiftDate } from "#/features/ask/utils/scope";

const DATE = "2026-10-24";
const FIRST = "2026-05-01";

const item = (anchor: string, title: string, summary = ""): AskItem => ({
  anchor,
  title,
  original: "",
  source: "Zenn",
  group: "日本",
  url: `https://example.com/${anchor}`,
  category: "",
  summary,
  detail: "",
});

const digest = (date: string, items: AskItem[]): AskDigest => ({
  date,
  headline: `${date} の見出し`,
  lead: `${date} の概要`,
  highlights: [{ title: "H", source: "HN", reason: "理由", anchor: "" }],
  items,
});

const day = (date: string, score = 0): AskDay => ({
  date,
  headline: `${date} の見出し`,
  lead: "概要",
  highlights: [{ title: `${date} の記事`, source: "HN", anchor: "global-hackernews-1", score }],
  total: 3,
  categories: { AI: 2, Web: 1 },
});

/* `days` of a month, dated backwards from `last`. */
const month = (id: string, last: string, count: number, score = 0): AskMonth => ({
  month: id,
  days: Array.from({ length: count }, (_, i) => day(shiftDate(last, i - count + 1), score)),
});

const fragment = (date: string, anchors: string[]): PagefindSearchFragment => ({
  url: `/${date}.html`,
  raw_url: `/${date}.html`,
  content: "",
  excerpt: "",
  word_count: 0,
  meta: { date },
  filters: {},
  sub_results: anchors.map((anchor) => ({
    title: anchor,
    url: `/${date}.html#${anchor}`,
    excerpt: "",
    weighted_locations: [],
    anchor: { element: "h4", id: anchor, location: 0 },
  })),
});

const hit = (date: string, score: number, anchors: string[]): PagefindSearchResult => ({
  id: date,
  score,
  words: [],
  data: () => Promise.resolve(fragment(date, anchors)),
});

const response = (results: PagefindSearchResult[]): PagefindIndexesSearchResults => ({
  results,
  unfilteredResultCount: results.length,
  filters: {},
  totalFilters: {},
  timings: { preload: 0, search: 0, total: 0 },
});

const harness = (
  files: Record<string, unknown>,
  hits: Record<string, PagefindSearchResult[]> = {},
  date = DATE,
) => {
  const fetchJson = vi.fn<(url: string) => Promise<unknown>>((url) => {
    const file = files[url];
    return file === undefined ? Promise.reject(new Error(`404 ${url}`)) : Promise.resolve(file);
  });
  const search = vi.fn<PagefindModule["search"]>((term) =>
    Promise.resolve(response(hits[term] ?? [])),
  );
  const pagefind: PagefindModule = {
    options: () => Promise.resolve(),
    init: () => Promise.resolve(),
    search,
    debouncedSearch: () => Promise.resolve(null),
  };
  const loadPagefind = vi.fn<() => Promise<PagefindModule>>(() => Promise.resolve(pagefind));
  const retriever = createRetriever({
    date,
    firstDate: FIRST,
    fetchJson: fetchJson as RetrieverDeps["fetchJson"],
    loadPagefind,
  });
  return { retriever, fetchJson, search, loadPagefind };
};

const today = digest(DATE, [
  item("japan-zenn-1", "Rust の新版", "Rust 2.0 の話"),
  item("japan-zenn-2", "Astro の話", "静的サイト"),
  item("japan-zenn-3", "Rust と WASM"),
]);

describe("createRetriever: この日", () => {
  it("hands over the rows ranked for the question, linking them on the page", async () => {
    const { retriever, fetchJson } = harness({ "/ask/2026-10-24.json": today });

    const material = await retriever.retrieve("Rust について", "day");

    expect(material.period).toBe("2026-10-24");
    expect(material.blocks.map((block) => block.ref?.href)).toEqual([
      "#japan-zenn-1",
      "#japan-zenn-3",
    ]);
    expect(material.blocks[0]?.variants[0]).toBe("Rust の新版（Zenn）\n要約: Rust 2.0 の話");
    expect(fetchJson).toHaveBeenCalledTimes(1);
  });

  it("falls back to the hero when no row matches", async () => {
    const { retriever } = harness({ "/ask/2026-10-24.json": today });

    const material = await retriever.retrieve("この日の要点を教えて", "day");

    expect(material.blocks).toHaveLength(2);
    expect(material.blocks[0]?.ref).toBeUndefined();
    expect(material.blocks[0]?.variants[0]).toContain("見出し: 2026-10-24 の見出し");
    expect(material.blocks[1]?.variants[0]).toBe("H（HN）: 理由");
  });

  it("fetches the day once and retries a failed fetch", async () => {
    const files: Record<string, unknown> = {};
    const { retriever, fetchJson } = harness(files);

    await expect(retriever.retrieve("Rust", "day")).rejects.toThrow("404");
    files["/ask/2026-10-24.json"] = today;
    await retriever.retrieve("Rust", "day");
    await retriever.retrieve("Astro", "day");

    expect(fetchJson).toHaveBeenCalledTimes(2);
  });
});

describe("createRetriever: 7 / 30 日間 without a topic", () => {
  const files = { "/ask/months/2026-10.json": month("2026-10", DATE, 10, 50) };

  it("summarises from the days of the range, newest packing first, with the top highlights", async () => {
    const { retriever, fetchJson } = harness(files);

    const material = await retriever.retrieve("この 7 日間のまとめ", "week");

    expect(material.period).toBe("2026-10-18〜2026-10-24（7 日間）");
    const days = material.blocks.filter((block) => block.ref?.kind === "day");
    expect(days.map((block) => block.ref?.date)).toEqual([
      "2026-10-18",
      "2026-10-19",
      "2026-10-20",
      "2026-10-21",
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
    ]);
    expect(days.at(-1)?.priority).toBe(0);
    expect(days[0]?.priority).toBe(6);
    const rows = material.blocks.filter((block) => block.ref?.kind === "row");
    expect(rows).toHaveLength(5);
    expect(rows[0]?.ref?.href).toBe("/2026-10-24#global-hackernews-1");
    expect(material.blocks.some((block) => block.ref === undefined)).toBe(false);
    expect(fetchJson.mock.calls.map(([url]) => url)).toEqual(["/ask/months/2026-10.json"]);
  });

  it("adds a count table against the previous period for a trend question", async () => {
    const { retriever } = harness(files);

    const material = await retriever.retrieve("増えている話題は？", "week");

    const table = material.blocks[0];
    expect(table?.ref).toBeUndefined();
    expect(table?.priority).toBe(0);
    expect(table?.variants[0]).toContain("前の期間は 9 件（3 日分）");
    expect(table?.variants[0]).toContain("AI: 14 件（前の期間 6 件、+8）");
    const days = material.blocks.filter((block) => block.ref?.kind === "day");
    expect(days.at(-1)?.priority).toBe(200);
  });

  it("drops the comparison when under half a period lies before the range", async () => {
    const { retriever, fetchJson } = harness(
      { "/ask/months/2026-05.json": month("2026-05", "2026-05-09", 9, 10) },
      {},
      "2026-05-09",
    );

    const material = await retriever.retrieve("増えている話題は？", "week");

    const table = material.blocks[0]?.variants[0];
    expect(table).toContain("記事数: 21 件（7 日分）。カテゴリ別の件数:");
    expect(table).not.toContain("前の期間");
    expect(fetchJson).toHaveBeenCalledTimes(1);
  });

  it("spans two month files for the 30 days", async () => {
    const { retriever, fetchJson } = harness({
      ...files,
      "/ask/months/2026-09.json": month("2026-09", "2026-09-30", 30),
    });

    const material = await retriever.retrieve("この 30 日間のまとめ", "month");

    expect(material.blocks.filter((block) => block.ref?.kind === "day")).toHaveLength(16);
    expect(fetchJson.mock.calls.map(([url]) => url)).toEqual([
      "/ask/months/2026-09.json",
      "/ask/months/2026-10.json",
    ]);
  });
});

describe("createRetriever: a topic across days", () => {
  const files = {
    "/ask/2026-10-20.json": digest("2026-10-20", [
      item("global-hackernews-1", "Rust 1.99", "リリース"),
      item("global-hackernews-2", "Go 2.0"),
    ]),
    "/ask/2026-10-22.json": digest("2026-10-22", [item("japan-zenn-1", "Rust 入門", "基礎")]),
    "/ask/2026-09-01.json": digest("2026-09-01", [item("japan-zenn-1", "Rust 古い")]),
  };
  const hits = {
    rust: [
      hit("2026-10-20", 20, ["global-hackernews-1"]),
      hit("2026-10-22", 5, ["japan-zenn-1"]),
      hit("2026-09-01", 30, ["japan-zenn-1"]),
    ],
  };

  it("searches each term within the range's months and reads the matched rows", async () => {
    const { retriever, search, fetchJson } = harness(files, hits);

    const material = await retriever.retrieve("Rust の最近の動きは？", "week");

    expect(search).toHaveBeenCalledWith("rust", { filters: { month: { any: ["2026-10"] } } });
    expect(material.blocks.map((block) => block.ref?.href)).toEqual([
      "/2026-10-20#global-hackernews-1",
      "/2026-10-22#japan-zenn-1",
    ]);
    expect(material.blocks[0]?.variants.at(-1)).toBe("10月20日 Rust 1.99（Zenn）\n要約: リリース");
    // The September hit is out of range: its day is never fetched.
    expect(fetchJson.mock.calls.map(([url]) => url).toSorted()).toEqual([
      "/ask/2026-10-20.json",
      "/ask/2026-10-22.json",
    ]);
  });

  it("merges the terms' results by page and searches every month up to the page for 全期間", async () => {
    const { retriever, search, fetchJson } = harness(files, {
      ...hits,
      入門: [hit("2026-10-22", 50, ["japan-zenn-1"])],
    });

    const material = await retriever.retrieve("Rust 入門", "all");

    const months = { any: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"] };
    expect(search).toHaveBeenCalledWith("rust", { filters: { month: months } });
    expect(search).toHaveBeenCalledWith("入門", { filters: { month: months } });
    expect(material.period).toBe("2026-05-01〜2026-10-24（177 日間）");
    // Pages in merged order: 2026-10-22 scores 55 across both terms.
    expect(fetchJson.mock.calls.map(([url]) => url)).toEqual([
      "/ask/2026-10-22.json",
      "/ask/2026-09-01.json",
      "/ask/2026-10-20.json",
    ]);
    // The ranker's relevance floor then keeps the one row about both words.
    expect(material.blocks.map((block) => block.ref?.label)).toEqual(["Rust 入門"]);
  });

  it("keeps Pagefind's order when the ranker sees nothing in common", async () => {
    const { retriever } = harness(files, {
      rust: [hit("2026-10-20", 20, ["global-hackernews-2"])],
    });

    // The matched row says nothing the question's tokens meet.
    const material = await retriever.retrieve("Rust", "week");

    expect(material.blocks.map((block) => block.ref?.label)).toEqual(["Go 2.0"]);
  });

  it("hands the rows over by date for a 時系列 question", async () => {
    const { retriever } = harness(files, hits);

    const material = await retriever.retrieve("Rust の動きを時系列で", "all");

    expect(material.blocks.map((block) => block.ref?.date)).toEqual([
      "2026-09-01",
      "2026-10-20",
      "2026-10-22",
    ]);
  });

  it("takes the whole day when the hit was in its hero", async () => {
    const { retriever } = harness(files, { rust: [hit("2026-10-20", 20, [])] });

    const material = await retriever.retrieve("Rust", "week");

    expect(material.blocks.map((block) => block.ref?.label)).toEqual(["Rust 1.99"]);
  });

  it("has nothing to show for a topic no day mentions", async () => {
    const { retriever, fetchJson } = harness(files, {});

    const material = await retriever.retrieve("Zig", "week");

    expect(material.blocks).toEqual([]);
    expect(fetchJson).not.toHaveBeenCalled();
  });
});

describe("createRetriever: 全期間 without a topic", () => {
  const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
  const files = Object.fromEntries(
    months.map((id, i) => [
      `/ask/months/${id}.json`,
      month(id, i === 5 ? DATE : `${id}-28`, 2, 10 * (i + 1)),
    ]),
  );

  it("gives a month-by-month table and the top highlights, no day blocks", async () => {
    const { retriever, fetchJson } = harness(files);

    const material = await retriever.retrieve("月ごとの傾向を教えて", "all");

    expect(material.blocks[0]?.variants[0]).toContain("月ごとの記事数と上位カテゴリ:");
    expect(material.blocks[0]?.variants[0]).toContain(
      "2026-05: 2 日、6 件。上位カテゴリ: AI 4、Web 2",
    );
    expect(material.blocks.slice(1).map((block) => block.ref?.kind)).toEqual([
      "row",
      "row",
      "row",
      "row",
      "row",
    ]);
    expect(material.blocks[1]?.ref?.date).toBe("2026-10-24");
    expect(fetchJson).toHaveBeenCalledTimes(6);
  });
});

describe("createRetriever: warm", () => {
  it("prefetches what a scope needs and nothing more", async () => {
    const { retriever, fetchJson, loadPagefind } = harness({
      "/ask/2026-10-24.json": today,
      "/ask/months/2026-10.json": month("2026-10", DATE, 3),
    });

    retriever.warm("day");
    await Promise.resolve();
    expect(fetchJson.mock.calls.map(([url]) => url)).toEqual(["/ask/2026-10-24.json"]);
    expect(loadPagefind).not.toHaveBeenCalled();

    retriever.warm("week");
    await Promise.resolve();
    expect(fetchJson.mock.calls.map(([url]) => url)).toEqual([
      "/ask/2026-10-24.json",
      "/ask/months/2026-10.json",
    ]);
    expect(loadPagefind).toHaveBeenCalledTimes(1);
  });
});
