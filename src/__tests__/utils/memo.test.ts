import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockMemos } from "#/__fixtures__/memo-collection";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

describe("getPublishedMemos", () => {
  describe("production environment", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.doUnmock("astro:env/client");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
      }));
    });

    test("should return only published memos", async () => {
      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      // 6 main memos + 2 quote memos + 3 published comments = 11
      expect(result).toHaveLength(11);
      expect(result.every((memo) => !memo.data.isDraft)).toBe(true);
    });

    test("should sort memos by createdAt in descending order (newest first)", async () => {
      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result.length).toBeGreaterThan(1);
      for (let i = 0; i < result.length - 1; i++) {
        const currentMemo = result[i];
        const nextMemo = result[i + 1];
        if (currentMemo && nextMemo) {
          const currentDate = new Date(currentMemo.data.createdAt).getTime();
          const nextDate = new Date(nextMemo.data.createdAt).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    test("should return newest published memo first", async () => {
      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result.length).toBeGreaterThan(0);
      const firstMemo = result[0];
      if (firstMemo) {
        expect(firstMemo.data.id).toBe("rss-b1akmxp");
        expect(firstMemo.data.createdAt).toEqual(
          new Date("2026-03-09T00:00:00Z"),
        );
      }
    });

    test("should handle empty collection", async () => {
      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue([]);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    test("should handle collection with only draft memos", async () => {
      const { getCollection } = await import("astro:content");
      const draftOnlyMemos = mockMemos.filter((memo) => memo.data.isDraft);
      vi.mocked(getCollection).mockResolvedValue(draftOnlyMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result).toHaveLength(0);
    });

    test("should filter out memos with empty body", async () => {
      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result.every((memo) => memo.body)).toBe(true);
      const emptyBodyMemo = result.find((memo) => memo.data.id === "memo-5");
      expect(emptyBodyMemo).toBeUndefined();
    });
  });

  describe("development environment", () => {
    beforeEach(async () => {
      vi.clearAllMocks();
      vi.resetModules();
      vi.doUnmock("#/utils/memo");
      vi.doUnmock("astro:env/client");
    });

    test("should return all memos including drafts", async () => {
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
      }));

      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      // 7 main memos (including 1 draft) + 2 quote memos + 4 comments (including 1 draft) = 13
      expect(result).toHaveLength(13);
      expect(result.some((memo) => memo.data.isDraft)).toBe(true);
    });

    test("should include draft memo in results", async () => {
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
      }));

      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      const draftMemo = result.find((memo) => memo.data.id === "memo-3");
      expect(draftMemo).toBeDefined();
      if (draftMemo) {
        expect(draftMemo.data.isDraft).toBe(true);
      }
    });

    test("should filter out memos with empty body even in development", async () => {
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
      }));

      const { getCollection } = await import("astro:content");
      vi.mocked(getCollection).mockResolvedValue(mockMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result.every((memo) => memo.body)).toBe(true);
      const emptyBodyMemo = result.find((memo) => memo.data.id === "memo-5");
      expect(emptyBodyMemo).toBeUndefined();
    });
  });
});

describe("getMemosByTag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return memos with the specified tag", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByTag } = await import("#/utils/memo");
    const result = await getMemosByTag("tech");

    expect(result).toHaveLength(2);
    expect(result.every(({ main }) => main.data.tag === "tech")).toBe(true);
  });

  test("should return empty array when no memos have the specified tag", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByTag } = await import("#/utils/memo");
    const result = await getMemosByTag("nonexistent");

    expect(result).toHaveLength(0);
  });

  test("should only return published memos with the specified tag", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByTag } = await import("#/utils/memo");
    const result = await getMemosByTag("tech");

    expect(result).toHaveLength(2);
    expect(result.every(({ main }) => !main.data.isDraft)).toBe(true);
    expect(result.every(({ main }) => main.data.tag === "tech")).toBe(true);
  });

  test("should handle empty collection", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([]);

    const { getMemosByTag } = await import("#/utils/memo");
    const result = await getMemosByTag("tech");

    expect(result).toHaveLength(0);
  });
});

describe("getAllTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return all unique tags from published memos", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    expect(result).toHaveLength(3);
    expect(result).toContain("tech");
    expect(result).toContain("life");
    expect(result).toContain("work");
  });

  test("should return sorted tags", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    expect(result).toEqual(["life", "tech", "work"]);
  });

  test("should not include duplicate tags", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    const uniqueTags = Array.from(new Set(result));
    expect(result).toEqual(uniqueTags);
  });

  test("should handle empty collection", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([]);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  test("should not include tags from draft memos in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    // memo-3 is a draft with "tech" tag, but it's excluded in production
    // As a result, "tech" only comes from memo-1
    expect(result).toEqual(["life", "tech", "work"]);
  });

  test("should handle memos without tags", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getAllTags } = await import("#/utils/memo");
    const result = await getAllTags();

    // memo-5 has no tag but is handled without error
    expect(result).toHaveLength(3);
  });
});

