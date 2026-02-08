import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getIconCode", () => {
  let getIconCode: (char: string) => string;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("#/lib/api/emoji");
    getIconCode = mod.getIconCode;
  });

  it("converts ASCII character to code point", () => {
    expect(getIconCode("A")).toBe("41");
  });

  it("handles surrogate pairs", () => {
    // U+1F600 (grinning face)
    const result = getIconCode("\uD83D\uDE00");
    expect(result).toBe("1f600");
  });

  it("handles ZWJ sequences (keeps U+200D)", () => {
    // Family emoji: U+1F468 U+200D U+1F469 U+200D U+1F467
    const zwj = String.fromCharCode(8205);
    const emoji = `\uD83D\uDC68${zwj}\uD83D\uDC69${zwj}\uD83D\uDC67`;
    const result = getIconCode(emoji);
    expect(result).toContain("200d");
  });

  it("removes Variation Selector FE0F when no ZWJ", () => {
    // Heart emoji with FE0F: U+2764 U+FE0F
    const result = getIconCode("\u2764\uFE0F");
    expect(result).toBe("2764");
    expect(result).not.toContain("fe0f");
  });
});

describe("loadEmoji", () => {
  let loadEmoji: (type: any, code: string) => Promise<string>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        text: () => Promise.resolve("<svg>mock</svg>"),
      }),
    );
    const mod = await import("#/lib/api/emoji");
    loadEmoji = mod.loadEmoji;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches twemoji with correct URL", async () => {
    await loadEmoji("twemoji", "1f600");

    expect(fetch).toHaveBeenCalledWith(
      "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f600.svg",
    );
  });

  it("fetches openmoji with uppercase code", async () => {
    await loadEmoji("openmoji", "1f600");

    expect(fetch).toHaveBeenCalledWith(
      "https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/1F600.svg",
    );
  });

  it("caches results (fetch called once for same key)", async () => {
    await loadEmoji("twemoji", "1f600");
    await loadEmoji("twemoji", "1f600");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns SVG text", async () => {
    const result = await loadEmoji("twemoji", "1f600");
    expect(result).toBe("<svg>mock</svg>");
  });

  it("fetches fluent with correct URL", async () => {
    await loadEmoji("fluent", "1f600");

    expect(fetch).toHaveBeenCalledWith(
      "https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/1f600_color.svg",
    );
  });

  it("fetches fluentFlat with correct URL", async () => {
    await loadEmoji("fluentFlat", "1f600");

    expect(fetch).toHaveBeenCalledWith(
      "https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/1f600_flat.svg",
    );
  });

  it("falls back to twemoji for invalid type", async () => {
    await loadEmoji("invalidType" as any, "1f600");

    expect(fetch).toHaveBeenCalledWith(
      "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f600.svg",
    );
  });
});
