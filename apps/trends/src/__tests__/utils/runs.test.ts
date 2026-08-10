import { describe, expect, it } from "vitest";

import { adjacentRuns, sortRunsByDateDesc } from "#/utils/runs";

describe("sortRunsByDateDesc", () => {
  it("sorts newest first", () => {
    const runs = [{ id: "2026-08-08" }, { id: "2026-08-10" }, { id: "2026-08-09" }];

    expect(sortRunsByDateDesc(runs).map((r) => r.id)).toEqual([
      "2026-08-10",
      "2026-08-09",
      "2026-08-08",
    ]);
  });

  it("does not mutate the input", () => {
    const runs = [{ id: "2026-08-08" }, { id: "2026-08-10" }];
    sortRunsByDateDesc(runs);

    expect(runs.map((r) => r.id)).toEqual(["2026-08-08", "2026-08-10"]);
  });

  it("sorts across month and year boundaries", () => {
    const runs = [{ id: "2025-12-31" }, { id: "2026-01-01" }, { id: "2026-02-01" }];

    expect(sortRunsByDateDesc(runs).map((r) => r.id)).toEqual([
      "2026-02-01",
      "2026-01-01",
      "2025-12-31",
    ]);
  });
});

describe("adjacentRuns", () => {
  const ids = ["2026-08-10", "2026-08-09", "2026-08-08"];

  it("returns prev only for the newest run", () => {
    expect(adjacentRuns(ids, "2026-08-10")).toEqual({
      prev: "2026-08-09",
      next: undefined,
    });
  });

  it("returns both neighbors for a middle run", () => {
    expect(adjacentRuns(ids, "2026-08-09")).toEqual({
      prev: "2026-08-08",
      next: "2026-08-10",
    });
  });

  it("returns next only for the oldest run", () => {
    expect(adjacentRuns(ids, "2026-08-08")).toEqual({
      prev: undefined,
      next: "2026-08-09",
    });
  });

  it("returns no neighbors for an unknown id", () => {
    expect(adjacentRuns(ids, "2026-01-01")).toEqual({
      prev: undefined,
      next: undefined,
    });
  });
});
