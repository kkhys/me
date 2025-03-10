import { writeFileSync } from "node:fs";
import { buildCommitsData, fetchAndMergeCommits } from "#/app/about/_lib";
import type { CommitsData } from "#/app/about/_types";
import { commitsData as cachedCommitsData } from "#/share/commits-data";

const FILE_PATH = "src/share/commits-data.ts";

const writeToFile = (data: CommitsData) => {
  const content = `// This file was automatically generated.
// Please do not remove or edit this file.

import type { CommitsData } from '#/app/about/_types';

export const commitsData: CommitsData = ${JSON.stringify(data, null, 2)};
`;

  writeFileSync(FILE_PATH, content);
};

const main = async () => {
  try {
    console.log("Fetching commit data...");

    const sinceDate =
      cachedCommitsData.commits.at(-1)?.committedDate || "2020-07-31T00:00:00Z";

    const mergedCommits = await fetchAndMergeCommits(
      sinceDate,
      cachedCommitsData.commits,
    );

    const commitsData = buildCommitsData(mergedCommits);

    writeToFile(commitsData);

    console.log("Processing completed:", FILE_PATH);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

void main();
