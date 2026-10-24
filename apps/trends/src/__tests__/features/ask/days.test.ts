import { describe, expect, it } from "vitest";

import type { AskDay } from "#/features/ask/types";
import {
  categoryCounts,
  formatCategoryTable,
  formatHighlight,
  formatMonthlyTable,
  topHighlights,
} from "#/features/ask/utils/days";

const day = (
  date: string,
  categories: Record<string, number>,
  highlights: AskDay["highlights"] = [],
): AskDay => ({
  date,
  headline: "",
  lead: "",
  highlights,
  total: Object.values(categories).reduce((n, count) => n + count, 0),
  categories,
});

const highlight = (title: string, score: number, anchor = "") => ({
  title,
  source: "HN",
  anchor,
  score,
});

describe("topHighlights", () => {
  it("ranks by score, newer first on a tie, and leaves out unscored ones", () => {
    const days = [
      day("2026-10-18", {}, [highlight("A", 90), highlight("B", 50)]),
      day("2026-10-19", {}, [highlight("C", 90), highlight("D", 0)]),
    ];

    expect(topHighlights(days, 5).map((h) => `${h.date} ${h.title}`)).toEqual([
      "2026-10-19 C",
      "2026-10-18 A",
      "2026-10-18 B",
    ]);
    expect(topHighlights(days, 1)).toHaveLength(1);
  });
});

describe("categoryCounts / formatCategoryTable", () => {
  const current = [day("2026-10-23", { AI: 10, Web: 2 }), day("2026-10-24", { AI: 5, Rust: 3 })];
  const previous = [day("2026-10-21", { AI: 20 }), day("2026-10-22", { Web: 1 })];

  it("sums the categories over the days", () => {
    expect([...categoryCounts(current)]).toEqual([
      ["AI", 15],
      ["Web", 2],
      ["Rust", 3],
    ]);
  });

  it("lists the largest categories with the previous period's counts and deltas", () => {
    expect(formatCategoryTable(current, previous, 2)).toBe(
      [
        "記事数: 20 件（2 日分）、前の期間は 21 件（2 日分）。カテゴリ別の件数:",
        "AI: 15 件（前の期間 20 件、-5）",
        "Rust: 3 件（前の期間 0 件、+3）",
      ].join("\n"),
    );
  });

  it("lists plain counts without a previous period", () => {
    expect(formatCategoryTable(current, undefined, 3)).toBe(
      ["記事数: 20 件（2 日分）。カテゴリ別の件数:", "AI: 15 件", "Rust: 3 件", "Web: 2 件"].join(
        "\n",
      ),
    );
  });
});

describe("formatMonthlyTable", () => {
  it("gives each month its days, rows and largest categories, ascending", () => {
    const days = [
      day("2026-09-29", { AI: 4, Web: 1 }),
      day("2026-09-30", { AI: 1 }),
      day("2026-10-01", { Rust: 2 }),
    ];

    expect(formatMonthlyTable(days, 1)).toBe(
      [
        "月ごとの記事数と上位カテゴリ:",
        "2026-09: 2 日、6 件。上位カテゴリ: AI 5",
        "2026-10: 1 日、2 件。上位カテゴリ: Rust 2",
      ].join("\n"),
    );
  });
});

describe("formatHighlight", () => {
  it("names the day, title and source", () => {
    expect(formatHighlight({ ...highlight("A", 1), date: "2026-10-05" })).toBe("10月5日 A（HN）");
  });
});
