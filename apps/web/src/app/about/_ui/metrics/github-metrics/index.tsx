import { buildCommitsData, fetchAndMergeCommits } from "#/app/about/_lib";
import { commitsData as cachedCommitsData } from "#/share/commits-data";

const getGithubMetricsData = async () => {
  const sinceDate = cachedCommitsData.commits.at(-1)?.committedDate;
  if (!sinceDate) {
    throw new Error("No valid sinceDate found.");
  }

  const mergedCommits = await fetchAndMergeCommits(
    sinceDate,
    cachedCommitsData.commits,
  );

  if (!mergedCommits) {
    throw new Error("Failed to fetch merged commits.");
  }

  return buildCommitsData(mergedCommits);
};

export const GithubMetrics = async ({ className }: { className?: string }) => {
  const commitsData = await getGithubMetricsData();

  return (
    <div className={className}>
      <p>Loaded {commitsData.totalCommits} commits!</p>
    </div>
  );
};
