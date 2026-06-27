/**
 * Pick the table-of-contents entry that should be marked active.
 *
 * The active entry is the first heading (in document order) currently within
 * the observer's detection band. When no heading is in the band — e.g. while
 * scrolling through the gap between two headings — the previously active id is
 * kept so the highlight does not flicker off.
 */
export const pickActiveId = (
  orderedIds: readonly string[],
  visibleIds: ReadonlySet<string>,
  previousId: string | null,
): string | null => {
  const current = orderedIds.find((id) => visibleIds.has(id));
  return current ?? previousId;
};
