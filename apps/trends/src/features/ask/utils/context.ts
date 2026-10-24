import type { AskDay, AskDigest, AskItem, AskReference } from "#/features/ask/types";
import { type DatedHighlight, formatHighlight } from "#/features/ask/utils/days";
import { jaDate } from "#/features/ask/utils/scope";
import { formatRunDate } from "#/utils/runs";

const CJK = /[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}]/gu;

/* Rough token count for budgeting: Gemini's tokenizer spends about one
   token per Japanese character and one per four Latin characters. It
   overestimates on purpose, since the budget it serves must hold. */
export const estimateTokens = (text: string): number => {
  const cjk = text.match(CJK)?.length ?? 0;
  return cjk + Math.ceil((text.length - cjk) / 4);
};

export interface PromptDates {
  /** The first run, so the model knows how far back the digests go. */
  firstDate: string;
  /** The open page. */
  date: string;
}

/* The system prompt holds only the rules, so one base session serves every
   scope; what a question is about (the hero, rows, days, counts) travels in
   the question itself as numbered 参考情報. */
export const buildSystemPrompt = ({ firstDate, date }: PromptDates): string =>
  [
    "あなたは Trend Digest（技術ニュースの日次ダイジェスト）の読者を手伝うアシスタントです。",
    `ダイジェストは ${firstDate} から ${date} まで毎日 1 本あり、読者が開いているのは ${date} の分です。`,
    "",
    "回答のルール:",
    "- 日本語で簡潔に答える。Markdown 記法は使わず、プレーンテキストで書く。見出しや太字（#、**）は付けない。項目を並べるなら行頭に「・」を置く。",
    "- 質問には対象の「期間」と「参考情報」が添えられる。参考情報だけを根拠に答え、使った項目は先頭の [1] のような番号をそのまま示す。番号のない参考情報には番号を付けない。",
    "- 期間が複数日なら、日付は 10月18日 のように書き、流れが分かるように時系列でまとめる。",
    "- 参考情報に該当がなければ「このダイジェストには載っていない」と伝え、記事や数字を推測で作らない。",
  ].join("\n");

/* One piece of 参考情報. Blocks are packed into the room the session has
   (`packBlocks`), so each offers its renderings from fullest to leanest and
   says how much it matters relative to the others. */
export interface Block {
  /** Packing order: lower packs first. */
  priority: number;
  /** Position in the message, independent of priority. */
  order: number;
  /** Renderings, fullest first; the leanest is the last. Never empty. */
  variants: readonly string[];
  /** Numbered `[n]` in the message and listed under the answer when set. */
  ref?: AskReference | undefined;
}

export interface PackedBlocks {
  text: string;
  /** The numbered blocks that made it in, in message order. */
  refs: AskReference[];
}

/** Tokens the `[n] ` prefix of a numbered block adds. */
const NUMBER_TOKENS = 2;

/**
 * Lays `blocks` out within `budgetTokens`: first every block that fits at its
 * leanest, by priority; then, while room remains, each is stepped up one
 * rendering at a time in priority order, so a week gets all its headlines
 * before any day gets its lead. A block that does not fit even at its leanest
 * is skipped, not fatal: a count table may be too big where a headline is not.
 */
export const packBlocks = (blocks: readonly Block[], budgetTokens: number): PackedBlocks => {
  const indexed = blocks.map((block, index) => ({ block, index }));
  const byPriority = indexed.toSorted(
    (a, b) => a.block.priority - b.block.priority || a.index - b.index,
  );
  const cost = (block: Block, tier: number) =>
    estimateTokens(block.variants[tier] ?? "") + (block.ref ? NUMBER_TOKENS : 0);

  const tiers = new Map<number, number>();
  let used = 0;

  for (const { block, index } of byPriority) {
    const leanest = block.variants.length - 1;
    const tokens = cost(block, leanest);
    if (used + tokens > budgetTokens) continue;
    tiers.set(index, leanest);
    used += tokens;
  }

  for (let upgraded = true; upgraded;) {
    upgraded = false;
    for (const { block, index } of byPriority) {
      const tier = tiers.get(index);
      if (tier === undefined || tier === 0) continue;
      const delta = cost(block, tier - 1) - cost(block, tier);
      if (used + delta > budgetTokens) continue;
      tiers.set(index, tier - 1);
      used += delta;
      upgraded = true;
    }
  }

  const refs: AskReference[] = [];
  const parts: string[] = [];
  const picked = indexed
    .filter(({ index }) => tiers.has(index))
    .toSorted((a, b) => a.block.order - b.block.order || a.index - b.index);
  for (const { block, index } of picked) {
    const text = block.variants[tiers.get(index) ?? 0] ?? "";
    if (block.ref) {
      refs.push(block.ref);
      parts.push(`[${refs.length}] ${text}`);
    } else {
      parts.push(text);
    }
  }
  return { text: parts.join("\n\n"), refs };
};

