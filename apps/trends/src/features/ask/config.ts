import type { AskScope } from "#/features/ask/types";

interface AskScopeConfig {
  id: AskScope;
  label: string;
  placeholder: string;
  suggestions: readonly string[];
}

interface AskConfig {
  dialogId: string;
  /** Where the per-day context JSON is served from (`pages/ask/[date].json.ts`). */
  endpoint: (date: string) => string;
  /** Where the per-month context JSON is served from (`pages/ask/months/[month].json.ts`). */
  monthEndpoint: (month: string) => string;
  /** Most rows handed to the model with one question. */
  maxReferences: number;
  /** How many of those also carry their fold (記事 / コメントの要約). */
  detailedReferences: number;
  maxDetailChars: number;
  /** Tokens kept free for the answer when sizing the references. */
  answerReserveTokens: number;
  /** Reference budget when the session exposes no context window. */
  fallbackBudgetTokens: number;
  /**
   * Cross-day retrieval: Pagefind pages read for their date, and days whose
   * rows are fetched (one JSON each, ~20KB gzip; a 時系列 answer is only as
   * long as the days it sees).
   */
  searchResults: number;
  searchDays: number;
  /** Highest-scored highlights of a period listed for the model. */
  topHighlights: number;
  /** Categories named in a trend table. */
  tableCategories: number;
  /** Highlight titles named under a day's headline. */
  dayHighlights: number;
  /** In display order; the first is the default. */
  scopes: readonly AskScopeConfig[];
}

export const askConfig = {
  dialogId: "ask-dialog",
  endpoint: (date) => `/ask/${date}.json`,
  monthEndpoint: (month) => `/ask/months/${month}.json`,
  maxReferences: 6,
  detailedReferences: 3,
  maxDetailChars: 480,
  answerReserveTokens: 512,
  fallbackBudgetTokens: 2048,
  searchResults: 10,
  searchDays: 6,
  topHighlights: 5,
  tableCategories: 8,
  dayHighlights: 3,
  scopes: [
    {
      id: "day",
      label: "この日",
      placeholder: "この日のダイジェストについて質問",
      suggestions: ["この日の要点を教えて", "AI モデルの新しい話題は？", "日本で話題の記事は？"],
    },
    {
      id: "week",
      label: "7日間",
      placeholder: "この 7 日間について質問",
      suggestions: ["この 7 日間のまとめ", "増えている話題は？", "Claude Code の動きは？"],
    },
    {
      id: "month",
      label: "30日間",
      placeholder: "この 30 日間について質問",
      suggestions: ["この 30 日間の傾向", "最もスコアが高かった記事は？", "セキュリティの話題は？"],
    },
    {
      id: "all",
      label: "全期間",
      placeholder: "全期間のダイジェストについて質問",
      suggestions: ["月ごとの傾向を教えて", "Rust の動きを時系列で", "最も多いカテゴリは？"],
    },
  ],
} as const satisfies AskConfig;
