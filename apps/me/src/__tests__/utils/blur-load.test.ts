import { describe, expect, it } from "vitest";
import { blurLoadHandlers } from "#/utils/blur-load";

describe("blurLoadHandlers", () => {
  it("targets the given ancestor selector", () => {
    expect(blurLoadHandlers(".blur-load").onload).toBe(
      "this.closest('.blur-load')?.classList.add('image-loaded')",
    );
  });

  it("reveals on error too, so a broken image doesn't stay blurred", () => {
    const { onload, onerror } = blurLoadHandlers("[data-blur-load]");
    expect(onerror).toBe(onload);
  });
});
