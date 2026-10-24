import { describe, expect, it } from "vitest";

import {
  daysBetween,
  describeRange,
  inRange,
  isAskScope,
  jaDate,
  monthsOf,
  previousRange,
  scopeRange,
  shiftDate,
} from "#/features/ask/utils/scope";

describe("shiftDate / daysBetween", () => {
  it("moves across month and year ends", () => {
    expect(shiftDate("2026-10-24", -6)).toBe("2026-10-18");
    expect(shiftDate("2026-03-01", -1)).toBe("2026-02-28");
    expect(shiftDate("2026-12-31", 1)).toBe("2027-01-01");
    expect(daysBetween("2026-10-18", "2026-10-24")).toBe(7);
    expect(daysBetween("2026-10-24", "2026-10-24")).toBe(1);
  });
});

describe("scopeRange", () => {
  it("covers the open day, the 7 or 30 days ending on it, or everything", () => {
    expect(scopeRange("day", "2026-10-24", "2026-05-01")).toEqual({
      start: "2026-10-24",
      end: "2026-10-24",
    });
    expect(scopeRange("week", "2026-10-24", "2026-05-01")).toEqual({
      start: "2026-10-18",
      end: "2026-10-24",
    });
    expect(scopeRange("month", "2026-10-24", "2026-05-01")).toEqual({
      start: "2026-09-25",
      end: "2026-10-24",
    });
    expect(scopeRange("all", "2026-10-24", "2026-05-01")).toEqual({
      start: "2026-05-01",
      end: "2026-10-24",
    });
  });

  it("never reaches before the first run", () => {
    expect(scopeRange("month", "2026-05-03", "2026-05-01")).toEqual({
      start: "2026-05-01",
      end: "2026-05-03",
    });
  });
});

describe("previousRange", () => {
  it("is the same length just before, clamped to the first run", () => {
    expect(previousRange({ start: "2026-10-18", end: "2026-10-24" }, "2026-05-01")).toEqual({
      start: "2026-10-11",
      end: "2026-10-17",
    });
    expect(previousRange({ start: "2026-05-03", end: "2026-05-09" }, "2026-05-01")).toEqual({
      start: "2026-05-01",
      end: "2026-05-02",
    });
  });

  it("is undefined when the range starts at the first run", () => {
    expect(previousRange({ start: "2026-05-01", end: "2026-05-07" }, "2026-05-01")).toBeUndefined();
  });
});

describe("monthsOf / inRange", () => {
  it("lists the months a range touches, across a year end", () => {
    expect(monthsOf({ start: "2026-10-18", end: "2026-10-24" })).toEqual(["2026-10"]);
    expect(monthsOf({ start: "2026-09-25", end: "2026-10-24" })).toEqual(["2026-09", "2026-10"]);
    expect(monthsOf({ start: "2026-11-30", end: "2027-01-02" })).toEqual([
      "2026-11",
      "2026-12",
      "2027-01",
    ]);
  });

  it("includes both ends of a range", () => {
    const range = { start: "2026-10-18", end: "2026-10-24" };
    expect(inRange("2026-10-18", range)).toBe(true);
    expect(inRange("2026-10-24", range)).toBe(true);
    expect(inRange("2026-10-17", range)).toBe(false);
    expect(inRange("2026-10-25", range)).toBe(false);
  });
});

describe("describeRange / jaDate / isAskScope", () => {
  it("names one day plainly and a span with its length", () => {
    expect(describeRange({ start: "2026-10-24", end: "2026-10-24" })).toBe("2026-10-24");
    expect(describeRange({ start: "2026-10-18", end: "2026-10-24" })).toBe(
      "2026-10-18〜2026-10-24（7 日間）",
    );
  });

  it("writes a date the way the model is asked to", () => {
    expect(jaDate("2026-10-05")).toBe("10月5日");
  });

  it("accepts only the four scopes", () => {
    expect(["day", "week", "month", "all"].every((scope) => isAskScope(scope))).toBe(true);
    expect(isAskScope("year")).toBe(false);
    expect(isAskScope(undefined)).toBe(false);
  });
});
