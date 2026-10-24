/* Picks the rows worth showing the model for a question. Gemini Nano's
   context window cannot hold a whole day (25k+ characters of folds alone),
   so this lexical pass runs first, with no model call: Latin words as they
   are, Japanese as character bigrams plus lone kanji (no segmenter needed),
   scored BM25-style against the row's text. */

export interface Rankable {
  title: string;
  original: string;
  summary: string;
  category: string;
  source: string;
  group: string;
  detail: string;
}

const WORD = /[a-z0-9][a-z0-9.+#_-]*|[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}ー々]+/gu;
const HAN = /^\p{sc=Han}$/u;
const HIRAGANA = /^\p{sc=Hiragana}$/u;
/* A bigram touching a particle is grammar, not topic: 日の / の注 in
   「今日の注目」 would otherwise match every row mentioning a date. */
const PARTICLES = new Set("のはがをにでとへもやかね");

/* Bigrams, plus every kanji on its own so a one-character word (型, 猫) and
   a word split by a particle (型の話) still meet the rows. Kana alone say
   nothing (ス, ー), so they only count inside a bigram. */
const cjkGrams = (run: string): string[] => {
  const chars = [...run];
  const grams: string[] = [];
  chars.forEach((a, i) => {
    if (HAN.test(a)) grams.push(a);
    const b = chars[i + 1];
    if (b === undefined) return;
    if (PARTICLES.has(a) || PARTICLES.has(b)) return;
    if (HIRAGANA.test(a) && HIRAGANA.test(b)) return;
    grams.push(a + b);
  });
  return grams;
};

/** Lower-cased Latin words, Japanese bigrams and lone kanji, in order, duplicates kept. */
export const tokenize = (text: string): string[] => {
  const tokens: string[] = [];
  for (const [token] of text.normalize("NFKC").toLowerCase().matchAll(WORD)) {
    if (/^[a-z0-9]/u.test(token)) {
      const word = token.replace(/[._-]+$/u, "");
      if (word) tokens.push(word);
    } else {
      tokens.push(...cjkGrams(token));
    }
  }
  return tokens;
};

/* Phrasing a question is made of rather than about. Cut out as whole
   strings before tokenizing: as bigrams they would straddle into the topic
   (て教 of について教えて) and pull in rows by accident, and as lone kanji
   (日 of この日) they would meet every row's group (日本). A question that
   is all phrasing (この日の要点を教えて) is left with no tokens, so it gets
   no rows and the model answers from the hero instead. The period words are
   here because the scope chips settle them. */
const QUESTION_PHRASING =
  /について|に関して|教えて|知りたい|話題|記事|この日|今日|最近|要点|注目|詳しく|まとめて|まとめ|一週間|週間|日間|今週|先週|今月|先月|全期間|期間|これまで|時系列|傾向|トレンド|推移|増え|減っ|動き|スコア|高かった|一番|最も/gu;

/** The distinct tokens of a question, its phrasing cut out first. */
export const questionTokens = (question: string): string[] => [
  ...new Set(tokenize(question.normalize("NFKC").replaceAll(QUESTION_PHRASING, " "))),
];

/* Field weights: a title hit says more than one buried in a fold. */
const FIELDS: readonly (readonly [keyof Rankable, number])[] = [
  ["title", 3],
  ["original", 3],
  ["category", 2],
  ["source", 2],
  ["group", 2],
  ["summary", 1],
  ["detail", 0.5],
];

/* Rows scoring under this share of the best match are tail noise: they
   would spend context on a row the question barely touches. */
const MIN_SCORE_RATIO = 0.25;

const termFrequencies = (item: Rankable): Map<string, number> => {
  const frequencies = new Map<string, number>();
  for (const [field, weight] of FIELDS) {
    for (const token of tokenize(item[field])) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + weight);
    }
  }
  return frequencies;
};

/**
 * The `limit` rows most relevant to `question`, best first; rows sharing no
 * token with it, or scoring far below the best one, are left out, so an
 * unrelated question yields none.
 */
export const rankItems = <T extends Rankable>(
  question: string,
  items: readonly T[],
  limit: number,
): T[] => {
  const query = questionTokens(question);
  if (query.length === 0 || limit <= 0) return [];

  const documents = items.map((item) => termFrequencies(item));
  const idf = new Map(
    query.map((token) => {
      const matching = documents.filter((document) => document.has(token)).length;
      return [token, Math.log(1 + (items.length - matching + 0.5) / (matching + 0.5))];
    }),
  );

  const scored = items
    .map((item, index) => {
      const document = documents[index];
      const score = query.reduce((total, token) => {
        const frequency = document?.get(token) ?? 0;
        if (frequency === 0) return total;
        return total + (idf.get(token) ?? 0) * (frequency / (frequency + 1));
      }, 0);
      return { item, index, score };
    })
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score || a.index - b.index);
  const floor = (scored[0]?.score ?? 0) * MIN_SCORE_RATIO;

  return scored
    .filter(({ score }) => score >= floor)
    .slice(0, limit)
    .map(({ item }) => item);
};
