import { describe, expect, it } from "vitest";

import { scoreLevel } from "#/utils/score";

describe("scoreLevel", () => {
  it.each([
    [100, "hi"],
    [80, "hi"],
    [79, "mid"],
    [60, "mid"],
    [59, "lo"],
    [0, "lo"],
  ] as const)("maps %i to %s", (score, level) => {
    expect(scoreLevel(score)).toBe(level);
  });
});
