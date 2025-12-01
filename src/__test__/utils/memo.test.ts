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

      // 3 main memos + 3 published comments = 6
      expect(result).toHaveLength(6);
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
        expect(firstMemo.data.id).toBe("memo-4");
        expect(firstMemo.data.createdAt).toEqual(
          new Date("2025-11-24T00:00:00Z"),
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

      // 4 main memos (including 1 draft) + 4 comments (including 1 draft) = 8
      expect(result).toHaveLength(8);
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

    expect(result).toHaveLength(1);
    expect(result[0]?.main.data.tag).toBe("tech");
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

    expect(result).toHaveLength(3);
    expect(result.every((memo) => !memo.data.comment)).toBe(true);
  });

  test("should return memos sorted by createdAt in descending order", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMainMemos } = await import("#/utils/memo");
    const result = await getMainMemos();

    expect(result[0]?.data.id).toBe("memo-4");
    expect(result[1]?.data.id).toBe("memo-2");
    expect(result[2]?.data.id).toBe("memo-1");
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
    expect(result.every((comment) => comment.data.comment === "memo-1")).toBe(
      true,
    );
  });

  test("should return comments sorted by createdAt in ascending order (oldest first)", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getCommentsByMemoId } = await import("#/utils/memo");
    const result = await getCommentsByMemoId("memo-1");

    expect(result[0]?.data.id).toBe("comment-1");
    expect(result[1]?.data.id).toBe("comment-2");
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

    expect(result.every((comment) => !comment.data.isDraft)).toBe(true);
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

    expect(result).toHaveLength(3);
    expect(result[0]?.main.data.id).toBe("memo-4");
    expect(result[0]?.comments).toHaveLength(0);
    expect(result[1]?.main.data.id).toBe("memo-2");
    expect(result[1]?.comments).toHaveLength(1);
    expect(result[2]?.main.data.id).toBe("memo-1");
    expect(result[2]?.comments).toHaveLength(2);
  });

  test("should return comments sorted by createdAt in ascending order", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithComments } = await import("#/utils/memo");
    const result = await getMemosWithComments();

    const memo1Result = result.find(({ main }) => main.data.id === "memo-1");
    expect(memo1Result?.comments[0]?.data.id).toBe("comment-1");
    expect(memo1Result?.comments[1]?.data.id).toBe("comment-2");
  });

  test("should not include draft comments in production", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockMemos);

    const { getMemosWithComments } = await import("#/utils/memo");
    const result = await getMemosWithComments();

    const allComments = result.flatMap(({ comments }) => comments);
    expect(allComments.every((comment) => !comment.data.isDraft)).toBe(true);
  });
});
