export const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");
