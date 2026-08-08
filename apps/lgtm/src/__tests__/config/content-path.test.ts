import { describe, expect, it } from "vitest";
import { resolveLgtmBasePath } from "#/config/content-path";

describe("resolveLgtmBasePath", () => {
  it("uses the fixture path when fixtures are requested", () => {
    expect(resolveLgtmBasePath(true)).toBe("./src/__fixtures__/lgtm-sample");
  });

  it("uses the lgtm-content path otherwise", () => {
    expect(resolveLgtmBasePath(false)).toBe("./lgtm-content/lgtm");
  });
});
