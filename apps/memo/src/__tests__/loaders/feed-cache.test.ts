import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { type FeedCache, readFeedCache, writeFeedCache } from "#/loaders/feed-cache";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn<typeof import("node:fs").readFileSync>(),
  writeFileSync: vi.fn<typeof import("node:fs").writeFileSync>(),
  mkdirSync: vi.fn<typeof import("node:fs").mkdirSync>(),
}));

const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);
const mockMkdirSync = vi.mocked(mkdirSync);

const validCache: FeedCache = {
  fetchedAt: 1_700_000_000_000,
  etag: '"abc123"',
  lastModified: "Sun, 31 May 2026 05:56:28 GMT",
  xml: "<rss></rss>",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("readFeedCache", () => {
  test("should return null on cache miss (file not found)", () => {
    mockReadFileSync.mockImplementation(() => {
      throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    });

    expect(readFeedCache("rss")).toBeNull();
  });

  test("should return parsed cache for a valid file", () => {
    mockReadFileSync.mockReturnValue(JSON.stringify(validCache));

    expect(readFeedCache("rss")).toEqual(validCache);
  });

  test("should treat corrupt JSON as a miss instead of throwing", () => {
    mockReadFileSync.mockReturnValue("{ not valid json");

    expect(readFeedCache("rss")).toBeNull();
  });

  test("should return null when required fields are missing", () => {
    mockReadFileSync.mockReturnValue(JSON.stringify({ etag: '"x"' }));

    expect(readFeedCache("rss")).toBeNull();
  });
});

describe("writeFeedCache", () => {
  test("should create the cache directory and serialize the entry", () => {
    writeFeedCache("zenn", validCache);

    expect(mockMkdirSync).toHaveBeenCalledWith(expect.stringContaining("memo-feeds"), {
      recursive: true,
    });
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining("zenn.json"),
      JSON.stringify(validCache),
      "utf-8",
    );
  });
});