describe("getMainMemos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return only main memos (not comments)", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMainMemos } = await import("#/utils/memo");
    const result = await getMainMemos();

    expect(result).toHaveLength(8);
    expect(result.every((memo) => !memo.data.comment)).toBe(true);
  });

  test("should return memos sorted by createdAt in descending order", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMainMemos } = await import("#/utils/memo");
    const result = await getMainMemos();

    expect(result[0]?.data.id).toBe("rss-b1akmxp");
    expect(result[1]?.data.id).toBe("quote-2");
    expect(result[2]?.data.id).toBe("quote-1");
    expect(result[3]?.data.id).toBe("memo-6");
    expect(result[4]?.data.id).toBe("memo-4");
    expect(result[5]?.data.id).toBe("memo-2");
    expect(result[6]?.data.id).toBe("oss-gh-labeler");
    expect(result[7]?.data.id).toBe("memo-1");
  });

  test("should not include draft memos in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMainMemos } = await import("#/utils/memo");
    const result = await getMainMemos();

    expect(result.every((memo) => !memo.data.isDraft)).toBe(true);
  });
});

describe("getCommentsByMemoId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return comments for a specific memo", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getCommentsByMemoId } = await import("#/utils/memo");
    const result = await getCommentsByMemoId("memo-1");

    expect(result).toHaveLength(2);
    expect(
      result.every((comment) => comment.memo.data.comment === "memo-1"),
    ).toBe(true);
  });

  test("should return comments sorted by createdAt in ascending order (oldest first)", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getCommentsByMemoId } = await import("#/utils/memo");
    const result = await getCommentsByMemoId("memo-1");

    expect(result[0]?.memo.data.id).toBe("comment-1");
    expect(result[1]?.memo.data.id).toBe("comment-2");
  });

  test("should return empty array when memo has no comments", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getCommentsByMemoId } = await import("#/utils/memo");
    const result = await getCommentsByMemoId("memo-4");

    expect(result).toHaveLength(0);
  });

  test("should not include draft comments in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getCommentsByMemoId } = await import("#/utils/memo");
    const result = await getCommentsByMemoId("memo-1");

    expect(result.every((comment) => !comment.memo.data.isDraft)).toBe(true);
  });
});

describe("getMemosWithComments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return main memos with their comments", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithComments } = await import("#/utils/memo");
    const result = await getMemosWithComments();

    expect(result).toHaveLength(8);
    expect(result[0]?.main.data.id).toBe("rss-b1akmxp");
    expect(result[0]?.comments).toHaveLength(0);
    expect(result[1]?.main.data.id).toBe("quote-2");
    expect(result[1]?.comments).toHaveLength(0);
    expect(result[2]?.main.data.id).toBe("quote-1");
    expect(result[2]?.comments).toHaveLength(0);
    expect(result[3]?.main.data.id).toBe("memo-6");
    expect(result[3]?.comments).toHaveLength(0);
    expect(result[4]?.main.data.id).toBe("memo-4");
    expect(result[4]?.comments).toHaveLength(0);
    expect(result[5]?.main.data.id).toBe("memo-2");
    expect(result[5]?.comments).toHaveLength(1);
    expect(result[6]?.main.data.id).toBe("oss-gh-labeler");
    expect(result[6]?.comments).toHaveLength(0);
    expect(result[7]?.main.data.id).toBe("memo-1");
    expect(result[7]?.comments).toHaveLength(2);
  });

  test("should return comments sorted by createdAt in ascending order", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithComments } = await import("#/utils/memo");
    const result = await getMemosWithComments();

    const memo1Result = result.find(({ main }) => main.data.id === "memo-1");
    expect(memo1Result?.comments[0]?.memo.data.id).toBe("comment-1");
    expect(memo1Result?.comments[1]?.memo.data.id).toBe("comment-2");
  });

  test("should not include draft comments in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithComments } = await import("#/utils/memo");
    const result = await getMemosWithComments();

    const allComments = result.flatMap(({ comments }) => comments);
    expect(allComments.every((comment) => !comment.memo.data.isDraft)).toBe(
      true,
    );
  });
});

