import { describe, expect, it } from "vitest";
import { ContentMismatchError } from "#/utils/caption";
import { buildFashionSeries, flattenFashionSheets } from "#/utils/fashion";

const modules = (paths: string[]) =>
  Object.fromEntries(paths.map((path) => [path, { default: path }]));

const captions = [
  { slug: "series-2", title: "Series 2", year: 2019 },
  { slug: "series-1", title: "Series 1", year: 2018 },
];

describe("buildFashionSeries", () => {
  it("groups images under their series in caption order", () => {
    const series = buildFashionSeries(
      captions,
      modules([
        "../../art-content/fashion/series-1/01.jpg",
        "../../art-content/fashion/series-2/01.jpg",
        "../../art-content/fashion/series-1/02.jpg",
      ]),
    );

    expect(series.map(({ slug }) => slug)).toEqual(["series-2", "series-1"]);
    expect(series[1]?.images).toEqual([
      { src: "../../art-content/fashion/series-1/01.jpg", number: 1 },
      { src: "../../art-content/fashion/series-1/02.jpg", number: 2 },
    ]);
    expect(series[0]).toMatchObject({ title: "Series 2", year: 2019 });
  });

  it("orders images numerically past nine", () => {
    const series = buildFashionSeries(
      [captions[1] as (typeof captions)[number]],
      modules([
        "../../art-content/fashion/series-1/10.jpg",
        "../../art-content/fashion/series-1/09.jpg",
        "../../art-content/fashion/series-1/02.jpg",
      ]),
    );

    expect(series[0]?.images.map(({ number }) => number)).toEqual([2, 9, 10]);
  });

  it("throws when a series has no images", () => {
    expect(() =>
      buildFashionSeries(captions, modules(["../../art-content/fashion/series-1/01.jpg"])),
    ).toThrow(ContentMismatchError);
  });

  it("throws when an image directory has no caption", () => {
    expect(() =>
      buildFashionSeries(
        captions,
        modules([
          "../../art-content/fashion/series-1/01.jpg",
          "../../art-content/fashion/series-2/01.jpg",
          "../../art-content/fashion/stray/01.jpg",
        ]),
      ),
    ).toThrow(/stray/u);
  });

  it("throws when a series directory holds a file that is not NN.jpg", () => {
    expect(() =>
      buildFashionSeries(
        captions,
        modules([
          "../../art-content/fashion/series-1/01.jpg",
          "../../art-content/fashion/series-2/01.jpg",
          "../../art-content/fashion/series-2/cover.jpg",
        ]),
      ),
    ).toThrow(/series-2\/cover\.jpg/u);
  });

  it("throws when two files resolve to the same sheet number", () => {
    expect(() =>
      buildFashionSeries(
        captions,
        modules([
          "../../art-content/fashion/series-1/01.jpg",
          "../../art-content/fashion/series-1/1.jpg",
          "../../art-content/fashion/series-2/01.jpg",
        ]),
      ),
    ).toThrow(/Duplicate sheet number 1 in fashion\/series-1/u);
  });

  it("ignores paths outside the fashion tree", () => {
    const series = buildFashionSeries(
      captions,
      modules([
        "../../art-content/fashion/series-1/01.jpg",
        "../../art-content/fashion/series-2/01.jpg",
        "../../art-content/works/azure.jpg",
      ]),
    );

    expect(series).toHaveLength(2);
  });

  it("returns an empty list with no captions and no images", () => {
    expect(buildFashionSeries([], {})).toEqual([]);
  });
});

describe("flattenFashionSheets", () => {
  it("lists every sheet in series order, then number order, with the series caption", () => {
    const series = buildFashionSeries(
      captions,
      modules([
        "../../art-content/fashion/series-1/02.jpg",
        "../../art-content/fashion/series-1/01.jpg",
        "../../art-content/fashion/series-2/01.jpg",
      ]),
    );

    const sheets = flattenFashionSheets(series);

    expect(sheets.map((sheet) => `${sheet.series.slug}/${sheet.image.number}`)).toEqual([
      "series-2/1",
      "series-1/1",
      "series-1/2",
    ]);
    expect(sheets[0]?.series).toEqual({ slug: "series-2", title: "Series 2", year: 2019 });
  });
});
