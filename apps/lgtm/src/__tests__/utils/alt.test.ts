import { describe, expect, it } from "vitest";
import { lgtmAlt } from "#/utils/alt";

describe("lgtmAlt", () => {
  it("prefixes the description with the overlaid text", () => {
    expect(lgtmAlt("a cat asleep on a keyboard")).toBe("LGTM over a cat asleep on a keyboard");
  });

  it("trims the description", () => {
    expect(lgtmAlt("  a cat asleep on a keyboard\n")).toBe("LGTM over a cat asleep on a keyboard");
  });
});
