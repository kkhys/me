/**
 * Extracts a plain-text description from an MDX body string.
 * Strips Markdown/MDX syntax and truncates at a punctuation boundary.
 */
export const extractDescription = (body: string, maxLength = 120): string => {
  if (!body.trim()) return "";

  let text = body;

  // Remove import statements
  text = text.replaceAll(/^import\s+.*$/gmu, "");

  // Remove fenced code blocks
  text = text.replaceAll(/```[\s\S]*?```/gu, "");

  // Remove alert blockquotes (> [!NOTE] etc. and continuation lines)
  text = text.replaceAll(
    /^> \[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\].*(?:\n(?:>\s?.*)?)*$/gmu,
    "",
  );

  // Remove blockquote markers
  text = text.replaceAll(/^>\s?/gmu, "");

  // Remove headings
  text = text.replaceAll(/^#{1,6}\s+.*$/gmu, "");

  // Remove images
  text = text.replaceAll(/!\[.*?\]\(.*?\)/gu, "");

  // Convert links to text only
  text = text.replaceAll(/\[([^\]]*)\]\(.*?\)/gu, "$1");

  // Remove inline code
  text = text.replaceAll(/`[^`]+`/gu, "");

  // Remove bold/italic markers
  text = text.replaceAll(/\*{1,3}(.*?)\*{1,3}/gu, "$1");
  text = text.replaceAll(/_{1,3}(.*?)_{1,3}/gu, "$1");

  // Remove horizontal rules
  text = text.replaceAll(/^[-*_]{3,}$/gmu, "");

  // Remove HTML tags
  text = text.replaceAll(/<[^>]+>/gu, "");

  // Remove footnote references
  text = text.replaceAll(/\[\^[^\]]*\]/gu, "");

  // Normalize whitespace and join
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ")
    .replaceAll(/\s+/gu, " ")
    .trim();

  if (text.length <= maxLength) return text;

  // Truncate at a punctuation boundary within the latter half
  const searchStart = Math.floor(maxLength / 2);
  const candidate = text.slice(0, maxLength);
  const punctuationPattern = /[。、！？!?]/gu;
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
