import { cn } from "@kkhys/ui/utils";
import {
  buildCommitsData,
  fetchAndMergeCommits,
} from "#/app/about/_lib/github";
import { ChartCard } from "#/app/about/_ui/charts/chart-card";
import { TimeOfDayCommitsChart } from "#/app/about/_ui/charts/time-of-day-commits-chart";
import { WeeklyCommitsChart } from "#/app/about/_ui/charts/weekly-commits-chart";
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

  if (!commitsData) {
    return null;
  }

  const { allTimeOfDayData, allDaysOfWeekData } = commitsData;

  return (
    <div className={className}>
      <div className={cn("grid grid-cols-1 sm:grid-cols-1 gap-4", className)}>
        <ChartCard title="Weekly commits">
          <WeeklyCommitsChart data={allDaysOfWeekData} />
        </ChartCard>
        <ChartCard title="Time of day commits">
          <TimeOfDayCommitsChart data={allTimeOfDayData} />
        </ChartCard>
      </div>
    </div>
  );
};
