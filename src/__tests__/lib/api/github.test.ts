import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("astro:env/server", () => ({
  GITHUB_ACCESS_TOKEN: "test-token",
}));

describe("getLastUpdatedTimeByFile", () => {
  let getLastUpdatedTimeByFile: (
    filePath: string,
  ) => Promise<{ lastUpdatedTime: string | undefined }>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    vi.mock("astro:env/server", () => ({
      GITHUB_ACCESS_TOKEN: "test-token",
    }));
    const mod = await import("#/lib/api/github");
    getLastUpdatedTimeByFile = mod.getLastUpdatedTimeByFile;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns lastUpdatedTime from successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { commit: { committer: { date: "2024-01-15T00:00:00Z" } } },
        ]),
    } as Response);

    const result = await getLastUpdatedTimeByFile("content/blog/test.mdx");
    expect(result.lastUpdatedTime).toBe("2024-01-15T00:00:00Z");
  });

  it("returns undefined for empty array response", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    const result = await getLastUpdatedTimeByFile("content/blog/empty.mdx");
    expect(result.lastUpdatedTime).toBeUndefined();
    warnSpy.mockRestore();
  });

  it("returns undefined and warns on HTTP error", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const result = await getLastUpdatedTimeByFile("content/blog/error.mdx");
    expect(result.lastUpdatedTime).toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("caches results (fetch called once for same path)", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { commit: { committer: { date: "2024-01-15T00:00:00Z" } } },
        ]),
    } as Response);

    await getLastUpdatedTimeByFile("content/blog/cached.mdx");
    await getLastUpdatedTimeByFile("content/blog/cached.mdx");

    // fetch is called once for this path
    const calls = vi
      .mocked(fetch)
      .mock.calls.filter((call) => (call[0] as string).includes("cached.mdx"));
    expect(calls).toHaveLength(1);
  });
});
