import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { uchuHex } from "../colors";

const read = (file: string) => readFile(new URL(`../../${file}`, import.meta.url), "utf8");

const definedVars = (css: string) =>
  new Set([...css.matchAll(/^\s*(--[\w-]+):/gmu)].map((m) => m[1]));

const referencedVars = (css: string) =>
  new Set([...css.matchAll(/var\((--[\w-]+)/gu)].map((m) => m[1]));

describe("token reference integrity", () => {
  it("resolves every var() in tokens.css from uchu.css or tokens.css", async () => {
    const [uchu, tokens] = await Promise.all([read("uchu.css"), read("tokens.css")]);
    const defined = new Set([...definedVars(uchu), ...definedVars(tokens)]);
    for (const name of referencedVars(tokens)) {
      expect(defined, `undefined token: ${name}`).toContain(name);
    }
  });

  it("resolves every var() in base.css from uchu.css or tokens.css", async () => {
    const [uchu, tokens, base] = await Promise.all([
      read("uchu.css"),
      read("tokens.css"),
      read("base.css"),
    ]);
    const defined = new Set([...definedVars(uchu), ...definedVars(tokens)]);
    for (const name of referencedVars(base)) {
      expect(defined, `undefined token: ${name}`).toContain(name);
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
