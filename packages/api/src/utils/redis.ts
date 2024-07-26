import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type SlidingWindowProps = Parameters<typeof Ratelimit.slidingWindow>;

export const rateLimiter = (tokens: SlidingWindowProps[0], windowValue: SlidingWindowProps[1]) =>
  new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(tokens, windowValue),
  });

export const getIpHash = async (ip: string) => {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};
