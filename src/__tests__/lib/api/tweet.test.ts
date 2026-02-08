import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-tweet", () => ({
  enrichTweet: vi.fn((data: Record<string, unknown>) => ({
    ...data,
    enriched: true,
  })),
}));

describe("getTweetData", () => {
  let getTweetData: (id: string) => Promise<Record<string, unknown>>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            id_str: "123",
            text: "Hello world",
            user: { name: "Test" },
          }),
      }),
    );
    vi.mock("react-tweet", () => ({
      enrichTweet: vi.fn((data: Record<string, unknown>) => ({
        ...data,
        enriched: true,
      })),
    }));
    const mod = await import("#/lib/api/tweet");
    getTweetData = mod.getTweetData;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns enriched tweet data", async () => {
    const result = await getTweetData("123456789");

    expect(result).toHaveProperty("enriched", true);
  });

  it("calls fetch with correct syndication URL and token params", async () => {
    await getTweetData("1580661436132757506");

    const firstCallArgs = vi.mocked(fetch).mock.calls[0];
    expect(firstCallArgs).toBeDefined();
    const url = String(firstCallArgs?.[0]);
    expect(url).toContain("https://cdn.syndication.twimg.com/tweet-result?");
    expect(url).toContain("id=1580661436132757506");
    expect(url).toContain("lang=en");
    expect(url).toContain("token=");
  });

  it("caches results (fetch called once for same id)", async () => {
    await getTweetData("same-id-123");
    await getTweetData("same-id-123");

    const calls = vi
      .mocked(fetch)
      .mock.calls.filter((call) => (call[0] as string).includes("same-id-123"));
    expect(calls).toHaveLength(1);
  });
});
