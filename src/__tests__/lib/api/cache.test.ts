import { describe, expect, it, vi } from "vitest";
import { createCache, createResolvedCache } from "#/lib/api/cache";

describe("createCache", () => {
  it("returns the fetcher result", async () => {
    const cache = createCache<string>();
    const result = await cache("key", () => Promise.resolve("value"));
    expect(result).toBe("value");
  });

  it("calls fetcher only once for the same key", async () => {
    const cache = createCache<string>();
    const fetcher = vi.fn(() => Promise.resolve("value"));

    await cache("key", fetcher);
    await cache("key", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("calls fetcher for different keys", async () => {
    const cache = createCache<string>();
    const fetcher = vi.fn(() => Promise.resolve("value"));

    await cache("a", fetcher);
    await cache("b", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("caches the Promise (deduplicates concurrent requests)", () => {
    const cache = createCache<string>();
    const fetcher = vi.fn(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve("v"), 10)),
    );

    const p1 = cache("key", fetcher);
    const p2 = cache("key", fetcher);

    expect(p1).toBe(p2);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe("createResolvedCache", () => {
  it("returns the fetcher result", async () => {
    const cache = createResolvedCache<string>();
    const result = await cache("key", () => Promise.resolve("value"));
    expect(result).toBe("value");
  });

  it("calls fetcher only once for the same key", async () => {
    const cache = createResolvedCache<string>();
    const fetcher = vi.fn(() => Promise.resolve("value"));

    await cache("key", fetcher);
    await cache("key", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("calls fetcher for different keys", async () => {
    const cache = createResolvedCache<string>();
    const fetcher = vi.fn(() => Promise.resolve("value"));

    await cache("a", fetcher);
    await cache("b", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("caches the resolved value (not the Promise)", async () => {
    const cache = createResolvedCache<string>();
    let callCount = 0;
    const fetcher = () => Promise.resolve(`value-${++callCount}`);

    const r1 = await cache("key", fetcher);
    const r2 = await cache("key", fetcher);

    expect(r1).toBe("value-1");
    expect(r2).toBe("value-1");
  });
});
