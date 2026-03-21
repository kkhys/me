import { describe, expect, test } from "vitest";
import { generateOssEntryId } from "#/loaders/memo-loader";

describe("generateOssEntryId", () => {
  test("should generate oss-prefixed id from slug", () => {
    expect(generateOssEntryId("gh-labeler")).toBe("oss-gh-labeler");
  });

  test("should be idempotent for same slug", () => {
    const id1 = generateOssEntryId("gh-labeler");
    const id2 = generateOssEntryId("gh-labeler");
    expect(id1).toBe(id2);
  });

  test("should generate different ids for different slugs", () => {
    const id1 = generateOssEntryId("gh-labeler");
    const id2 = generateOssEntryId("jetbrains-ai-co-author");
    expect(id1).not.toBe(id2);
  });
});
