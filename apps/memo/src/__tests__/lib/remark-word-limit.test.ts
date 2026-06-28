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

const processContent = (content: string) => remark().use(remarkWordLimit).process(content);

describe("remarkWordLimit", () => {
  describe("content under the limit", () => {
    test("should accept short content (50 characters)", async () => {
      await expect(processContent(shortContent)).resolves.toBeDefined();
    });

    test("should accept content at the limit (500 characters)", async () => {
      await expect(processContent(boundaryUnderContent)).resolves.toBeDefined();
    });

    test("should accept empty content", async () => {
      await expect(processContent(emptyContent)).resolves.toBeDefined();
    });
  });

  describe("content at or over the limit", () => {
    test("should reject content just over the limit (501 characters)", async () => {
      await expect(processContent(boundaryAtContent)).rejects.toThrow(
        "Character count exceeds the limit: 501 characters (limit: 500 characters)",
      );
    });

    test("should reject content over the limit (600 characters)", async () => {
      await expect(processContent(overLimitContent)).rejects.toThrow(
        "Character count exceeds the limit: 600 characters (limit: 500 characters)",
      );
    });
  });

  describe("error message format", () => {
    test("should include actual character count in error message", async () => {
      await expect(processContent(overLimitContent)).rejects.toThrow("600 characters");
      await expect(processContent(overLimitContent)).rejects.toThrow("limit: 500 characters");
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
