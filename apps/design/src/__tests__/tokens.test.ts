import { describe, expect, it } from "vitest";
import { filterByPrefix, parseCustomProperties, splitLightDark } from "#/utils/tokens";

describe("parseCustomProperties", () => {
  it("extracts declarations in order", () => {
    const css = `:root {\n  --fs-sm: 0.875rem;\n  --fw-medium: 500;\n}`;
    expect(parseCustomProperties(css)).toEqual([
      { name: "--fs-sm", value: "0.875rem" },
      { name: "--fw-medium", value: "500" },
    ]);
  });

  it("collapses multi-line values to single-space", () => {
    const css = `--font-mono:\n    ui-monospace, "Cascadia Code",\n    monospace;`;
    expect(parseCustomProperties(css)).toEqual([
      { name: "--font-mono", value: 'ui-monospace, "Cascadia Code", monospace' },
    ]);
  });

  it("returns an empty list when no custom properties exist", () => {
    expect(parseCustomProperties("html { color: red; }")).toEqual([]);
  });
});

describe("splitLightDark", () => {
  it("splits a simple pair", () => {
    expect(splitLightDark("light-dark(var(--uchu-yang), var(--uchu-yin))")).toEqual({
      light: "var(--uchu-yang)",
      dark: "var(--uchu-yin)",
    });
  });

  it("ignores commas nested inside functions", () => {
    expect(
      splitLightDark("light-dark(oklch(95% 0.07 92.39), oklch(var(--uchu-yang-raw) / 10%))"),
    ).toEqual({
      light: "oklch(95% 0.07 92.39)",
      dark: "oklch(var(--uchu-yang-raw) / 10%)",
    });
  });

  it("returns null for non-light-dark values", () => {
    expect(splitLightDark("var(--uchu-orange-5)")).toBeNull();
    expect(splitLightDark("0.875rem")).toBeNull();
  });
});

describe("filterByPrefix", () => {
  it("keeps only matching names", () => {
    const declarations = parseCustomProperties("--fs-sm: 1rem; --c-bg: red; --fs-lg: 2rem;");
    expect(filterByPrefix(declarations, "--fs-")).toEqual([
      { name: "--fs-sm", value: "1rem" },
      { name: "--fs-lg", value: "2rem" },
    ]);
  });
});
