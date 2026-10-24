import { describe, expect, it } from "vitest";

import type { AskRun } from "#/features/ask/utils/digest";
import { buildAskDay, buildAskMonth, topCategory } from "#/features/ask/utils/month";

const item = (
  overrides: Partial<AskRun["markets"][number]["services"][number]["items"][number]>,
) => ({
  title: "Title",
  title_ja: "",
  url: "https://example.com/a",
  category: "",
  score: 0,
  summary: "",
  discussion_summary: "",
  article_summary: "",
  ...overrides,
});

const run = (date: string): AskRun => ({
  date,
  digest: {
    headline: `${date} の見出し`,
    lead: "概要",
    highlights: [
      {
        title: "Rust 2.0",
        title_ja: "Rust 2.0 が出た",
        url: "https://example.com/rust",
        service_label: "Lobsters",
        reason: "大型",
      },
      {
        title: "Opus",
        title_ja: "",
        url: "https://example.com/opus",
        service_label: "Claude",
        reason: "新モデル",
      },
    ],
  },
  markets: [
    {
      id: "japan",
      label: "日本",
      services: [
        {
          id: "zenn",
          label: "Zenn",
          items: [
            item({ category: "AI/LLM", score: 70 }),
            item({ category: "AI / 開発", score: 10, url: "https://example.com/b" }),
            item({ url: "https://example.com/c" }),
          ],
        },
      ],
    },
    {
      id: "global",
      label: "グローバル",
      services: [
        {
          id: "hackernews",
          label: "Hacker News",
          items: [item({ url: "https://example.com/rust", category: "Rust", score: 85 })],
        },
        {
          id: "lobsters",
          label: "Lobsters",
          items: [item({ url: "https://example.com/rust", category: "Rust", score: 60 })],
        },
      ],
    },
  ],
  updates: [
    {
      id: "claude",
      label: "Claude",
      items: [
        {
          title: "Opus",
          title_ja: "",
          url: "https://example.com/opus",
          source: "Platform",
          summary: "",
          article_summary: "",
        },
      ],
    },
  ],
});

describe("topCategory", () => {
  it("keeps the part before the slash, trimmed", () => {
    expect(topCategory("AI/LLM")).toBe("AI");
    expect(topCategory("AI / 開発")).toBe("AI");
    expect(topCategory("セキュリティ")).toBe("セキュリティ");
    expect(topCategory("")).toBe("");
  });
});

describe("buildAskDay", () => {
  const day = buildAskDay(run("2026-10-24"));

  it("counts market rows per top-level category, leaving uncategorised ones out", () => {
    expect(day.categories).toEqual({ AI: 2, Rust: 2 });
  });

  it("counts every row on the page, release notes included", () => {
    expect(day.total).toBe(6);
  });

  it("gives each highlight its row's best score and anchor", () => {
    expect(day.highlights).toEqual([
      { title: "Rust 2.0 が出た", source: "Lobsters", anchor: "global-lobsters-1", score: 85 },
      { title: "Opus", source: "Claude", anchor: "updates-claude-1", score: 0 },
    ]);
  });

  it("carries the hero", () => {
    expect(day).toMatchObject({
      date: "2026-10-24",
      headline: "2026-10-24 の見出し",
      lead: "概要",
    });
  });
});

describe("buildAskMonth", () => {
  it("keeps the runs of the month, ascending", () => {
    const month = buildAskMonth("2026-10", [
      run("2026-10-24"),
      run("2026-09-30"),
      run("2026-10-01"),
    ]);

    expect(month.month).toBe("2026-10");
    expect(month.days.map((day) => day.date)).toEqual(["2026-10-01", "2026-10-24"]);
  });
});
