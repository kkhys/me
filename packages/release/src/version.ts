/**
 * Resolves the next release tag for a date-based base version. Reuses the base
 * version when it is untagged; otherwise probes `-2`, `-3`, … and returns the
 * first suffix not already present in `existingTags`.
 */
export const resolveReleaseVersion = (
  baseVersion: string,
  existingTags: string[],
): string => {
  const tags = existingTags.filter((tag) => tag.startsWith(baseVersion));
  if (!tags.includes(baseVersion)) return baseVersion;

  let suffixCounter = 2;
  while (tags.includes(`${baseVersion}-${suffixCounter}`)) {
    suffixCounter++;
  }
  return `${baseVersion}-${suffixCounter}`;
};
