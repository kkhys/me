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

const createEntry = (
  overrides: Partial<MockEntry["data"]> & { id: string },
): MockEntry => ({
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

describe("getRelatedPosts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
    vi.doMock("astro:content", () => ({
      getCollection: vi.fn(() => Promise.resolve(mockEntries)),
    }));
  });

  const loadGetRelatedPosts = async () => {
    const mod = await import("#/features/blog/utils/entry");
    return mod.getRelatedPosts;
  };

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

    // Run multiple times to account for randomness within same score
    const tagScores = new Map<string, number>();

    for (let i = 0; i < 50; i++) {
      const results = await getRelatedPosts({
        id: "current",
        category: "Tech",
        tags: ["React", "TypeScript"],
      });

      for (const [rank, result] of results.entries()) {
        const prev = tagScores.get(result.id) ?? 0;
        tagScores.set(result.id, prev + rank);
      }
    }

    // "g" shares 2 tags (React, TypeScript) — same as "a", should have low avg rank
    // "c" and "d" share 0 tags — should have high avg rank
    const avgRank = (id: string) => (tagScores.get(id) ?? 0) / 50;

    // Posts with 2 shared tags should rank higher (lower number) than 0 shared tags
    expect(avgRank("a")).toBeLessThan(avgRank("c"));
    expect(avgRank("a")).toBeLessThan(avgRank("d"));
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
