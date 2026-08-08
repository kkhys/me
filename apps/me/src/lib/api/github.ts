import { GITHUB_ACCESS_TOKEN } from "astro:env/server";
import { z } from "astro/zod";
import { createCache } from "#/lib/api/cache";

type LastUpdatedTimeData = {
  lastUpdatedTime: string | undefined;
};

const commitsSchema = z.array(
  z.object({
    commit: z.object({
      committer: z.object({ date: z.string() }),
    }),
  }),
);

const cache = createCache<LastUpdatedTimeData>();

const fetchLastUpdatedTime = async (filePath: string): Promise<LastUpdatedTimeData> => {
  if (!GITHUB_ACCESS_TOKEN) {
    return { lastUpdatedTime: undefined };
  }

  const API_URL = "https://api.github.com/repos/kkhys/me-content/commits?";

  const params = new URLSearchParams({
    path: filePath,
    per_page: "1",
  }).toString();

  const response = await fetch(API_URL + params, {
    headers: { Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}` },
  });

  if (!response.ok) {
    console.warn(`Failed to fetch last updated time for ${filePath}: ${response.status}`);
    return { lastUpdatedTime: undefined };
  }

  const json: unknown = await response.json();
  const parsed = commitsSchema.safeParse(json);

  if (!parsed.success || parsed.data.length === 0) {
    console.warn(`No commit data found for ${filePath}`);
    return { lastUpdatedTime: undefined };
  }

  return {
    lastUpdatedTime: parsed.data[0]?.commit.committer.date,
  };
};

export const getLastUpdatedTimeByFile = (filePath: string): Promise<LastUpdatedTimeData> =>
  cache(filePath, () => fetchLastUpdatedTime(filePath));
