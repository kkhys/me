import { describe, expect, it } from "vitest";

import type { AskDay, AskDigest, AskItem } from "#/features/ask/types";
import {
  type Block,
  buildQuestionMessage,
  buildSystemPrompt,
  dayBlock,
  estimateTokens,
  heroBlocks,
  highlightBlock,
  packBlocks,
  rowBlock,
  tableBlock,
} from "#/features/ask/utils/context";

const item = (overrides: Partial<AskItem>): AskItem => ({
  anchor: "global-hackernews-1",
  title: "タイトル",
  original: "",
  source: "Hacker News",
  group: "グローバル",
  url: "https://example.com",
  category: "",
  summary: "",
  detail: "",
  ...overrides,
});

describe("estimateTokens", () => {
  it("counts a Japanese character as one token and four Latin characters as one", () => {
    expect(estimateTokens("日本語")).toBe(3);
    expect(estimateTokens("abcdefgh")).toBe(2);
    expect(estimateTokens("日本 ab")).toBe(3);
    expect(estimateTokens("")).toBe(0);
  });
});

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt({ firstDate: "2026-05-01", date: "2026-10-24" });

  it("names the span of the digests and the open day", () => {
    expect(prompt).toContain("2026-05-01 から 2026-10-24");
    expect(prompt).toContain("開いているのは 2026-10-24");
  });

  it("asks for plain text, numbered references and dates in Japanese", () => {
    expect(prompt).toContain("プレーンテキスト");
    expect(prompt).toContain("[1]");
    expect(prompt).toContain("10月18日");
  });
});

// Latin text so the costs are exact: 4 characters make a token, and a
// numbered block pays 2 more for its "[n] ".
const numbered = (letter: string, priority: number, order: number): Block => ({
  priority,
  order,
  variants: [letter.repeat(16), letter.repeat(4)],
  ref: { kind: "row", label: letter, href: `#${letter}`, date: "2026-10-24" },
});

describe("packBlocks", () => {
  const a = numbered("A", 0, 1);
  const b = numbered("B", 1, 0);

  it("fits every block at its leanest before giving any its fuller rendering", () => {
    const { text, refs } = packBlocks([a, b], 6);

    expect(text).toBe("[1] BBBB\n\n[2] AAAA");
    expect(refs.map((ref) => ref.label)).toEqual(["B", "A"]);
  });

  it("steps blocks up by priority, and lays them out by order", () => {
    expect(packBlocks([a, b], 9).text).toBe(`[1] BBBB\n\n[2] ${"A".repeat(16)}`);
    expect(packBlocks([a, b], 12).text).toBe(`[1] ${"B".repeat(16)}\n\n[2] ${"A".repeat(16)}`);
  });

  it("keeps the higher priority when only one fits, and nothing on an empty budget", () => {
    expect(packBlocks([a, b], 5)).toEqual({ text: "[1] AAAA", refs: [a.ref] });
    expect(packBlocks([a, b], 2)).toEqual({ text: "", refs: [] });
  });

  it("skips a block too big even at its leanest instead of stopping", () => {
    const table: Block = { priority: 0, order: 0, variants: ["T".repeat(400)] };
    const { text, refs } = packBlocks([table, a], 5);

    expect(text).toBe("[1] AAAA");
    expect(refs).toEqual([a.ref]);
  });

  it("leaves an unnumbered block out of the references", () => {
    const table = tableBlock("合計 3 件", 0, 0);
    const { text, refs } = packBlocks([table, a], 100);

    expect(text).toBe(`合計 3 件\n\n[1] ${"A".repeat(16)}`);
    expect(refs).toEqual([a.ref]);
  });
});

describe("rowBlock", () => {
  const row = item({ summary: "要約文", detail: "123456789" });

  it("offers the fold trimmed, then the summary alone, and links the row", () => {
    const block = rowBlock(row, "2026-10-24", 2, {
      detailed: true,
      maxDetailChars: 5,
      href: "#global-hackernews-1",
      dated: false,
    });

    expect(block.variants).toEqual([
      "タイトル（Hacker News）\n要約: 要約文\n詳細: 12345…",
      "タイトル（Hacker News）\n要約: 要約文",
    ]);
    expect(block).toMatchObject({
      priority: 2,
      order: 2,
      ref: { kind: "row", label: "タイトル", href: "#global-hackernews-1", date: "2026-10-24" },
    });
  });

  it("names the day on a row from another page and skips empty lines", () => {
    const block = rowBlock(item({}), "2026-10-20", 0, {
      detailed: false,
      maxDetailChars: 10,
      href: "/2026-10-20#global-hackernews-1",
      dated: true,
    });

    expect(block.variants).toEqual(["10月20日 タイトル（Hacker News）"]);
  });
});

