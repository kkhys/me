import { describe, expect, it } from "vitest";
import { resolveReleaseVersion } from "./version";

describe("resolveReleaseVersion", () => {
  const base = "2026.06.27";

  it("returns the base version when no tags exist", () => {
    expect(resolveReleaseVersion(base, [])).toBe(base);
  });

  it("ignores tags from other dates", () => {
    expect(resolveReleaseVersion(base, ["2026.06.26", "2025.01.01"])).toBe(
      base,
    );
  });

  it("appends -2 when the base version is already tagged", () => {
    expect(resolveReleaseVersion(base, [base])).toBe(`${base}-2`);
  });

  it("increments the suffix past existing numbered releases", () => {
    expect(resolveReleaseVersion(base, [base, `${base}-2`, `${base}-3`])).toBe(
      `${base}-4`,
    );
  });

  it("takes the first free suffix even when a later one exists", () => {
    expect(resolveReleaseVersion(base, [base, `${base}-3`])).toBe(`${base}-2`);
  });
});
