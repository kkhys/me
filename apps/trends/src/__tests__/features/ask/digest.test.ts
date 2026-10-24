import { describe, expect, it } from "vitest";

import { type AskRun, buildAskDigest } from "#/features/ask/utils/digest";

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

const run: AskRun = {
  date: "2026-10-24",
  digest: {
    headline: "見出し",
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
        title: "Gone",
        title_ja: "",
        url: "https://example.com/gone",
        service_label: "Zenn",
        reason: "消えた",
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
            item({
              title: "Astro 入門",
              category: "tech",
              summary: "静的サイト",
              article_summary: "本文の要約",
            }),
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
          items: [
            item({
              title: "Rust 2.0",
              title_ja: "Rust 2.0 が出た",
              url: "https://example.com/rust",
              discussion_summary: "議論",
              article_summary: "記事",
            }),
            item({ title: "Second", url: "https://example.com/second" }),
          ],
        },
        {
          id: "lobsters",
          label: "Lobsters",
          items: [
            item({
              title: "Rust 2.0",
              title_ja: "Rust 2.0 が出た",
              url: "https://example.com/rust",
            }),
          ],
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
          title: "Opus 5.5",
          title_ja: "Opus 5.5 登場",
          url: "https://example.com/opus",
          source: "Platform",
          summary: "新モデル",
          article_summary: "変更点",
        },
      ],
    },
  ],
};

describe("buildAskDigest", () => {
  const digest = buildAskDigest(run);

  it("lists the rows in page order: global, japan, then the updates", () => {
    expect(digest.items.map((i) => i.anchor)).toEqual([
      "global-hackernews-1",
      "global-hackernews-2",
      "global-lobsters-1",
      "japan-zenn-1",
      "updates-claude-1",
    ]);
  });

  it("prefers the Japanese title and keeps the original beside it", () => {
    expect(digest.items[0]).toMatchObject({ title: "Rust 2.0 が出た", original: "Rust 2.0" });
    expect(digest.items[1]).toMatchObject({ title: "Second", original: "" });
  });

  it("takes the discussion summary as the detail before the article summary", () => {
    expect(digest.items[0]?.detail).toBe("議論");
    expect(digest.items[3]?.detail).toBe("本文の要約");
  });

  it("names the group and source of each row", () => {
    expect(digest.items[0]).toMatchObject({
      group: "グローバル",
      source: "Hacker News",
      category: "",
    });
    expect(digest.items[3]).toMatchObject({ group: "日本", source: "Zenn", category: "tech" });
  });

  it("files a release note under アップデート with its feed as the category", () => {
    expect(digest.items[4]).toMatchObject({
      group: "アップデート",
      source: "Claude",
      category: "Platform",
      title: "Opus 5.5 登場",
      detail: "変更点",
    });
  });

  it("carries the hero with highlight anchors resolved to their rows", () => {
    expect(digest).toMatchObject({ date: "2026-10-24", headline: "見出し", lead: "概要" });
    expect(digest.highlights).toEqual([
      { title: "Rust 2.0 が出た", source: "Lobsters", reason: "大型", anchor: "global-lobsters-1" },
      { title: "Gone", source: "Zenn", reason: "消えた", anchor: "" },
    ]);
  });

  it("does not mutate the run's market order", () => {
    expect(run.markets.map((m) => m.id)).toEqual(["japan", "global"]);
  });
});
