/** Compose the GitHub Release body, linking the previous release's compare view when one exists. */
export const buildReleaseBody = (
  version: string,
  previousTag: string | null,
  { repoOwner, repoName }: { repoOwner: string; repoName: string },
): string => {
  const body = `Automatic release for version ${version}.`;
  if (!previousTag) return `${body}\n\n(No previous release found for comparison.)`;

  const compareUrl = `https://github.com/${repoOwner}/${repoName}/compare/${previousTag}...${version}`;
  return `${body}\n\n[View changes since ${previousTag}](${compareUrl})`;
};