describe("heroBlocks", () => {
  const digest: AskDigest = {
    date: "2026-10-24",
    headline: "今日の見出し",
    lead: "今日の概要",
    highlights: [
      { title: "A", source: "Zenn", reason: "理由 A", anchor: "japan-zenn-1" },
      { title: "B", source: "Lobsters", reason: "", anchor: "" },
    ],
    items: [],
  };

  it("offers the headline with the lead, then one numbered block per highlight", () => {
    const [lead, a, b] = heroBlocks(digest);

    expect(lead?.variants).toEqual([
      "見出し: 今日の見出し\n概要: 今日の概要",
      "見出し: 今日の見出し",
    ]);
    expect(lead?.ref).toBeUndefined();
    expect(a?.variants).toEqual(["A（Zenn）: 理由 A", "A（Zenn）"]);
    expect(a?.ref).toEqual({
      kind: "row",
      label: "A",
      href: "#japan-zenn-1",
      date: "2026-10-24",
    });
    expect(b?.variants).toEqual(["B（Lobsters）"]);
    expect(b?.ref).toBeUndefined();
  });

  it("packs the headline before the highlights", () => {
    expect(heroBlocks(digest).map((block) => block.priority)).toEqual([0, 1, 2]);
    expect(heroBlocks({ ...digest, highlights: [] })).toHaveLength(1);
  });
});

describe("dayBlock", () => {
  const day: AskDay = {
    date: "2026-10-18",
    headline: "見出し",
    lead: "概要",
    highlights: [
      { title: "A", source: "Zenn", anchor: "japan-zenn-1", score: 90 },
      { title: "B", source: "Qiita", anchor: "", score: 80 },
      { title: "C", source: "HN", anchor: "", score: 70 },
    ],
    total: 10,
    categories: {},
  };

  it("offers the lead, the highlight titles, then the headline, and links the day", () => {
    const block = dayBlock(day, 3, 1002, 2);

    expect(block.variants).toEqual([
      "10月18日: 見出し\n概要: 概要\n主な記事: A（Zenn）、B（Qiita）",
      "10月18日: 見出し\n主な記事: A（Zenn）、B（Qiita）",
      "10月18日: 見出し",
    ]);
    expect(block).toMatchObject({
      priority: 3,
      order: 1002,
      ref: { kind: "day", label: "2026.10.18", href: "/2026-10-18", date: "2026-10-18" },
    });
  });
});

describe("highlightBlock", () => {
  it("names the day, title and source, linking the row when it has one", () => {
    const block = highlightBlock(
      { title: "A", source: "Zenn", anchor: "japan-zenn-1", score: 90, date: "2026-10-18" },
      1,
      2000,
    );

    expect(block.variants).toEqual(["10月18日 A（Zenn）"]);
    expect(block.ref).toEqual({
      kind: "row",
      label: "A",
      href: "/2026-10-18#japan-zenn-1",
      date: "2026-10-18",
    });
  });

  it("links the day when the highlight has no row", () => {
    expect(
      highlightBlock({ title: "A", source: "Zenn", anchor: "", score: 1, date: "2026-10-18" }, 0, 0)
        .ref?.href,
    ).toBe("/2026-10-18");
  });
});

describe("buildQuestionMessage", () => {
  it("places the period and the references before the question, or なし without any", () => {
    expect(
      buildQuestionMessage({ period: "2026-10-24", references: "[1] x", question: "なぜ？" }),
    ).toBe("期間: 2026-10-24\n\n参考情報:\n[1] x\n\n質問: なぜ？");
    expect(buildQuestionMessage({ period: "2026-10-24", references: "", question: "なぜ？" })).toBe(
      "期間: 2026-10-24\n\n参考情報:\nなし\n\n質問: なぜ？",
    );
  });
});
