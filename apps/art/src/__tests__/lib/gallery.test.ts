import { describe, expect, it, vi } from "vitest";
import { loadFashionSeries, loadWorks } from "#/lib/gallery";

// The data store returns entries sorted by id; feed them in that order so the
// test fails if the YAML order stops being restored.
type Entry = { id: string; data: { slug: string; title: string; year: number; order: number } };

vi.mock("astro:content", () => ({
  getCollection: vi.fn<(collection: "works" | "fashion") => Promise<Entry[]>>((collection) =>
    Promise.resolve(
      collection === "works"
        ? [
            {
              id: "sample-work",
              data: { slug: "sample-work", title: "Sample Work", year: 2024, order: 1 },
            },
            {
              id: "sample-work-2",
              data: { slug: "sample-work-2", title: "Sample Work Ⅱ", year: 2023, order: 0 },
            },
          ]
        : [
            {
              id: "sample-series",
              data: { slug: "sample-series", title: "Sample Series", year: 2024, order: 0 },
            },
          ],
    ),
  ),
}));

describe("loadWorks", () => {
  it("returns works in YAML order with their fixture images", async () => {
    const works = await loadWorks();

    expect(works.map(({ slug }) => slug)).toEqual(["sample-work-2", "sample-work"]);
    expect(works.map(({ src }) => String(src))).toEqual([
      expect.stringContaining("sample-work-2"),
      expect.stringContaining("sample-work"),
    ]);
    expect(works[0]).not.toHaveProperty("order");
  });
});

describe("loadFashionSeries", () => {
  it("returns each series with its sheets in numeric order", async () => {
    const series = await loadFashionSeries();

    expect(series).toHaveLength(1);
    expect(series[0]?.images.map(({ number }) => number)).toEqual([1, 2]);
  });
});
