import type { PagefindIndexOptions, PagefindModule } from "./types";

const loaded = new Map<string, Promise<PagefindModule>>();

/**
 * Imports and initialises the Pagefind bundle at `${bundlePath}pagefind.js`
 * once per page. `pagefind.init()` is not idempotent (it reloads the entry,
 * the metadata and the WASM every time), so every consumer on a page — the
 * search dialog and trends' AI dialog — shares one load through this map.
 *
 * The promise is cached even when it rejects: a failed module fetch is
 * recorded in the browser's module map, so re-importing the same URL fails
 * identically without a page reload.
 */
export const loadPagefind = (
  bundlePath: string,
  options: PagefindIndexOptions = {},
): Promise<PagefindModule> => {
  const url = `${bundlePath}pagefind.js`;
  let promise = loaded.get(url);
  if (promise === undefined) {
    promise = (async () => {
      const pagefind = (await import(
        /* @vite-ignore */
        url
      )) as PagefindModule;
      await pagefind.options(options);
      await pagefind.init();
      return pagefind;
    })();
    loaded.set(url, promise);
  }
  return promise;
};
