import { describe, expect, it } from "vitest";
import { ContentMismatchError, sortByOrder } from "#/utils/caption";

describe("sortByOrder", () => {
  it("restores YAML order from the order field without mutating the input", () => {
    const captions = [
      { slug: "b", title: "B", year: 2016, order: 1 },
      { slug: "c", title: "C", year: 2015, order: 2 },
      { slug: "a", title: "A", year: 2018, order: 0 },
    ];

    expect(sortByOrder(captions).map(({ slug }) => slug)).toEqual(["a", "b", "c"]);
    expect(captions.map(({ slug }) => slug)).toEqual(["b", "c", "a"]);
  });
});

describe("ContentMismatchError", () => {
  it("names both the captions without images and the images without captions", () => {
    const error = new ContentMismatchError("works", ["azure"], ["stray"]);

    expect(error.name).toBe("ContentMismatchError");
    expect(error.message).toContain("works");
    expect(error.message).toContain("Captions without an image: azure");
    expect(error.message).toContain("Images without a caption: stray");
  });
});
