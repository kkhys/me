import { describe, expect, it } from "vitest";
import { filterMemos } from "../memo-filter";

const memos = [
  { body: "右フックのコンビネーション", createdAt: "2026-06-29 19:55:00", tag: "boxing" },
  { body: "Howも良いけど、Whyの記事を多く書きたい。", createdAt: "2026-06-24 20:35:56" },
  { body: "Astro のビルドを速くしたい", createdAt: "2026-05-01 10:00:00", tag: "dev" },
];

describe("filterMemos", () => {
  it("returns all memos for an empty or whitespace query", () => {
    expect(filterMemos(memos, "")).toEqual(memos);
    expect(filterMemos(memos, "   ")).toEqual(memos);
  });

  it("matches body text case-insensitively", () => {
    expect(filterMemos(memos, "astro")).toEqual([memos[2]]);
    expect(filterMemos(memos, "フック")).toEqual([memos[0]]);
  });

  it("matches by tag", () => {
    expect(filterMemos(memos, "boxing")).toEqual([memos[0]]);
  });

  it("matches by createdAt substring", () => {
    expect(filterMemos(memos, "2026-06")).toEqual([memos[0], memos[1]]);
  });

  it("ANDs whitespace-separated terms", () => {
    expect(filterMemos(memos, "2026-06 boxing")).toEqual([memos[0]]);
    expect(filterMemos(memos, "astro boxing")).toEqual([]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterMemos(memos, "nonexistent")).toEqual([]);
  });
});
