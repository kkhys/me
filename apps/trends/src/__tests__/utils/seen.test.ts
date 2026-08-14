import { describe, expect, it } from "vitest";

import { countSeen } from "#/utils/seen";

describe("countSeen", () => {
  it("counts items flagged seen_before", () => {
    const items = [{ seen_before: true }, { seen_before: false }, { seen_before: true }];

    expect(countSeen(items)).toBe(2);
  });

  it("returns 0 when nothing is flagged", () => {
    expect(countSeen([{ seen_before: false }])).toBe(0);
  });

  it("returns 0 for an empty list", () => {
    expect(countSeen([])).toBe(0);
  });
});
