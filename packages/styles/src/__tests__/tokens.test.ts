import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { uchuHex } from "../colors";

const read = (file: string) => readFile(new URL(`../../${file}`, import.meta.url), "utf8");

const definedVars = (css: string) =>
  new Set([...css.matchAll(/^\s*(--[\w-]+):/gmu)].map((m) => m[1]));

const referencedVars = (css: string) =>
  new Set([...css.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]));

// Every stylesheet an app can import; each may only reference the primitive
// palette or the semantic tokens, never a token an app happens to declare.
const STYLESHEETS = ["tokens.css", "base.css", "components.css"];

describe("token reference integrity", () => {
  it.each(STYLESHEETS)("resolves every var() in %s from uchu.css or tokens.css", async (file) => {
    const [uchu, tokens, stylesheet] = await Promise.all([
      read("uchu.css"),
      read("tokens.css"),
      read(file),
    ]);
    const defined = new Set([...definedVars(uchu), ...definedVars(tokens)]);
    for (const name of referencedVars(stylesheet)) {
      expect(defined, `undefined token in ${file}: ${name}`).toContain(name);
    }
  });
});

describe("uchuHex", () => {
  it("mirrors only colors that exist in uchu.css", async () => {
    const uchu = await read("uchu.css");
    const defined = definedVars(uchu);
    for (const key of Object.keys(uchuHex)) {
      expect(defined, `no --uchu-${key} in uchu.css`).toContain(`--uchu-${key}`);
    }
  });

  it("holds valid hex colors", () => {
    for (const value of Object.values(uchuHex)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/u);
    }
  });
});
