import { describe, expect, it } from "vitest";
import { padNumber, parseSheetNumber } from "#/utils/sheet-number";

describe("padNumber", () => {
  it("pads to two digits like the NN.jpg file names", () => {
    expect(padNumber(1)).toBe("01");
    expect(padNumber(10)).toBe("10");
    expect(padNumber(123)).toBe("123");
  });
});

describe("parseSheetNumber", () => {
  it("reads a numeric file name", () => {
    expect(parseSheetNumber("01")).toBe(1);
    expect(parseSheetNumber("10")).toBe(10);
  });

  it("rejects anything that is not all digits", () => {
    expect(parseSheetNumber("cover")).toBeUndefined();
    expect(parseSheetNumber("01a")).toBeUndefined();
    expect(parseSheetNumber("01 (1)")).toBeUndefined();
    expect(parseSheetNumber("")).toBeUndefined();
  });

  it("round-trips with padNumber", () => {
    for (const number of [1, 9, 10, 99, 100]) {
      expect(parseSheetNumber(padNumber(number))).toBe(number);
    }
  });
});
