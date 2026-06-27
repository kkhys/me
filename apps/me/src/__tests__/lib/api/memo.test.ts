import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MemoPost } from "#/lib/api/memo";

const samplePost: MemoPost = {
  id: "ABC123",
  body: "Hello world",
  createdAt: "2025-01-01T00:00:00Z",
  author: {
    name: "Keisuke Hayashi",
    username: "kkhys",
    avatar: "https://memo.kkhys.me/avatar.jpg",
  },
  tag: null,
  images: [],
};

describe("getMemoPost", () => {
  let getMemoPost: (id: string) => Promise<MemoPost | null>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    // Ensure CI env is unset so production path is taken
    delete process.env.CI;
    const mod = await import("#/lib/api/memo");
    getMemoPost = mod.getMemoPost;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns post data from successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(samplePost),
    } as Response);

    const result = await getMemoPost("ABC123");
    expect(result).toEqual(samplePost);
    expect(fetch).toHaveBeenCalledWith(
      "https://memo.kkhys.me/api/posts/ABC123.json",
      { signal: expect.any(AbortSignal) },
    );
  });

  it("returns null when response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const result = await getMemoPost("NOTFOUND");
    expect(result).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const result = await getMemoPost("ERR");
    expect(result).toBeNull();
  });

  it("returns stub data in non-production environment", async () => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "development" }));
    const mod = await import("#/lib/api/memo");

    const result = await mod.getMemoPost("DEV123");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("DEV123");
    expect(result?.body).toBe("サンプルメモ投稿");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns stub data when CI env is set", async () => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    process.env.CI = "true";
    const mod = await import("#/lib/api/memo");

    const result = await mod.getMemoPost("CI123");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("CI123");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("caches results for the same id", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(samplePost),
    } as Response);

    const first = await getMemoPost("ABC123");
    const second = await getMemoPost("ABC123");
    expect(first).toEqual(second);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("extractMemoId", () => {
  let extractMemoId: (url: string) => string | null;

  beforeEach(async () => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    const mod = await import("#/lib/api/memo");
    extractMemoId = mod.extractMemoId;
  });

  it("extracts id from valid memo URL", () => {
    expect(extractMemoId("https://memo.kkhys.me/post/ABC123")).toBe("ABC123");
  });

  it("extracts id from posts path", () => {
    expect(extractMemoId("https://memo.kkhys.me/posts/XYZ789")).toBe("XYZ789");
  });

  it("handles http protocol", () => {
    expect(extractMemoId("http://memo.kkhys.me/post/ABC123")).toBe("ABC123");
  });

  it("returns null for invalid URL", () => {
    expect(extractMemoId("https://example.com/post/123")).toBeNull();
  });

  it("returns null for URL with trailing slash", () => {
    expect(extractMemoId("https://memo.kkhys.me/post/ABC123/")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractMemoId("")).toBeNull();
  });
});
