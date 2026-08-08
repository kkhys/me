import { describe, expect, it } from "vitest";
import { resolveLgtmBasePath } from "#/config/content-path";

describe("resolveLgtmBasePath", () => {
  it("uses the fixture path when GITHUB_ACTIONS is true", () => {
    expect(resolveLgtmBasePath(true)).toBe("./src/__fixtures__/lgtm-sample");
  });

  it("uses the lgtm-content path when GITHUB_ACTIONS is false", () => {
    expect(resolveLgtmBasePath(false)).toBe("./lgtm-content/lgtm");
  });
});
