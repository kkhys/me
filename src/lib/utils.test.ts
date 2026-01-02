import { describe, expect, it } from "vitest";
import { add, toUpperCase } from "#/lib/utils";

describe("utils", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(1, 2)).toBe(3);
    });

    it("should add negative numbers", () => {
      expect(add(-1, -2)).toBe(-3);
    });

    it("should add zero", () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("toUpperCase", () => {
    it("should convert lowercase to uppercase", () => {
      expect(toUpperCase("hello")).toBe("HELLO");
    });

    it("should keep uppercase strings unchanged", () => {
      expect(toUpperCase("WORLD")).toBe("WORLD");
    });

    it("should handle empty strings", () => {
      expect(toUpperCase("")).toBe("");
    });
  });
});
