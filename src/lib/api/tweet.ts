import type { EnrichedTweet } from "react-tweet";
import { enrichTweet } from "react-tweet";
import type { Tweet } from "react-tweet/api";

/**
 * Generate token for Twitter Syndication API
 * Reference: https://github.com/vercel/react-tweet
 */
const getToken = (id: string) => {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(6 ** 2)
    .replace(/(0+|\.)/g, "");
};

const cache = new Map<string, Promise<EnrichedTweet>>();

const fetchTweet = async (id: string): Promise<EnrichedTweet> => {
  const URL = "https://cdn.syndication.twimg.com/tweet-result?";
  const params = new URLSearchParams({
    id,
    lang: "en",
    token: getToken(id),
  }).toString();

  const response = await fetch(URL + params);
  const data = (await response.json()) as Tweet;

  return enrichTweet(data);
};

/**
 * Fetch tweet content from Twitter Syndication API
 * @param id - Tweet ID
 * @returns Enriched tweet data
 */
export const getTweetData = (id: string): Promise<EnrichedTweet> => {
  const cached = cache.get(id);
  if (cached) return cached;
  const promise = fetchTweet(id);
  cache.set(id, promise);
  return promise;
};
