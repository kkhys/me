export interface MemoImageAlt {
  file: string;
  alt: string;
}

/**
 * Alt for an attached image, looked up by file name in the memo's
 * frontmatter. Memos with no alt text recorded fall back to a numbered
 * placeholder so the attachment is at least announced.
 */
export const memoImageAlt = (
  file: string,
  index: number,
  alts: readonly MemoImageAlt[] | undefined,
): string => alts?.find((entry) => entry.file === file)?.alt ?? `Image ${index + 1}`;
