import { describe, expect, it } from "vitest";

import { classifyQuestion, searchTerms } from "#/features/ask/utils/question";

describe("searchTerms", () => {
  it("keeps the topic words of a question and drops its grammar and phrasing", () => {
    expect(searchTerms("Rust の最近の動きは？")).toEqual(["rust"]);
    expect(searchTerms("Claude Code の新機能は？")).toEqual(["claude", "code", "機能"]);
    expect(searchTerms("セキュリティ関連で増えている話題")).toEqual(["セキュリティ"]);
    expect(searchTerms("Kimi K3.1 Pro について")).toEqual(["kimi", "k3.1", "pro"]);
  });

  it("is empty for a question that is all phrasing", () => {
    expect(searchTerms("この一週間のまとめ")).toEqual([]);
    expect(searchTerms("増えている話題は？")).toEqual([]);
    expect(searchTerms("最もスコアが高かった記事は？")).toEqual([]);
    expect(searchTerms("月ごとの傾向を教えて")).toEqual([]);
  });

  it("folds full-width forms, lower-cases Latin and keeps each term once", () => {
    expect(searchTerms("Ｒｕｓｔ と rust")).toEqual(["rust"]);
  });
});

describe("classifyQuestion", () => {
  it("flags a question about change over time", () => {
    expect(classifyQuestion("この 30 日間の傾向")).toEqual({
      terms: [],
      trend: true,
      timeline: false,
    });
    expect(classifyQuestion("増えている話題は？").trend).toBe(true);
    expect(classifyQuestion("AI エージェントの話題は減った？").trend).toBe(true);
  });

  it("flags a question about the order of events", () => {
    expect(classifyQuestion("Rust の動きを時系列で")).toEqual({
      terms: ["rust"],
      trend: false,
      timeline: true,
    });
    expect(classifyQuestion("Kimi の経緯は？").timeline).toBe(true);
  });

  it("leaves a plain summary or topic question unflagged", () => {
    expect(classifyQuestion("この 7 日間のまとめ")).toEqual({
      terms: [],
      trend: false,
      timeline: false,
    });
    expect(classifyQuestion("Rust の話題は？")).toEqual({
      terms: ["rust"],
      trend: false,
      timeline: false,
    });
  });
});
