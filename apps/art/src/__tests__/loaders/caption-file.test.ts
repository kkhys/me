import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCaptionYaml, readCaptionFile } from "#/loaders/caption-file";

describe("parseCaptionYaml", () => {
  it("attaches each item's position as order", () => {
    const text = ["- slug: b", "  title: B", "- slug: a", "  title: A"].join("\n");

    expect(parseCaptionYaml(text)).toEqual([
      { slug: "b", title: "B", order: 0 },
      { slug: "a", title: "A", order: 1 },
    ]);
  });

  it("overrides an order written in the file", () => {
    expect(parseCaptionYaml("- slug: a\n  order: 9")).toEqual([{ slug: "a", order: 0 }]);
  });

  it.each([
    ["a mapping", "slug: a"],
    ["an empty file", ""],
    ["an empty array", "[]"],
  ])("rejects %s", (_name, text) => {
    expect(() => parseCaptionYaml(text)).toThrow(/non-empty YAML array/u);
  });

  it("rejects an item that is not a mapping", () => {
    expect(() => parseCaptionYaml("- slug: a\n- just-a-string")).toThrow(/position 1/u);
  });

  it("rejects a duplicate slug instead of letting the loader keep the last one", () => {
    expect(() => parseCaptionYaml("- slug: a\n- slug: b\n- slug: a")).toThrow(
      /Duplicate slug "a"/u,
    );
  });
});

describe("readCaptionFile", () => {
  it("parses the fixture works file, which is deliberately not in id order", () => {
    const path = fileURLToPath(new URL("../../__fixtures__/works/works.yaml", import.meta.url));

    expect(readCaptionFile(path).map(({ slug, order }) => ({ slug, order }))).toEqual([
      { slug: "sample-work-2", order: 0 },
      { slug: "sample-work", order: 1 },
    ]);
  });

  it("points at the submodule when the file is missing", () => {
    expect(() => readCaptionFile("./art-content/missing/missing.yaml")).toThrow(
      /Initialize the art-content submodule/u,
    );
  });

  it("names the file when its contents are invalid", () => {
    const path = fileURLToPath(new URL("./caption-file.test.ts", import.meta.url));

    expect(() => readCaptionFile(path)).toThrow(/Invalid caption file .*caption-file\.test\.ts/u);
  });
});
