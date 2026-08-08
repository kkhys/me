/**
 * Resolves the next release tag for a date-based base version. Reuses the base
 * version when it is untagged; otherwise probes `-2`, `-3`, … and returns the
 * first suffix not already present in `existingTags`.
 */
export const resolveReleaseVersion = (baseVersion: string, existingTags: string[]): string => {
  // Match the base version exactly or with a numeric suffix; startsWith would
  // also swallow lookalikes such as "2026.06.270" or "2026.06.27-rc1".
  const escaped = baseVersion.replaceAll(".", String.raw`\.`);
  const pattern = new RegExp(String.raw`^${escaped}(-\d+)?$`, "u");
  const tags = new Set(existingTags.filter((tag) => pattern.test(tag)));
  if (!tags.has(baseVersion)) return baseVersion;

  let suffixCounter = 2;
  while (tags.has(`${baseVersion}-${suffixCounter}`)) {
    suffixCounter++;
  }
  return `${baseVersion}-${suffixCounter}`;
};
