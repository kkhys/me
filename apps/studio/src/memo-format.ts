/**
 * Memo formatting rules shared by the server-side store and the browser
 * client. Must stay free of fs and DOM dependencies so both sides (and the
 * Node-based test runner) can import it.
 */

import { toString as mdastToString } from "mdast-util-to-string";
import { remark } from "remark";

export const MAX_BODY_LENGTH = 500;
export const MAX_IMAGES = 4;

export interface MemoSummary {
  dirName: string;
  id: string;
  createdAt: string;
  body: string;
  tag?: string | undefined;
  comment?: string | undefined;
  quote?: string | undefined;
  isDraft: boolean;
  images: string[];
}

const processor = remark();

/**
 * Count body characters the same way the memo app's remark-word-limit plugin
 * does: markdown syntax is excluded, only rendered text is counted.
 */
export const countMemoChars = (body: string): number => mdastToString(processor.parse(body)).length;

/** Normalize a datetime-local input value to `YYYY-MM-DD HH:mm:ss`. */
export const toCreatedAt = (value: string): string | undefined => {
  if (value === "") return undefined;
  const normalized = value.replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};
