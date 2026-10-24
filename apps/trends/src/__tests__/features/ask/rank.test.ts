import { describe, expect, it } from "vitest";

import { questionTokens, rankItems, tokenize } from "#/features/ask/utils/rank";

type Field = "original" | "category" | "source" | "group" | "detail";

const row = (title: string, summary = "", extra: Partial<Record<Field, string>> = {}) => ({
  title,
  summary,
  original: extra.original ?? "",
  category: extra.category ?? "",
  source: extra.source ?? "",
  group: extra.group ?? "",
  detail: extra.detail ?? "",
});

describe("tokenize", () => {
  it("lower-cases Latin words and keeps their inner punctuation", () => {
    expect(tokenize("Node.js and C++ in Rust")).toEqual(["node.js", "and", "c++", "in", "rust"]);
  });

  it("drops trailing dots and hyphens from a word", () => {
    expect(tokenize("etc. end-")).toEqual(["etc", "end"]);
  });

  it("turns a Japanese run into character bigrams, each kanji on its own too", () => {
    expect(tokenize("注目記事")).toEqual(["注", "注目", "目", "目記", "記", "記事", "事"]);
    expect(tokenize("ライブラリ")).toEqual(["ライ", "イブ", "ブラ", "ラリ"]);
  });

  it("skips grammar: all-hiragana bigrams and those touching a particle", () => {
    expect(tokenize("今日の注目は")).toEqual(["今", "今日", "日", "注", "注目", "目"]);
    expect(tokenize("ついに")).toEqual([]);
    expect(tokenize("の")).toEqual([]);
    expect(tokenize("ー")).toEqual([]);
  });

  it("keeps a lone kanji and folds full-width forms", () => {
    expect(tokenize("猫")).toEqual(["猫"]);
    expect(tokenize("Ｒｕｓｔ")).toEqual(["rust"]);
  });
});

describe("questionTokens", () => {
  it("cuts out the phrasing of a question and keeps each token once", () => {
    expect(questionTokens("Rust の話題は？ Rust")).toEqual(["rust"]);
    expect(questionTokens("Kimi K3.1 について教えて")).toEqual(["kimi", "k3.1"]);
  });

  it("leaves nothing for a question that is all phrasing", () => {
    expect(questionTokens("今日の要点を教えて")).toEqual([]);
  });
});

describe("rankItems", () => {
  const items = [
    row("Rust 2.0 がリリース", "新しいエディション", { source: "Hacker News" }),
    row("Astro 7 の新機能", "静的サイトの話", { category: "tech" }),
    row("Go のジェネリクス", "型の話", { detail: "Rust との比較も少し" }),
    row("ニュース", "", { original: "Rust in the Linux kernel" }),
  ];

  it("returns only rows that share a token with the question, best first", () => {
    const ranked = rankItems("Rust について", items, 10);

    expect(ranked.map((r) => r.title)).toEqual([
      "Rust 2.0 がリリース",
      "ニュース",
      "Go のジェネリクス",
    ]);
  });

  it("matches Japanese by bigram", () => {
    expect(rankItems("静的サイト", items, 10).map((r) => r.title)).toEqual(["Astro 7 の新機能"]);
  });

  it("is case-insensitive for Latin words", () => {
    expect(rankItems("ASTRO", items, 10).map((r) => r.title)).toEqual(["Astro 7 の新機能"]);
  });

  it("honours the limit", () => {
    expect(rankItems("Rust", items, 1).map((r) => r.title)).toEqual(["Rust 2.0 がリリース"]);
    expect(rankItems("Rust", items, 0)).toEqual([]);
  });

  it("yields nothing for a question made of grammar or phrasing only", () => {
    expect(rankItems("これは", items, 10)).toEqual([]);
    expect(rankItems("今日の要点を教えて", items, 10)).toEqual([]);
    expect(rankItems("", items, 10)).toEqual([]);
  });

  it("drops rows far below the best match", () => {
    // Every row says モデル somewhere; only two are about Kimi.
    const rows = [
      row("Kimi K3.1 Pro", "新モデル"),
      row("Kimi の高速版", "Kimi K3.1 Highspeed モデル"),
      row("Python 認定試験", "学習モデル"),
      row("ベンチマーク", "モデルの比較"),
    ];

    expect(rankItems("Kimi モデル", rows, 10).map((r) => r.title)).toEqual([
      "Kimi の高速版",
      "Kimi K3.1 Pro",
    ]);
  });

  it("matches the market or update group a row sits in", () => {
    const rows = [
      row("Rust", "", { group: "グローバル" }),
      row("Zenn の記事", "", { group: "日本" }),
      row("Qiita の記事", "", { group: "日本" }),
    ];

    expect(rankItems("日本で話題の記事は？", rows, 10).map((r) => r.title)).toEqual([
      "Zenn の記事",
      "Qiita の記事",
    ]);
  });

  it("keeps page order between equal scores", () => {
    const twins = [row("型の話"), row("型の話")];

    expect(rankItems("型", twins, 10)).toEqual(twins);
  });
});
