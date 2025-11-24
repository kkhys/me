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

      expect(result).toHaveLength(3);
      expect(result.every((memo) => memo.data.isPublished)).toBe(true);
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
      const draftOnlyMemos = mockMemos.filter((memo) => !memo.data.isPublished);
      vi.mocked(getCollection).mockResolvedValue(draftOnlyMemos);

      const { getPublishedMemos } = await import("#/utils/memo");
      const result = await getPublishedMemos();

      expect(result).toHaveLength(0);
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

      expect(result).toHaveLength(4);
      expect(result.some((memo) => !memo.data.isPublished)).toBe(true);
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
        expect(draftMemo.data.isPublished).toBe(false);
      }
    });
  });
});