const trimDetail = (detail: string, maxChars: number): string =>
  detail.length > maxChars ? `${detail.slice(0, maxChars)}…` : detail;

export interface RowBlockOptions {
  /** Also offer the fold, trimmed to `maxDetailChars`. */
  detailed: boolean;
  maxDetailChars: number;
  /** Where the 参考 link goes. */
  href: string;
  /** Name the day on the title line (cross-day rows). */
  dated: boolean;
}

/** One row as 参考情報: title and source, its summary, and its fold when offered. */
export const rowBlock = (
  item: AskItem,
  date: string,
  rank: number,
  options: RowBlockOptions,
): Block => {
  const title = `${options.dated ? `${jaDate(date)} ` : ""}${item.title}（${item.source}）`;
  const plain = item.summary ? `${title}\n要約: ${item.summary}` : title;
  const variants =
    options.detailed && item.detail
      ? [`${plain}\n詳細: ${trimDetail(item.detail, options.maxDetailChars)}`, plain]
      : [plain];
  return {
    priority: rank,
    order: rank,
    variants,
    ref: { kind: "row", label: item.title, href: options.href, date },
  };
};

/* The open day's hero, for a question no row answers (この日の要点): the
   headline always and the lead when there is room, then one numbered block
   per highlight (its reason when there is room) linking the row it came
   from, so the answer's [n] lead somewhere. */
export const heroBlocks = (digest: AskDigest): Block[] => {
  const headline = `見出し: ${digest.headline}`;
  const lead: Block = {
    priority: 0,
    order: 0,
    variants: [`${headline}\n概要: ${digest.lead}`, headline],
  };
  const highlights = digest.highlights.map((highlight, i): Block => {
    const title = `${highlight.title}（${highlight.source}）`;
    return {
      priority: 1 + i,
      order: 1 + i,
      variants: highlight.reason ? [`${title}: ${highlight.reason}`, title] : [title],
      ref: highlight.anchor
        ? { kind: "row", label: highlight.title, href: `#${highlight.anchor}`, date: digest.date }
        : undefined,
    };
  });
  return [lead, ...highlights];
};

/* One day of a wider scope: its headline always, its highlight titles when
   there is room, its lead when there is more. Links to the day's page. */
export const dayBlock = (
  day: AskDay,
  priority: number,
  order: number,
  highlightLimit: number,
): Block => {
  const headline = `${jaDate(day.date)}: ${day.headline}`;
  const titles = day.highlights
    .slice(0, highlightLimit)
    .map((highlight) => `${highlight.title}（${highlight.source}）`)
    .join("、");
  const withHighlights = titles ? `${headline}\n主な記事: ${titles}` : headline;
  const withLead = `${headline}\n概要: ${day.lead}${titles ? `\n主な記事: ${titles}` : ""}`;
  return {
    priority,
    order,
    variants: titles ? [withLead, withHighlights, headline] : [withLead, headline],
    ref: { kind: "day", label: formatRunDate(day.date), href: `/${day.date}`, date: day.date },
  };
};

/** A top-scored highlight of the period, linking to its row. */
export const highlightBlock = (
  highlight: DatedHighlight,
  priority: number,
  order: number,
): Block => ({
  priority,
  order,
  variants: [formatHighlight(highlight)],
  ref: {
    kind: "row",
    label: highlight.title,
    href: highlight.anchor ? `/${highlight.date}#${highlight.anchor}` : `/${highlight.date}`,
    date: highlight.date,
  },
});

/** A count table (`days.ts`); unnumbered, all or nothing. */
export const tableBlock = (text: string, priority: number, order: number): Block => ({
  priority,
  order,
  variants: [text],
});

export interface QuestionMessage {
  /** `describeRange` of the scope. */
  period: string;
  /** `packBlocks(...).text` */
  references: string;
  question: string;
}

export const buildQuestionMessage = ({ period, references, question }: QuestionMessage): string =>
  `期間: ${period}\n\n参考情報:\n${references || "なし"}\n\n質問: ${question}`;
