import { remark } from "remark";
import { describe, expect, test } from "vitest";
import {
  boundaryAtContent,
  boundaryUnderContent,
  emptyContent,
  overLimitContent,
  shortContent,
} from "#/__fixtures__/markdown-content";
import remarkWordLimit from "#/lib/remark-word-limit";

describe("remarkWordLimit", () => {
  const processContent = async (content: string) => {
    return remark().use(remarkWordLimit).process(content);
  };

  describe("content under the limit", () => {
    test("should accept short content (50 characters)", async () => {
      await expect(processContent(shortContent)).resolves.toBeDefined();
    });

    test("should accept content at boundary minus one (399 characters)", async () => {
      await expect(processContent(boundaryUnderContent)).resolves.toBeDefined();
    });

    test("should accept empty content", async () => {
      await expect(processContent(emptyContent)).resolves.toBeDefined();
    });
  });

  describe("content at or over the limit", () => {
    test("should reject content exactly at the limit (400 characters)", async () => {
      await expect(processContent(boundaryAtContent)).rejects.toThrow(
        "Character count exceeds the limit: 400 characters (limit: 400 characters)",
      );
    });

    test("should reject content over the limit (500 characters)", async () => {
      await expect(processContent(overLimitContent)).rejects.toThrow(
        "Character count exceeds the limit: 500 characters (limit: 400 characters)",
      );
    });
  });

  describe("error message format", () => {
    test("should include actual character count in error message", async () => {
      try {
        await processContent(overLimitContent);
        // Should not reach here
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        if (error instanceof Error) {
          expect(error.message).toContain("500 characters");
          expect(error.message).toContain("limit: 400 characters");
        }
      }
    });
  });

  describe("edge cases", () => {
    test("should handle content with only whitespace", async () => {
      const whitespaceContent = " ".repeat(50);
      await expect(processContent(whitespaceContent)).resolves.toBeDefined();
    });

    test("should handle content with newlines", async () => {
      const contentWithNewlines = "Line 1\nLine 2\nLine 3";
      await expect(processContent(contentWithNewlines)).resolves.toBeDefined();
    });
  });
});
