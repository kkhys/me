import { describe, expect, it } from "vitest";

import { highlightAnchors, itemAnchorId } from "#/utils/highlights";

const markets = [
  {
    id: "global",
    services: [
      {
        id: "hackernews",
        label: "Hacker News",
        items: [{ url: "https://a" }, { url: "https://b" }],
      },
      { id: "lobsters", label: "Lobsters", items: [{ url: "https://a" }] },
    ],
  },
  {
    id: "japan",
    services: [{ id: "zenn", label: "Zenn", items: [{ url: "https://c" }] }],
  },
];

describe("itemAnchorId", () => {
  it("joins market, service and rank", () => {
    expect(itemAnchorId("global", "hackernews", 3)).toBe("global-hackernews-3");
  });
});

describe("highlightAnchors", () => {
  it("resolves to the row in the highlight's own service", () => {
    const anchors = highlightAnchors(markets, [{ url: "https://a", service_label: "Lobsters" }]);

    expect(anchors.get("https://a")).toBe("global-lobsters-1");
  });

  it("falls back to the first row with the same URL when the label does not match", () => {
    const anchors = highlightAnchors(markets, [{ url: "https://a", service_label: "Techmeme" }]);

    expect(anchors.get("https://a")).toBe("global-hackernews-1");
  });

  it("uses 1-based ranks", () => {
    const anchors = highlightAnchors(markets, [{ url: "https://b", service_label: "Hacker News" }]);

    expect(anchors.get("https://b")).toBe("global-hackernews-2");
  });

  it("skips highlights that have no row", () => {
    const anchors = highlightAnchors(markets, [{ url: "https://x", service_label: "Zenn" }]);

    expect(anchors.size).toBe(0);
  });
});
