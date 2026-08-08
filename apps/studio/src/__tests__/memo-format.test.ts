import { describe, expect, it } from "vitest";
import { countMemoChars, toCreatedAt } from "../memo-format";

describe("countMemoChars", () => {
  it("counts plain text length", () => {
    expect(countMemoChars("こんにちは")).toBe(5);
  });

  it("excludes markdown syntax, matching remark-word-limit", () => {
    expect(countMemoChars("[abc](https://example.com)")).toBe(3);
    expect(countMemoChars("**bold** and _em_")).toBe(11);
  });
});

describe("toCreatedAt", () => {
  it("returns undefined for an empty value", () => {
    expect(toCreatedAt("")).toBeUndefined();
  });

  it("appends seconds to a minute-precision datetime-local value", () => {
    expect(toCreatedAt("2026-08-08T12:34")).toBe("2026-08-08 12:34:00");
  });

  it("keeps seconds when the value already has them", () => {
    expect(toCreatedAt("2026-08-08T12:34:56")).toBe("2026-08-08 12:34:56");
  });
});
