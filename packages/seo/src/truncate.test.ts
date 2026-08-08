import { describe, expect, it } from "vitest";
import { truncateDescription } from "./truncate";

describe("truncateDescription", () => {
  it("returns short descriptions unchanged", () => {
    expect(truncateDescription("hello", 200, false)).toBe("hello");
    expect(truncateDescription("hello", 200, true)).toBe("hello");
  });

  it("keeps text exactly at the limit unchanged", () => {
    expect(truncateDescription("abcde", 5, true)).toBe("abcde");
  });

  it("hard-slices without ellipsis", () => {
    expect(truncateDescription("abcdefgh", 5, false)).toBe("abcde");
  });

  it("reserves room for the ellipsis", () => {
    const result = truncateDescription("abcdefgh", 5, true);
    expect(result).toBe("ab...");
    expect(result).toHaveLength(5);
  });

  it("never slices with a negative index for tiny limits", () => {
    expect(truncateDescription("abcdefgh", 2, true)).toBe("...");
  });
});
