import { describe, expect, it } from "vitest";

import { formatHost } from "#/utils/host";

describe("formatHost", () => {
  it("extracts the hostname", () => {
    expect(formatHost("https://zenn.dev/foo/articles/bar")).toBe("zenn.dev");
  });

  it("strips a leading www.", () => {
    expect(formatHost("https://www.theregister.com/2026/08/07/amd")).toBe("theregister.com");
  });

  it("returns an empty string for an invalid URL", () => {
    expect(formatHost("not a url")).toBe("");
  });
});
