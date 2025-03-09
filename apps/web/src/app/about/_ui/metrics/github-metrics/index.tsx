import {
  getCachedRepositoryBranches,
  getCachedRepositoryCommits,
  getCachedUserRepositories,
} from "#/app/about/_lib/github";

export const GithubMetrics = async ({ className }: { className?: string }) => {
  const repositories = (await getCachedUserRepositories()) || {};

  for (const { name: repositoryName } of repositories) {
    const branches = await getCachedRepositoryBranches(repositoryName);

    for (const { name: branchName } of branches) {
      const commits = await getCachedRepositoryCommits(
        repositoryName,
        branchName,
        "2025-02-20T00:00:00Z",
      );

      for (const { committedDate } of commits) {
        console.log(committedDate);
      }
    }
  }

  return (
    <div>
      <p>test</p>
    </div>
  );
};
