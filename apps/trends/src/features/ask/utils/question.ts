/* What a question over several days asks for: the search terms Pagefind
   gets, and whether it is about change over time. The lexical ranker in
   rank.ts stays with the per-day rows; across days the index does the
   matching, and Pagefind segments Japanese itself, so it is handed words,
   not bigrams. The words come from Intl.Segmenter, which every engine with
   the Prompt API has. */

export interface QuestionIntent {
  /** Distinct search terms, question order; empty for a summary question. */
  terms: string[];
  /** Asks how things moved, so counts and deltas are worth more than leads. */
  trend: boolean;
  /** Asks for the order of events, so rows go to the model by date, not by match. */
  timeline: boolean;
}

const TREND =
  /傾向|トレンド|推移|増え|減っ|減り|変化|変わ|流行|多い|多かっ|多く|少な|盛り上が|伸び|比べ|比較/u;
const TIMELINE = /時系列|経緯|流れ|順に|順番|推移|変遷|いつから|いつ頃/u;

/* Grammar and the phrasing a question is made of rather than about, as
   Intl.Segmenter cuts them. */
const GRAMMAR = [
  ..."のはがをにでとへもやかねよなだて",
  "から",
  "まで",
  "より",
  "など",
  "ほど",
  "こそ",
  "でも",
  "けど",
  "この",
  "その",
  "あの",
  "どの",
  "これ",
  "それ",
  "あれ",
  "ここ",
  "そこ",
  "こと",
  "もの",
  "ため",
  "よう",
  "ある",
  "あっ",
  "あり",
  "いる",
  "い",
  "する",
  "し",
  "した",
  "して",
  "され",
  "なる",
  "なっ",
  "です",
  "ます",
  "まし",
  "ください",
  "みたい",
  "らしい",
  "そう",
  "何",
  "なに",
  "どう",
  "どんな",
  "いつ",
  "どこ",
  "誰",
  "だれ",
  "なぜ",
  "どれ",
  "いくつ",
];

/* Asking: 教えて / について / まとめ, and the words of the digest itself
   (記事, スコア) that every day would match. */
const ASKING = [
  "教え",
  "教えて",
  "知り",
  "たい",
  "ほしい",
  "欲しい",
  "ちょうだい",
  "について",
  "に関して",
  "関して",
  "関する",
  "関連",
  "話",
  "まとめ",
  "まとめて",
  "要約",
  "要点",
  "概要",
  "注目",
  "話題",
  "記事",
  "ニュース",
  "スコア",
  "言え",
  "言って",
  "挙げ",
  "挙げて",
  "答え",
  "答えて",
  "説明",
  "詳しく",
  "簡単",
  "短く",
  "長く",
  "一覧",
  "順",
  "件",
  "数",
  "回",
  "全部",
  "すべて",
  "全て",
  "主な",
  "主に",
  "特に",
  "中心",
  "他",
  "ほか",
  "中",
];

/* Time and change: the scope chips settle the period, and `TREND` reads
   the change words, so neither should reach the index. */
const TIME_AND_CHANGE = [
  "最近",
  "今日",
  "本日",
  "今週",
  "先週",
  "今月",
  "先月",
  "週間",
  "日間",
  "ヶ月",
  "か月",
  "期間",
  "全期間",
  "これまで",
  "全体",
  "今期",
  "前期",
  "ごと",
  "毎",
  "別",
  "時系列",
  "系列",
  "動き",
  "動向",
  "傾向",
  "トレンド",
  "推移",
  "変化",
  "流行",
  "比べ",
  "比較",
  "違い",
  "増え",
  "減っ",
  "減り",
  "多い",
  "多かっ",
  "多く",
  "少ない",
  "少なかっ",
  "ない",
  "新しい",
  "新しく",
  "出",
  "出た",
  "一番",
  "最も",
  "高い",
  "高かっ",
  "低い",
  "低かっ",
  "大きな",
  "大きい",
  "小さい",
  "良い",
  "悪い",
  "面白い",
  "重要",
  "人気",
  "盛り上がっ",
];

const STOP = new Set([...GRAMMAR, ...ASKING, ...TIME_AND_CHANGE]);

const segmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter("ja", { granularity: "word" })
    : undefined;

const words = (text: string): string[] =>
  segmenter
    ? [...segmenter.segment(text)].filter((part) => part.isWordLike).map((part) => part.segment)
    : text.split(/\s+/u);

/**
 * The distinct search terms of a question: segmented words with the grammar,
 * the phrasing, bare numbers and lone kana / kanji dropped; Latin lower-cased.
 */
export const searchTerms = (question: string): string[] => {
  const terms = new Set<string>();
  for (const raw of words(question.normalize("NFKC"))) {
    const word = raw.toLowerCase();
    if (STOP.has(word) || /^\d+$/u.test(word)) continue;
    // A one-character Japanese word (新, を) says too little to search for.
    if (!/^[a-z0-9]/u.test(word) && [...word].length < 2) continue;
    terms.add(word);
  }
  return [...terms];
};

export const classifyQuestion = (question: string): QuestionIntent => ({
  terms: searchTerms(question),
  trend: TREND.test(question),
  timeline: TIMELINE.test(question),
});
