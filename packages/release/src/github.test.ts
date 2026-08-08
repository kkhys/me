import { describe, expect, it } from "vitest";
import { buildReleaseBody } from "./github";

const repo = { repoOwner: "kkhys", repoName: "me" };

describe("buildReleaseBody", () => {
  it("links the compare view when a previous tag exists", () => {
    const body = buildReleaseBody("2026.08.08", "2026.08.01", repo);

    expect(body).toContain("Automatic release for version 2026.08.08.");
    expect(body).toContain("https://github.com/kkhys/me/compare/2026.08.01...2026.08.08");
  });

  it("notes the absence of a previous release", () => {
    const body = buildReleaseBody("2026.08.08", null, repo);

    expect(body).toContain("(No previous release found for comparison.)");
  });
});
