export interface ExcerptPart {
  text: string;
  marked: boolean;
}

const MARK_PATTERN = /<mark>([\s\S]*?)<\/mark>/gu;

// Pagefind escapes only `<` and `>` in the page text before wrapping matches
// in `<mark>`, so those are the only entities to undo; everything else in the
// excerpt is literal text.
const decodeText = (text: string): string => text.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

// The excerpt is rendered as text nodes plus real <mark> elements rather than
// through innerHTML: the indexed text contains HTML in code samples and titles
// fetched from external sites for link cards, and relying on Pagefind's
// runtime escaping to keep that inert ties safety to an implementation detail.
export const parseExcerpt = (excerpt: string): ExcerptPart[] => {
  const parts: ExcerptPart[] = [];
  const push = (text: string, marked: boolean) => {
    if (text !== "") parts.push({ text: decodeText(text), marked });
  };
  let cursor = 0;
  for (const match of excerpt.matchAll(MARK_PATTERN)) {
    push(excerpt.slice(cursor, match.index), false);
    push(match[1] ?? "", true);
    cursor = match.index + match[0].length;
  }
  push(excerpt.slice(cursor), false);
  return parts;
};
