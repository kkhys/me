import { beforeEach, describe, expect, it, vi } from "vitest";

type MockEntry = {
  id: string;
  data: {
    title: string;
    category: string;
    tags?: string[];
    status: "published" | "draft";
    publishedAt: Date;
  };
};

const createEntry = (overrides: Partial<MockEntry["data"]> & { id: string }): MockEntry => ({
  id: overrides.id,
  data: {
    title: overrides.id,
    category: overrides.category ?? "Tech",
    status: overrides.status ?? "published",
    publishedAt: overrides.publishedAt ?? new Date("2025-01-01"),
    ...(overrides.tags !== undefined && { tags: overrides.tags }),
  },
});

const mockEntries: MockEntry[] = [
  createEntry({
    id: "current",
    category: "Tech",
    tags: ["React", "TypeScript"],
  }),
  createEntry({ id: "a", category: "Tech", tags: ["React", "TypeScript"] }),
  createEntry({ id: "b", category: "Tech", tags: ["React"] }),
  createEntry({ id: "c", category: "Tech", tags: ["Go"] }),
  createEntry({ id: "d", category: "Tech" }),
  createEntry({ id: "e", category: "Life", tags: ["React"] }),
  createEntry({ id: "f", category: "Tech", tags: ["TypeScript"] }),
  createEntry({
    id: "g",
    category: "Tech",
    tags: ["React", "TypeScript", "Go"],
  }),
];

const loadEntryModule = () => import("#/features/blog/utils/entry");

const loadGetRelatedPosts = async () => (await loadEntryModule()).getRelatedPosts;

type GetRelatedPosts = Awaited<ReturnType<typeof loadGetRelatedPosts>>;

const runTagScoreSimulation = async (
  getRelatedPosts: GetRelatedPosts,
  tracked: string[],
  iterations: number,
): Promise<Map<string, number>> => {
  const tagScores = new Map<string, number>();
  for (let i = 0; i < iterations; i++) {
    const results = await getRelatedPosts({
      id: "current",
      category: "Tech",
      tags: ["React", "TypeScript"],
    });
    for (const [rank, result] of results.entries()) {
      tagScores.set(result.id, (tagScores.get(result.id) ?? 0) + rank);
    }
    // Penalize posts not in results with the worst rank
    for (const id of tracked) {
      if (!results.some((r) => r.id === id)) {
        tagScores.set(id, (tagScores.get(id) ?? 0) + results.length);
      }
    }
  }
  return new Map([...tagScores].map(([id, score]) => [id, score / iterations]));
};

const avgRankOf = (avgRanks: Map<string, number>, id: string): number => avgRanks.get(id) ?? 0;

describe("getRelatedPosts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    vi.doMock("astro:content", () => ({
      getCollection: vi.fn<() => Promise<MockEntry[]>>(() => Promise.resolve(mockEntries)),
    }));
  });

  it("excludes the current post from results", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Tech",
      tags: ["React"],
    });
    expect(results.every((r) => r.id !== "current")).toBe(true);
  });

  it("includes cross-category posts that share tags", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Life",
      tags: ["React"],
    });
    // "a", "b", "g" are Tech posts sharing the React tag.
    expect(results.some((r) => r.data.category === "Tech")).toBe(true);
  });

  it("excludes cross-category posts with no shared tags", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Life",
      tags: ["React"],
    });
    // "c" (Go), "d" (no tags), "f" (TypeScript) are Tech posts without React.
    const ids = results.map((r) => r.id);
    expect(ids).not.toContain("c");
    expect(ids).not.toContain("d");
    expect(ids).not.toContain("f");
  });

  it("ranks tag matches above posts that only share the category", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Life",
      tags: ["React", "TypeScript"],
    });
    // "a" and "g" (Tech, 2 shared tags, score 4) outrank "e" (Life, 1 shared
    // tag + same category, score 3).
    const ids = results.map((r) => r.id);
    expect(ids.slice(0, 2).toSorted()).toEqual(["a", "g"]);
    expect(ids[2]).toBe("e");
  });

  it("falls back to same-category posts without shared tags", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Life",
      tags: undefined,
    });
    // Only "e" shares the Life category; nothing else scores.
    expect(results.map((r) => r.id)).toEqual(["e"]);
  });

  it("returns at most relatedEntriesCount posts", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Tech",
      tags: ["React"],
    });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("prioritizes posts with more shared tags", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();

    // Run multiple times to account for randomness within same score.
    // "g" shares 2 tags (React, TypeScript) — same as "a", should have low avg rank.
    // "c" and "d" share 0 tags — should have high avg rank.
    const avgRanks = await runTagScoreSimulation(getRelatedPosts, ["a", "c", "d", "g"], 50);

    // Posts with 2 shared tags should rank higher (lower number) than 0 shared tags
    expect(avgRankOf(avgRanks, "a")).toBeLessThan(avgRankOf(avgRanks, "c"));
    expect(avgRankOf(avgRanks, "a")).toBeLessThan(avgRankOf(avgRanks, "d"));
  });

  it("works when current post has no tags", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Tech",
      tags: undefined,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.data.category === "Tech")).toBe(true);
  });

  it("returns empty array when nothing shares a category or tag", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "DIY",
      tags: undefined,
    });
    expect(results).toEqual([]);
  });
});

describe("toPostNavItem", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    vi.doMock("astro:content", () => ({
      getCollection: vi.fn<() => Promise<MockEntry[]>>(() => Promise.resolve(mockEntries)),
    }));
  });

  it("maps an entry to its navigation fields", async () => {
    const { toPostNavItem } = await loadEntryModule();
    const entry = {
      id: "a",
      data: { title: "Post A", emoji: "🚀" },
    } as Parameters<typeof toPostNavItem>[0];

    expect(toPostNavItem(entry)).toEqual({ id: "a", title: "Post A", emoji: "🚀" });
  });

  it("returns undefined for an out-of-range neighbor", async () => {
    const { toPostNavItem } = await loadEntryModule();
    expect(toPostNavItem(undefined)).toBeUndefined();
  });
});
