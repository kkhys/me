import { describe, expect, it } from "vitest";
import {
  buildAuthorMeta,
  buildAvatarMeta,
  buildBodyMeta,
  buildDateMeta,
} from "#/features/search/utils/meta";

describe("buildAuthorMeta", () => {
  it("captures the author name element's text", () => {
    expect(buildAuthorMeta()).toBe("author");
  });
});

describe("buildDateMeta", () => {
  it("captures the visible date and the machine-readable datetime attribute", () => {
    expect(buildDateMeta()).toBe("date, datetime[datetime]");
  });
});

describe("buildAvatarMeta", () => {
  it("inlines the resolved avatar URL, colons and query string included", () => {
    expect(buildAvatarMeta("/_astro/profile.abc123_ZyX.webp")).toBe(
      "avatar:/_astro/profile.abc123_ZyX.webp",
    );
    expect(buildAvatarMeta("/_image?href=%2Fsrc%2Fassets%2Fprofile.jpg&w=54&h=54&f=webp")).toMatch(
      /^avatar:\/_image\?href=/u,
    );
  });
});

describe("buildBodyMeta", () => {
  it("blanks the automatic image capture", () => {
    expect(buildBodyMeta()).toBe("image:");
  });
});
