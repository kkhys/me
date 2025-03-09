import { writeFileSync } from "node:fs";
import { TZDate } from "@date-fns/tz";
import {
  getRepositoryBranches,
  getRepositoryCommits,
  getUserRepositories,
} from "#/app/about/_lib";
import type {
  AllDaysOfWeekData,
  AllTimeOfDayData,
  CommitNode,
  CommitsData,
} from "#/app/about/_types";
import { me } from "#/config";
import { commitsData as cachedCommitsData } from "#/share/commits-data";

const FILE_PATH = "src/share/commits-data.ts";

const dayOfWeekNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const timeOfDayRanges = [
  { key: "morning", start: 6, end: 11 },
  { key: "daytime", start: 12, end: 17 },
  { key: "evening", start: 18, end: 23 },
  { key: "night", start: 0, end: 5 },
] as const;

const writeToFile = (data: CommitsData) => {
  const content = `// This file was automatically generated.
// Please do not remove or edit this file.

import type { CommitsData } from '#/app/about/_types';

export const commitsData: CommitsData = ${JSON.stringify(data, null, 2)};
`;

  writeFileSync(FILE_PATH, content);
};

const categorizeDayOfWeek = (date: Date) => {
  const day = (date.getDay() + 6) % 7;
  return dayOfWeekNames[day] as keyof AllDaysOfWeekData;
};

const categorizeTimeOfDay = (date: Date): keyof AllTimeOfDayData => {
  const hour = date.getHours();

  for (const range of timeOfDayRanges) {
    if (range.start <= range.end) {
      if (hour >= range.start && hour <= range.end) {
        return range.key;
      }
    } else {
      if (hour >= range.start || hour <= range.end) {
        return range.key;
      }
    }
  }

  return "night";
};

const buildCommitsData = (allCommits: CommitNode[]): CommitsData => {
  const initialDaysData: AllDaysOfWeekData = {
    monday: { commits: 0, percentage: 0 },
    tuesday: { commits: 0, percentage: 0 },
    wednesday: { commits: 0, percentage: 0 },
    thursday: { commits: 0, percentage: 0 },
    friday: { commits: 0, percentage: 0 },
    saturday: { commits: 0, percentage: 0 },
    sunday: { commits: 0, percentage: 0 },
  };

  const initialTimeData: AllTimeOfDayData = {
    morning: { commits: 0, percentage: 0 },
    daytime: { commits: 0, percentage: 0 },
    evening: { commits: 0, percentage: 0 },
    night: { commits: 0, percentage: 0 },
  };

  for (const commit of allCommits) {
    const date = new TZDate(commit.committedDate, "Asia/Tokyo");

    const dayKey = categorizeDayOfWeek(date);
    initialDaysData[dayKey].commits++;

    const timeKey = categorizeTimeOfDay(date);
    initialTimeData[timeKey].commits++;
  }

  const total = allCommits.length;

  for (const obj of Object.values(initialDaysData)) {
    obj.percentage =
      total > 0
        ? Number.parseFloat(((obj.commits / total) * 100).toFixed(2))
        : 0;
  }

  for (const obj of Object.values(initialTimeData)) {
    obj.percentage =
      total > 0
        ? Number.parseFloat(((obj.commits / total) * 100).toFixed(2))
        : 0;
  }

  return {
    totalCommits: total,
    allTimeOfDayData: initialTimeData,
    allDaysOfWeekData: initialDaysData,
    commits: allCommits.map(({ author, ...rest }) => rest),
  };
};

const main = async () => {
  console.log("Fetching commit data...");

  const repositories = await getUserRepositories();

  const sinceDate =
    cachedCommitsData.commits.at(-1)?.committedDate || "2020-07-31T00:00:00Z";
  const allCommits: CommitNode[] = [];

  for (const repo of repositories) {
    const branches = await getRepositoryBranches(repo.name);

    for (const branch of branches) {
      const commits = await getRepositoryCommits(
        repo.name,
        branch.name,
        sinceDate,
      );
      allCommits.push(...commits);
    }
  }

  const filteredAllCommits = allCommits
    .filter(({ author }) => author.user?.login === me.github.id)
    .sort(
      (a, b) =>
        new Date(a.committedDate).getTime() -
        new Date(b.committedDate).getTime(),
    );

  const commitsData = buildCommitsData(filteredAllCommits);

  writeToFile(commitsData);

  console.log("Processing completed:", FILE_PATH);
};

main().catch((error) => {
  console.error("An error occurred:", error);
});
