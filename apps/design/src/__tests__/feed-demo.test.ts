import { describe, expect, it } from "vitest";
import { FEED_DEMO, FEED_DEMO_ITEMS, feedDemoPage, feedDemoPageCount } from "#/utils/feed-demo";

const itemIds = (page: number): number[] =>
  (feedDemoPage(page)?.items ?? []).map((item) => item.id);

describe("feedDemoPage", () => {
  it("splits the fixture into full pages", () => {
    expect(feedDemoPageCount()).toBe(4);
    expect(itemIds(1)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(itemIds(4)).toEqual([19, 20, 21, 22, 23, 24]);
  });

  it("carries the paging state InfiniteScroll reads", () => {
    expect(feedDemoPage(2)).toMatchObject({ currentPage: 2, totalPages: 4 });
  });

  it("covers every item exactly once", () => {
    const ids = Array.from({ length: feedDemoPageCount() }, (_, index) =>
      itemIds(index + 1),
    ).flat();
    expect(ids).toEqual(FEED_DEMO_ITEMS.map((item) => item.id));
    expect(ids).toHaveLength(FEED_DEMO.total);
  });

  it("rejects pages outside the range", () => {
    expect(feedDemoPage(0)).toBeUndefined();
    expect(feedDemoPage(5)).toBeUndefined();
    expect(feedDemoPage(1.5)).toBeUndefined();
    expect(feedDemoPage(Number.NaN)).toBeUndefined();
  });

  it("gives every item a line of text", () => {
    for (const item of FEED_DEMO_ITEMS) expect(item.text).not.toBe("");
  });
});
