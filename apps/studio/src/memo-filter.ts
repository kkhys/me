/**
 * Client-side feed filtering. Shared shape with the API's memo summaries;
 * kept DOM-free so it can be unit-tested on Node.
 */

export interface FilterableMemo {
  body: string;
  createdAt: string;
  tag?: string | undefined;
}

/**
 * Filter memos by a free-text query. Whitespace-separated terms are ANDed;
 * each term matches case-insensitively against body, tag, or createdAt.
 */
export const filterMemos = <T extends FilterableMemo>(memos: T[], query: string): T[] => {
  const terms = query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  if (terms.length === 0) return memos;

  return memos.filter((memo) => {
    const haystack = `${memo.body}\n${memo.tag ?? ""}\n${memo.createdAt}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
};
