import { afterEach, describe, expect, it, vi } from "vitest";
import { loadPagefind } from "../loader";

/* A `/pagefind/pagefind.js` stand-in: `import()` of a data URL runs the
   module source, so each test writes the module it wants loaded. */
const moduleUrl = (source: string) =>
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`;

const counting = `
  export const calls = { options: [], init: 0 };
  export const options = async (o) => { calls.options.push(o); };
  export const init = async () => { calls.init += 1; };
  export const search = async () => ({ results: [] });
  export const debouncedSearch = async () => null;
`;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadPagefind", () => {
  it("imports, configures and initialises the bundle once per path", async () => {
    const bundlePath = `${moduleUrl(counting)}#`;
    const url = `${bundlePath}pagefind.js`;

    const first = loadPagefind(bundlePath, { excerptLength: 24 });
    const second = loadPagefind(bundlePath, { excerptLength: 99 });
    const pagefind = await first;

    expect(second).toBe(first);
    expect(await second).toBe(pagefind);
    const calls = (pagefind as unknown as { calls: { options: unknown[]; init: number } }).calls;
    expect(calls.init).toBe(1);
    expect(calls.options).toEqual([{ excerptLength: 24 }]);
    expect(url.endsWith("pagefind.js")).toBe(true);
  });

  it("keeps a rejected load, as the module map would", async () => {
    const bundlePath = `${moduleUrl("throw new Error('no index')")}#`;

    const first = loadPagefind(bundlePath);
    await expect(first).rejects.toThrow("no index");
    expect(loadPagefind(bundlePath)).toBe(first);
  });
});
