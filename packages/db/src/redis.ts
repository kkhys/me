import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type SlidingWindowProps = Parameters<typeof Ratelimit.slidingWindow>;

export const redis = Redis.fromEnv();

export const rateLimiter = (
  tokens: SlidingWindowProps[0],
  windowValue: SlidingWindowProps[1],
) =>
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, windowValue),
  });
