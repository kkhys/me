import { describe, expect, it } from "vitest";
import { ContentMismatchError } from "#/utils/caption";
import { buildWorks } from "#/utils/works";

const modules = (paths: string[]) =>
  Object.fromEntries(paths.map((path) => [path, { default: path }]));

const captions = [
  { slug: "azure", title: "Azure", year: 2018 },
  { slug: "landscape-2", title: "Landscape Ⅱ", year: 2016 },
];

describe("buildWorks", () => {
  it("pairs captions with images in caption order", () => {
    const works = buildWorks(
      captions,
      modules(["../../art-content/works/landscape-2.jpg", "../../art-content/works/azure.jpg"]),
    );

    expect(works.map(({ slug }) => slug)).toEqual(["azure", "landscape-2"]);
    expect(works[0]?.src).toBe("../../art-content/works/azure.jpg");
    expect(works[1]).toMatchObject({ title: "Landscape Ⅱ", year: 2016 });
  });

  it("throws when a caption has no image", () => {
    expect(() => buildWorks(captions, modules(["../../art-content/works/azure.jpg"]))).toThrow(
      ContentMismatchError,
    );
    expect(() => buildWorks(captions, modules(["../../art-content/works/azure.jpg"]))).toThrow(
      /landscape-2/u,
    );
  });

  it("throws when an image has no caption", () => {
    expect(() =>
      buildWorks(
        captions,
        modules([
          "../../art-content/works/azure.jpg",
          "../../art-content/works/landscape-2.jpg",
          "../../art-content/works/stray.jpg",
        ]),
      ),
    ).toThrow(/stray/u);
  });

  it("ignores images outside the works directory", () => {
    const works = buildWorks(
      captions,
      modules([
        "../../art-content/works/azure.jpg",
        "../../art-content/works/landscape-2.jpg",
        "../../art-content/fashion/series-1/01.jpg",
      ]),
    );

    expect(works).toHaveLength(2);
  });

  it("returns an empty list with no captions and no images", () => {
    expect(buildWorks([], {})).toEqual([]);
  });
});
