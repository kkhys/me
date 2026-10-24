/* The subset of Chrome's Prompt API this feature calls, hand-written like
   the Pagefind types in @kkhys/search: the API is a `LanguageModel` global
   that only Chrome 148+ on desktop defines, and its member names still move
   between releases (contextWindow / contextUsage were inputQuota /
   inputUsage in the origin trial), so both spellings are read. */

export type LanguageModelAvailability =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

export interface LanguageModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LanguageModelPromptOptions {
  signal?: AbortSignal | undefined;
}

export interface LanguageModelSession {
  promptStreaming(input: string, options?: LanguageModelPromptOptions): ReadableStream<string>;
  /** Tokens `input` would add to the session; absent in older builds. */
  measureContextUsage?(input: string): Promise<number>;
  clone(): Promise<LanguageModelSession>;
  destroy(): void;
  readonly contextWindow?: number | undefined;
  readonly contextUsage?: number | undefined;
  readonly inputQuota?: number | undefined;
  readonly inputUsage?: number | undefined;
}

/** A modality the session will see or produce, with its languages (BCP 47). */
export interface LanguageModelExpectation {
  type: "text";
  languages?: string[] | undefined;
}

/* What `availability()` is asked about and `create()` is given: Chrome
   answers for the declared languages (ja is supported, zh reports
   unavailable), so both calls must carry the same declaration. */
export interface LanguageModelExpectations {
  expectedInputs?: LanguageModelExpectation[] | undefined;
  expectedOutputs?: LanguageModelExpectation[] | undefined;
}

export interface LanguageModelCreateOptions extends LanguageModelExpectations {
  initialPrompts?: LanguageModelMessage[];
  /** Receives the download progress target; `downloadprogress` events carry `loaded` in 0–1. */
  monitor?: (monitor: EventTarget) => void;
  signal?: AbortSignal | undefined;
}

export interface LanguageModelStatic {
  availability(options?: LanguageModelExpectations): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

/* What a question is about: the open day, the 7 or 30 days ending on it, or
   every digest up to it. */
export type AskScope = "day" | "week" | "month" | "all";

/* The per-day context the dialog fetches: every row of the digest in display
   order, trimmed to what a question can be answered from, plus the hero. */
export interface AskItem {
  /** Id of the row's h4 (`{group}-{source}-{rank}`), for linking an answer back. */
  anchor: string;
  title: string;
  /** The untranslated title when `title` is a translation, else "". */
  original: string;
  /** Service or product label. */
  source: string;
  /** グローバル / 日本 / アップデート. */
  group: string;
  url: string;
  /** The category chip; the feed name for a release-note entry. */
  category: string;
  summary: string;
  /** The fold text: discussion summary first, else the article summary. */
  detail: string;
}

export interface AskHighlight {
  title: string;
  source: string;
  reason: string;
  /** Row anchor, "" when the highlight has no row. */
  anchor: string;
}

export interface AskDigest {
  date: string;
  headline: string;
  lead: string;
  highlights: AskHighlight[];
  items: AskItem[];
}

/* The per-month context for the wider scopes: one entry per day with the
   hero and counts, but no rows — a week of leads is what fits the model, and
   rows for a topic come from Pagefind plus the per-day JSON instead. */
export interface AskDayHighlight {
  title: string;
  source: string;
  /** Row anchor, "" when the highlight has no row. */
  anchor: string;
  /** The row's score (0–100); 0 for a release note or a highlight without a row. */
  score: number;
}

export interface AskDay {
  date: string;
  headline: string;
  lead: string;
  highlights: AskDayHighlight[];
  /** Rows on the page, release notes included. */
  total: number;
  /** Market rows per top-level category (the part before `/`); uncategorised rows are left out. */
  categories: Record<string, number>;
}

export interface AskMonth {
  /** YYYY-MM */
  month: string;
  /** Ascending by date. */
  days: AskDay[];
}

/* What an answer was given, listed under it as 参考 links. */
export interface AskReference {
  /** A row (its title) or a whole day (its date). */
  kind: "row" | "day";
  label: string;
  /** `#anchor` on the open page, `/<date>#anchor` or `/<date>` elsewhere. */
  href: string;
  date: string;
}
