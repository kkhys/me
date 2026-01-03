import { describe, expect, test } from "vitest";
import { formatDate, formatDateTime } from "#/utils/date";

describe("formatDate", () => {
  test("should format date as yyyy/MM/dd", () => {
    const date = new Date("2025-11-22T09:32:12Z");
    expect(formatDate(date)).toBe("2025/11/22");
  });

  test("should pad single digit month and day with zero", () => {
    const date = new Date("2025-01-05T00:00:00Z");
    expect(formatDate(date)).toBe("2025/01/05");
  });

  test("should handle end of year date", () => {
    const date = new Date("2025-12-31T23:59:59Z");
    expect(formatDate(date)).toBe("2025/12/31");
  });

  test("should handle start of year date", () => {
    const date = new Date("2025-01-01T00:00:00Z");
    expect(formatDate(date)).toBe("2025/01/01");
  });
});

describe("formatDateTime", () => {
  test("should format datetime as yyyy/MM/dd HH:mm:ss", () => {
    const date = new Date("2025-11-22T09:32:12Z");
    expect(formatDateTime(date)).toBe("2025/11/22 09:32:12");
  });

  test("should pad single digit values with zero", () => {
    const date = new Date("2025-01-05T01:02:03Z");
    expect(formatDateTime(date)).toBe("2025/01/05 01:02:03");
  });

  test("should handle midnight", () => {
    const date = new Date("2025-11-22T00:00:00Z");
    expect(formatDateTime(date)).toBe("2025/11/22 00:00:00");
  });

  test("should handle end of day", () => {
    const date = new Date("2025-11-22T23:59:59Z");
    expect(formatDateTime(date)).toBe("2025/11/22 23:59:59");
  });

  test("should handle noon time", () => {
    const date = new Date("2025-11-22T12:00:00Z");
    expect(formatDateTime(date)).toBe("2025/11/22 12:00:00");
  });
});
