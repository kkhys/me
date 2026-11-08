import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sourceCard = readFileSync(
  path.resolve(__dirname, "../../components/source-card.astro"),
  "utf8",
);

describe("source-card anchors", () => {
  // A fragment jump measures a stuck element where it is stuck, so an id inside
  // the sticky header stops short of the section's top when jumped to from below.
  it("puts the TOC's jump target on the section, outside the sticky header", () => {
    const header = sourceCard.slice(
      sourceCard.indexOf("<header>"),
      sourceCard.indexOf("</header>"),
    );

    expect(sourceCard).toContain("<section id={id}");
    expect(header).not.toContain("id={id}");
  });

  // Pagefind only splits a page at headings with ids; without one the source
  // name would merge into the previous source's last row.
  it("keeps an id on the h3 for Pagefind", () => {
    expect(sourceCard).toContain("<h3 id={`${id}-title`}>");
  });
});
