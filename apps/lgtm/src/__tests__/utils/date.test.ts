import { describe, expect, it } from "vitest";
import { formatDate } from "#/utils/date";

describe("formatDate", () => {
  it("formats as yyyy.MM.dd", () => {
    expect(formatDate(new Date("2026-08-14"))).toBe("2026.08.14");
  });

  it("pads single-digit month and day", () => {
    expect(formatDate(new Date("2025-01-05"))).toBe("2025.01.05");
  });

  it("reads the date in UTC", () => {
    expect(formatDate(new Date("2025-12-31T23:59:59Z"))).toBe("2025.12.31");
  });
});
