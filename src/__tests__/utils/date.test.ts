import { describe, expect, it } from "vitest";
import { convertDateToString } from "#/utils/date";

describe("convertDateToString", () => {
  it("formats a regular date in Japanese locale", () => {
    expect(convertDateToString(new Date("2024-01-15"))).toBe("2024年1月15日");
  });

  it("formats year-end date", () => {
    expect(convertDateToString(new Date("2024-12-31"))).toBe("2024年12月31日");
  });

  it("formats year-start date", () => {
    expect(convertDateToString(new Date("2024-01-01"))).toBe("2024年1月1日");
  });

  it("formats leap year date", () => {
    expect(convertDateToString(new Date("2024-02-29"))).toBe("2024年2月29日");
  });
});
