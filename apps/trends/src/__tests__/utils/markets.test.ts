import { describe, expect, it } from "vitest";

import { sortMarketsGlobalFirst } from "#/utils/markets";

describe("sortMarketsGlobalFirst", () => {
  it("moves global ahead of japan", () => {
    const markets = [{ id: "japan" }, { id: "global" }];

    expect(sortMarketsGlobalFirst(markets).map((m) => m.id)).toEqual(["global", "japan"]);
  });

  it("keeps the order when already global first", () => {
    const markets = [{ id: "global" }, { id: "japan" }];

    expect(sortMarketsGlobalFirst(markets).map((m) => m.id)).toEqual(["global", "japan"]);
  });

  it("does not mutate the input", () => {
    const markets = [{ id: "japan" }, { id: "global" }];
    sortMarketsGlobalFirst(markets);

    expect(markets.map((m) => m.id)).toEqual(["japan", "global"]);
  });
});
