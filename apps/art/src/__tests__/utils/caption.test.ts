import { describe, expect, it } from "vitest";
import {
  ContentMismatchError,
  orderedCaptionSchema,
  pairCaptionsWithImages,
  sortByOrder,
} from "#/utils/caption";

describe("orderedCaptionSchema", () => {
  it("accepts a kebab-case slug with a positional order", () => {
    expect(
      orderedCaptionSchema.parse({ slug: "landscape-2", title: "Landscape", year: 2016, order: 0 }),
    ).toEqual({ slug: "landscape-2", title: "Landscape", year: 2016, order: 0 });
  });

  it.each([
    ["an uppercase slug", { slug: "Azure", title: "Azure", year: 2018, order: 0 }],
    ["an empty title", { slug: "azure", title: "", year: 2018, order: 0 }],
    ["a year out of range", { slug: "azure", title: "Azure", year: 1899, order: 0 }],
    ["a missing order", { slug: "azure", title: "Azure", year: 2018 }],
  ])("rejects %s", (_name, caption) => {
    expect(orderedCaptionSchema.safeParse(caption).success).toBe(false);
  });
});

describe("sortByOrder", () => {
  it("restores YAML order and drops the order field without mutating the input", () => {
    const captions = [
      { slug: "b", title: "B", year: 2016, order: 1 },
      { slug: "c", title: "C", year: 2015, order: 2 },
      { slug: "a", title: "A", year: 2018, order: 0 },
    ];

    expect(sortByOrder(captions)).toEqual([
      { slug: "a", title: "A", year: 2018 },
      { slug: "b", title: "B", year: 2016 },
      { slug: "c", title: "C", year: 2015 },
    ]);
    expect(captions.map(({ slug }) => slug)).toEqual(["b", "c", "a"]);
  });
});

const pair = (caption: { slug: string }, image: string) => `${caption.slug}=${image}`;

describe("pairCaptionsWithImages", () => {
  const captions = [
    { slug: "azure", title: "Azure", year: 2018 },
    { slug: "blue", title: "Blue", year: 2019 },
  ];

  it("pairs in caption order, not map order", () => {
    const images = new Map([
      ["blue", "blue.jpg"],
      ["azure", "azure.jpg"],
    ]);

    expect(pairCaptionsWithImages("works", captions, images, pair)).toEqual([
      "azure=azure.jpg",
      "blue=blue.jpg",
    ]);
  });

  it("reports captions without images and images without captions together", () => {
    const images = new Map([
      ["azure", "azure.jpg"],
      ["stray", "stray.jpg"],
    ]);

    let error: unknown;
    try {
      pairCaptionsWithImages("works", captions, images, pair);
    } catch (thrown) {
      error = thrown;
    }

    expect(error).toBeInstanceOf(ContentMismatchError);
    expect(error).toMatchObject({
      kind: "works",
      missingImages: ["blue"],
      orphanImages: ["stray"],
    });
  });

  it("counts stray files as orphans", () => {
    const images = new Map([
      ["azure", "azure.jpg"],
      ["blue", "blue.jpg"],
    ]);

    expect(() =>
      pairCaptionsWithImages("fashion", captions, images, pair, ["azure/cover.jpg"]),
    ).toThrow(/azure\/cover\.jpg/u);
  });
});

describe("ContentMismatchError", () => {
  it("names both the captions without images and the images without captions", () => {
    const error = new ContentMismatchError({
      kind: "works",
      missingImages: ["azure"],
      orphanImages: ["stray"],
    });

    expect(error.name).toBe("ContentMismatchError");
    expect(error.message).toContain("works");
    expect(error.message).toContain("Captions without an image: azure");
    expect(error.message).toContain("Images without a caption: stray");
  });

  it("omits the line for a side with nothing missing", () => {
    const error = new ContentMismatchError({
      kind: "fashion",
      missingImages: [],
      orphanImages: ["stray"],
    });

    expect(error.message).not.toContain("Captions without an image");
    expect(error.message).toContain("Images without a caption: stray");
  });
});
