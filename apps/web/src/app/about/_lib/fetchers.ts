import "server-only";
import type { Summary } from "#/app/about/_types/wakatime";
import { env } from "#/env";

export const getWakaTimeSummaries = async () => {
  const apiKey = env.WAKATIME_API_KEY;
  const url =
    "https://wakatime.com/api/v1/users/current/summaries?range=last_7_days";

  if (!apiKey) {
    console.error("WakaTime API key is not set");
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error("Failed to fetch WakaTime data", response.statusText);
      return null;
    }

    return (await response.json()) as { data: Summary[] };
  } catch (error) {
    console.error("Error fetching WakaTime data:", error);
    return null;
  }
};

export const getMastodonDate = async () => {
  const apiKey = env.MASTODON_API_KEY;
  const url =
    "https://mastodon.kkhys.me/api/v1/timelines/tag/drink_log?limit=1";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Mastodon data", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Mastodon data:", error);
    return null;
  }
};
