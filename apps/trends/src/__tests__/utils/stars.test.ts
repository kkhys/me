import { describe, expect, it } from "vitest";

import { interestStars } from "#/utils/stars";

describe("interestStars", () => {
  it("fills all three at level 3", () => {
    expect(interestStars(3)).toEqual({ filled: 3, empty: 0 });
  });

  it("leaves one empty at level 2", () => {
    expect(interestStars(2)).toEqual({ filled: 2, empty: 1 });
  });

  it("renders nothing at level 1", () => {
    expect(interestStars(1)).toBeUndefined();
  });
});
