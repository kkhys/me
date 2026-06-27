/**
 * Extracts a plain-text description from an MDX body string.
 * Strips Markdown/MDX syntax and truncates at a punctuation boundary.
 */
export const extractDescription = (body: string, maxLength = 120): string => {
  if (!body.trim()) return "";

  let text = body;

  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, "");

  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove alert blockquotes (> [!NOTE] etc. and continuation lines)
  text = text.replace(
    /^> \[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\].*(?:\n(?:>\s?.*)?)*$/gm,
    "",
  );

  // Remove blockquote markers
  text = text.replace(/^>\s?/gm, "");

  // Remove headings
  text = text.replace(/^#{1,6}\s+.*$/gm, "");

  // Remove images
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");

  // Convert links to text only
  text = text.replace(/\[([^\]]*)\]\(.*?\)/g, "$1");

  // Remove inline code
  text = text.replace(/`[^`]+`/g, "");

  // Remove bold/italic markers
  text = text.replace(/\*{1,3}(.*?)\*{1,3}/g, "$1");
  text = text.replace(/_{1,3}(.*?)_{1,3}/g, "$1");

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove footnote references
  text = text.replace(/\[\^[^\]]*\]/g, "");

  // Normalize whitespace and join
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
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
