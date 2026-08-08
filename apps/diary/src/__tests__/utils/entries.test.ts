import { describe, expect, it } from "vitest";
import { buildEntries } from "#/utils/entries";

const modules = (paths: string[]) =>
  Object.fromEntries(paths.map((path) => [path, { default: path }]));

describe("buildEntries", () => {
  it("returns entries newest first with chronological numbers", () => {
    const entries = buildEntries(
      modules([
        "../../diary-content/diary/2026-01-02/1.jpg",
        "../../diary-content/diary/2026-01-01/1.jpg",
        "../../diary-content/diary/2026-01-03/1.jpg",
      ]),
    );

    expect(entries.map(({ date }) => date)).toEqual(["2026-01-03", "2026-01-02", "2026-01-01"]);
    expect(entries.map(({ number }) => number)).toEqual([3, 2, 1]);
  });

  it("orders photos within a day by file number", () => {
    const entries = buildEntries(
      modules([
        "../../diary-content/diary/2026-01-01/2.jpg",
        "../../diary-content/diary/2026-01-01/1.jpg",
      ]),
    );

    expect(entries.map(({ fileNumber }) => fileNumber)).toEqual(["2", "1"]);
    expect(entries.map(({ number }) => number)).toEqual([2, 1]);
  });

  it("orders file numbers numerically past nine", () => {
    const entries = buildEntries(
      modules([
        "../../diary-content/diary/2026-01-01/10.jpg",
        "../../diary-content/diary/2026-01-01/9.jpg",
        "../../diary-content/diary/2026-01-01/2.jpg",
      ]),
    );

    expect(entries.map(({ fileNumber }) => fileNumber)).toEqual(["10", "9", "2"]);
    expect(entries.map(({ number }) => number)).toEqual([3, 2, 1]);
  });

  it("ignores paths that do not match the diary layout", () => {
    const entries = buildEntries(
      modules([
        "../../diary-content/diary/2026-01-01/1.jpg",
        "../../diary-content/diary/notes/readme.jpg",
      ]),
    );

    expect(entries).toHaveLength(1);
  });

  it("returns an empty list when the submodule is absent", () => {
    expect(buildEntries({})).toEqual([]);
  });

  it("does not mutate glob module objects when numbering", () => {
    const input = modules(["../../diary-content/diary/2026-01-01/1.jpg"]);
    buildEntries(input);

    expect(input["../../diary-content/diary/2026-01-01/1.jpg"]).toEqual({
      default: "../../diary-content/diary/2026-01-01/1.jpg",
    });
  });
});
