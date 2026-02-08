import { GITHUB_ACCESS_TOKEN } from "astro:env/server";

type LastUpdatedTimeData = {
  lastUpdatedTime: string | undefined;
};

const cache = new Map<string, Promise<LastUpdatedTimeData>>();

const fetchLastUpdatedTime = async (
  filePath: string,
): Promise<LastUpdatedTimeData> => {
  const API_URL = "https://api.github.com/repos/kkhys/content/commits?";

  const params = new URLSearchParams({
    path: filePath,
    per_page: "1",
  }).toString();

  const response = await fetch(API_URL + params, {
    headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    console.warn(
      `Failed to fetch last updated time for ${filePath}: ${response.status}`,
    );
    return { lastUpdatedTime: undefined };
  }

  const json: unknown = await response.json();

  if (!Array.isArray(json) || json.length === 0) {
    console.warn(`No commit data found for ${filePath}`);
    return { lastUpdatedTime: undefined };
  }

  return {
    lastUpdatedTime: json[0].commit.committer.date,
  };
};

export const getLastUpdatedTimeByFile = (
  filePath: string,
): Promise<LastUpdatedTimeData> => {
  const cached = cache.get(filePath);
  if (cached) return cached;
  const promise = fetchLastUpdatedTime(filePath);
  cache.set(filePath, promise);
  return promise;
};
