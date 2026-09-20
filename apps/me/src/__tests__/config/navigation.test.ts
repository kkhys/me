import { describe, expect, it } from "vitest";
import { navItems } from "#/config/navigation";
import { me } from "#/config/site";

describe("navItems", () => {
  it("has a unique label and href for every item", () => {
    const labels = navItems.map((item) => item.label);
    const hrefs = navItems.map((item) => item.href);
    expect(new Set(labels).size).toBe(labels.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  // isExternal picks the markup: a mismatch renders an off-site link without
  // target/rel, or an internal one that never gets the active state.
  it("marks exactly the absolute https links as external", () => {
    for (const { href, isExternal } of navItems) {
      expect(href.startsWith("https://")).toBe(isExternal);
      expect(href.startsWith("/")).toBe(!isExternal);
    }
  });

  it("links to the vlog channel", () => {
    expect(navItems).toContainEqual({ label: "Vlog", href: me.youtube, isExternal: true });
  });
});
