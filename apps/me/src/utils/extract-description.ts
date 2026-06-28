/**
 * Extracts a plain-text description from an MDX body string.
 * Strips Markdown/MDX syntax and truncates at a punctuation boundary.
 */
export const extractDescription = (body: string, maxLength = 120): string => {
  if (!body.trim()) return "";

  let text = body;

  // Remove import statements
  text = text.replaceAll(/^import\s+.*$/gm, "");

  // Remove fenced code blocks
  text = text.replaceAll(/```[\s\S]*?```/g, "");

  // Remove alert blockquotes (> [!NOTE] etc. and continuation lines)
  text = text.replaceAll(
    /^> \[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\].*(?:\n(?:>\s?.*)?)*$/gm,
    "",
  );

  // Remove blockquote markers
  text = text.replaceAll(/^>\s?/gm, "");

  // Remove headings
  text = text.replaceAll(/^#{1,6}\s+.*$/gm, "");

  // Remove images
  text = text.replaceAll(/!\[.*?\]\(.*?\)/g, "");

  // Convert links to text only
  text = text.replaceAll(/\[([^\]]*)\]\(.*?\)/g, "$1");

  // Remove inline code
  text = text.replaceAll(/`[^`]+`/g, "");

  // Remove bold/italic markers
  text = text.replaceAll(/\*{1,3}(.*?)\*{1,3}/g, "$1");
  text = text.replaceAll(/_{1,3}(.*?)_{1,3}/g, "$1");

  // Remove horizontal rules
  text = text.replaceAll(/^[-*_]{3,}$/gm, "");

  // Remove HTML tags
  text = text.replaceAll(/<[^>]+>/g, "");

  // Remove footnote references
  text = text.replaceAll(/\[\^[^\]]*\]/g, "");

  // Normalize whitespace and join
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ")
    .replaceAll(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  // Truncate at a punctuation boundary within the latter half
  const searchStart = Math.floor(maxLength / 2);
  const candidate = text.slice(0, maxLength);
  const punctuationPattern = /[。、！？!?]/g;
  let lastIndex = -1;

  for (
    let match = punctuationPattern.exec(candidate);
    match !== null;
    match = punctuationPattern.exec(candidate)
  ) {
    if (match.index >= searchStart) {
      lastIndex = match.index;
    }
  }

  if (lastIndex >= 0) {
    return text.slice(0, lastIndex + 1);
  }

  return text.slice(0, maxLength);
};