describe("getMemosByAuthor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return memos by the specified author", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosByAuthor("kkhys");

    expect(pinned).toHaveLength(1);
    expect(memos).toHaveLength(4);
    expect(pinned.every(({ main }) => main.data.author === "kkhys")).toBe(true);
    expect(memos.every(({ main }) => main.data.author === "kkhys")).toBe(true);
  });

  test("should return memos with comments attached", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { memos } = await getMemosByAuthor("kkhys");

    const memo1 = memos.find(({ main }) => main.data.id === "memo-1");
    expect(memo1?.comments).toHaveLength(2);
  });

  test("should return memos for another author", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosByAuthor("testuser");

    expect(pinned).toHaveLength(0);
    expect(memos).toHaveLength(1);
    expect(memos[0]?.main.data.id).toBe("memo-6");
  });

  test("should return empty result for unknown author", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosByAuthor("unknown");

    expect(pinned).toHaveLength(0);
    expect(memos).toHaveLength(0);
  });

  test("should return bot memos for bot author", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosByAuthor("blog-feed");

    expect(pinned).toHaveLength(0);
    expect(memos).toHaveLength(1);
    expect(memos[0]?.main.data.id).toBe("rss-b1akmxp");
    expect(memos[0]?.main.data.isBot).toBe(true);
  });

  test("should return oss-project bot memos", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosByAuthor } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosByAuthor("oss-project");

    expect(pinned).toHaveLength(0);
    expect(memos).toHaveLength(1);
    expect(memos[0]?.main.data.id).toBe("oss-gh-labeler");
    expect(memos[0]?.main.data.isBot).toBe(true);
  });
});

describe("getQuotedMemo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should return the quoted memo when it exists", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getQuotedMemo } = await import("#/utils/memo");
    const result = await getQuotedMemo("memo-1");

    expect(result).toBeDefined();
    expect(result?.data.id).toBe("memo-1");
  });

  test("should return undefined for non-existent id", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getQuotedMemo } = await import("#/utils/memo");
    const result = await getQuotedMemo("non-existent");

    expect(result).toBeUndefined();
  });

  test("should not return a draft memo in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getQuotedMemo } = await import("#/utils/memo");
    const result = await getQuotedMemo("memo-3");

    expect(result).toBeUndefined();
  });
});

describe("getMemosWithCommentsAndPinned", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/memo");
    vi.doUnmock("astro:env/client");
    vi.doMock("astro:env/client", () => ({
      NODE_ENV: "production",
    }));
  });

  test("should separate pinned and unpinned memos", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithCommentsAndPinned } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosWithCommentsAndPinned();

    expect(pinned).toHaveLength(1);
    expect(pinned[0]?.main.data.id).toBe("memo-4");
    expect(memos.every(({ main }) => !main.data.isPinned)).toBe(true);
  });

  test("should not include pinned memos in unpinned list", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithCommentsAndPinned } = await import("#/utils/memo");
    const { memos } = await getMemosWithCommentsAndPinned();

    const pinnedInUnpinned = memos.find(
      ({ main }) => main.data.id === "memo-4",
    );
    expect(pinnedInUnpinned).toBeUndefined();
  });

  test("should sort pinned memos by date descending", async () => {
    const { getCollection } = await import("astro:content");
    const memosWithMultiplePinned = mockMemos.map((memo) =>
      memo.data.id === "memo-1"
        ? { ...memo, data: { ...memo.data, isPinned: true } }
        : memo,
    );
    vi.mocked(getCollection).mockResolvedValue(memosWithMultiplePinned);

    const { getMemosWithCommentsAndPinned } = await import("#/utils/memo");
    const { pinned } = await getMemosWithCommentsAndPinned();

    expect(pinned).toHaveLength(2);
    expect(pinned[0]?.main.data.id).toBe("memo-4");
    expect(pinned[1]?.main.data.id).toBe("memo-1");
  });

  test("should return empty pinned array when no memos are pinned", async () => {
    const { getCollection } = await import("astro:content");
    const memosWithNoPinned = mockMemos.map((memo) => ({
      ...memo,
      data: { ...memo.data, isPinned: false },
    }));
    vi.mocked(getCollection).mockResolvedValue(memosWithNoPinned);

    const { getMemosWithCommentsAndPinned } = await import("#/utils/memo");
    const { pinned, memos } = await getMemosWithCommentsAndPinned();

    expect(pinned).toHaveLength(0);
    expect(memos).toHaveLength(8);
  });
});

describe("buildQuoteCountMap", () => {
  test("should count quotes correctly", async () => {
    const { buildQuoteCountMap } = await import("#/utils/memo");
    const result = buildQuoteCountMap(mockMemos);

    expect(result.get("memo-1")).toBe(1);
    expect(result.get("comment-1")).toBe(1);
  });

  test("should return empty map when no memos have quotes", async () => {
    const { buildQuoteCountMap } = await import("#/utils/memo");
    const memosWithoutQuotes = mockMemos.filter((m) => !m.data.quote);
    const result = buildQuoteCountMap(memosWithoutQuotes);

    expect(result.size).toBe(0);
  });

  test("should return empty map for empty collection", async () => {
    const { buildQuoteCountMap } = await import("#/utils/memo");
    const result = buildQuoteCountMap([]);

    expect(result.size).toBe(0);
  });
});
