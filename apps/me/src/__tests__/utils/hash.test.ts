import { describe, expect, it } from "vitest";
import { generateBech32m } from "#/utils/hash";

describe("generateBech32m", () => {
  it("always returns a 7-character string", () => {
    expect(generateBech32m("test", "h")).toHaveLength(7);
    expect(generateBech32m("another input", "p")).toHaveLength(7);
  });

  it("is deterministic (same input produces same output)", () => {
    const result1 = generateBech32m("hello", "h");
    const result2 = generateBech32m("hello", "h");
    expect(result1).toBe(result2);
  });

  it("produces different output for different prefixes", () => {
    const result1 = generateBech32m("test", "h");
    const result2 = generateBech32m("test", "p");
    expect(result1).not.toBe(result2);
  });

  it("produces different output for different data", () => {
    const result1 = generateBech32m("foo", "h");
    const result2 = generateBech32m("bar", "h");
    expect(result1).not.toBe(result2);
  });

  it("includes the prefix character in the result", () => {
    const result = generateBech32m("test", "h");
    expect(result).toMatch(/^h/);
  });
});
