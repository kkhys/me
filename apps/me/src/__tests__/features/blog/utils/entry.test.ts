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

const loadGetRelatedPosts = async () => {
  const mod = await import("#/features/blog/utils/entry");
  return mod.getRelatedPosts;
};

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

  it("only includes posts from the same category", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "Tech",
      tags: ["React"],
    });
    expect(results.every((r) => r.data.category === "Tech")).toBe(true);
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

  it("returns empty array when no posts match the category", async () => {
    const getRelatedPosts = await loadGetRelatedPosts();
    const results = await getRelatedPosts({
      id: "current",
      category: "DIY",
      tags: ["React"],
    });
    expect(results).toEqual([]);
  });
});
