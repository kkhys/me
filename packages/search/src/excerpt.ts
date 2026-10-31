export interface ExcerptPart {
  text: string;
  marked: boolean;
}

const MARK_OPEN = "<mark>";
const MARK_CLOSE = "</mark>";

// Pagefind escapes only `<` and `>` in the page text before wrapping matches
// in `<mark>`, so those are the only entities to undo; everything else in the
// excerpt is literal text.
const decodeText = (text: string): string => text.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

// The excerpt is rendered as text nodes plus real <mark> elements rather than
// through innerHTML: the indexed text contains HTML (code samples, prose, and
// titles fetched from external sites for link cards), and relying on
// Pagefind's runtime escaping to keep that inert ties safety to an
// implementation detail.
export const parseExcerpt = (excerpt: string): ExcerptPart[] => {
  const parts: ExcerptPart[] = [];
  const push = (text: string, marked: boolean) => {
    if (text !== "") parts.push({ text: decodeText(text), marked });
  };
  // indexOf rather than a lazy `<mark>([\s\S]*?)</mark>` regex: that rescans
  // to the end of the string for every unclosed `<mark>`, which is quadratic
  // on hostile input.
  let cursor = 0;
  let open = excerpt.indexOf(MARK_OPEN);
  while (open !== -1) {
    const close = excerpt.indexOf(MARK_CLOSE, open + MARK_OPEN.length);
    if (close === -1) break;
    push(excerpt.slice(cursor, open), false);
    push(excerpt.slice(open + MARK_OPEN.length, close), true);
    cursor = close + MARK_CLOSE.length;
    open = excerpt.indexOf(MARK_OPEN, cursor);
  }
  push(excerpt.slice(cursor), false);
  return parts;
};

// Pagefind joins block elements with ". " (or a space when the block already
// ends in punctuation), so a section excerpt that starts at the section's
// heading reads "Heading. Body…".
const SEPARATOR_PATTERN = /^\.?\s*/u;

/**
 * Drops `prefix` from the front of a parsed excerpt, plus the separator that
 * follows it, so a result row that already shows the heading does not repeat
 * it in the excerpt. The parts come back unchanged when the excerpt does not
 * start with `prefix`; `<mark>` boundaries inside the prefix are preserved.
 */
export const stripLeadingText = (parts: readonly ExcerptPart[], prefix: string): ExcerptPart[] => {
  if (prefix === "") return [...parts];
  let remaining = prefix;
  let index = 0;
  let carry: ExcerptPart | undefined;
  while (remaining !== "" && index < parts.length) {
    const part = parts[index];
    if (part === undefined) break;
    if (part.text.length <= remaining.length) {
      if (!remaining.startsWith(part.text)) return [...parts];
      remaining = remaining.slice(part.text.length);
    } else {
      if (!part.text.startsWith(remaining)) return [...parts];
      carry = { text: part.text.slice(remaining.length), marked: part.marked };
      remaining = "";
    }
    index += 1;
  }
  if (remaining !== "") return [...parts];
  const rest = carry === undefined ? parts.slice(index) : [carry, ...parts.slice(index)];
  const first = rest[0];
  if (first !== undefined && !first.marked) {
    rest[0] = { text: first.text.replace(SEPARATOR_PATTERN, ""), marked: false };
  }
  return rest.filter((part) => part.text !== "");
};
