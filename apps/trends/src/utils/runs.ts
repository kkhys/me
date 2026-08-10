/* Run ids are ISO dates (YYYY-MM-DD), so lexicographic order is
   chronological order. */
export const sortRunsByDateDesc = <T extends { id: string }>(runs: T[]): T[] =>
  runs.toSorted((a, b) => b.id.localeCompare(a.id));

/* "2026-08-10" → "2026.08.10", the date format used across kkhys.me sites. */
export const formatRunDate = (id: string): string => id.replaceAll("-", ".");

/* "2026-08-10T07:30:46+09:00" → "2026.08.10 07:30" */
export const formatGeneratedAt = (iso: string): string =>
  iso.slice(0, 16).replace("T", " ").replaceAll("-", ".");

export const adjacentRuns = (
  sortedIdsDesc: string[],
  id: string,
): { prev: string | undefined; next: string | undefined } => {
  const i = sortedIdsDesc.indexOf(id);

  if (i === -1) {
    return { prev: undefined, next: undefined };
  }

  return {
    prev: sortedIdsDesc[i + 1],
    next: i > 0 ? sortedIdsDesc[i - 1] : undefined,
  };
};
