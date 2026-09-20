import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Metadata } from "@kkhys/ui/link-metadata";
import { afterEach, describe, expect, test } from "vitest";
import { readLinkMetadata, writeLinkMetadata } from "#/lib/link-metadata-cache";

const dirs: string[] = [];

const cacheFile = (contents?: string): string => {
  const dir = mkdtempSync(join(tmpdir(), "link-metadata-"));
  dirs.push(dir);
  const path = join(dir, "link-metadata.json");
  if (contents !== undefined) writeFileSync(path, contents, "utf8");
  return path;
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const IMAGE = "https://example.com/og.png";

describe("readLinkMetadata", () => {
  test("should expand a stored entry into the fetcher's shape", () => {
    const path = cacheFile(
      JSON.stringify({
        "https://example.com": {
          title: "Example",
          description: "An example",
          icon: "https://example.com/favicon.ico",
          image: IMAGE,
        },
      }),
    );

    expect(readLinkMetadata(path)).toEqual({
      "https://example.com": {
        title: "Example",
        description: "An example",
        icon: "https://example.com/favicon.ico",
        image: { src: IMAGE, width: undefined, height: undefined, alt: undefined },
      },
    });
  });

  test("should leave the optional fields undefined when they are absent", () => {
    const path = cacheFile(JSON.stringify({ "https://example.com": { title: "Example" } }));

    expect(readLinkMetadata(path)["https://example.com"]).toEqual({
      title: "Example",
      description: undefined,
      icon: undefined,
      image: undefined,
    });
  });

  test("should skip an entry without a title so the build retries it", () => {
    const path = cacheFile(
      JSON.stringify({
        "https://empty.example": { description: "No title" },
        "https://ok.example": { title: "Ok" },
      }),
    );

    expect(Object.keys(readLinkMetadata(path))).toEqual(["https://ok.example"]);
  });

  test("should return nothing when the file is missing", () => {
    expect(readLinkMetadata(join(tmpdir(), "no-such-link-metadata.json"))).toEqual({});
  });

  test.each([
    ["broken JSON", "{"],
    ["a JSON array", "[]"],
    ["a JSON scalar", '"nope"'],
  ])("should return nothing for %s", (_label, contents) => {
    expect(readLinkMetadata(cacheFile(contents))).toEqual({});
  });
});

const entry = (title: string | undefined, image?: string): Metadata => ({
  title,
  description: undefined,
  icon: undefined,
  image: image ? { src: image, width: "1200", height: "630", alt: "" } : undefined,
});

describe("writeLinkMetadata", () => {
  test("should sort by URL and keep only the image src", () => {
    const path = cacheFile();
    writeLinkMetadata(
      { "https://b.example": entry("B", IMAGE), "https://a.example": entry("A") },
      path,
    );

    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({
      "https://a.example": { title: "A" },
      "https://b.example": { title: "B", image: IMAGE },
    });
    expect(Object.keys(JSON.parse(readFileSync(path, "utf8")))).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
  });

  test("should drop an entry the fetcher could not resolve", () => {
    const path = cacheFile();
    writeLinkMetadata({ "https://a.example": entry(undefined) }, path);

    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({});
  });

  test("should round-trip through readLinkMetadata", () => {
    const path = cacheFile();
    writeLinkMetadata({ "https://a.example": entry("A", IMAGE) }, path);

    expect(readLinkMetadata(path)["https://a.example"]).toEqual({
      title: "A",
      description: undefined,
      icon: undefined,
      image: { src: IMAGE, width: undefined, height: undefined, alt: undefined },
    });
  });
});
