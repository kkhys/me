import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const threadPost = readFileSync(
  path.resolve(__dirname, "../../components/thread-post.astro"),
  "utf8",
);

describe("thread-post attachment order", () => {
  // A quote card carries its own link card, so leaving the post's own card
  // below the quote buries it under a nested one and reads as the quote's.
  it("renders the link card above the quote card", () => {
    const linkCard = threadPost.indexOf('class="post-link-card"');
    const quote = threadPost.indexOf('class="post-quote"');

    expect(linkCard).toBeGreaterThan(-1);
    expect(quote).toBeGreaterThan(-1);
    expect(linkCard).toBeLessThan(quote);
  });
});
