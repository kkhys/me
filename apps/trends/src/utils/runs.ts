/* Run ids are ISO dates (YYYY-MM-DD), so lexicographic order is
   chronological order. */
export const sortRunsByDateDesc = <T extends { id: string }>(runs: T[]): T[] =>
  runs.toSorted((a, b) => b.id.localeCompare(a.id));

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
