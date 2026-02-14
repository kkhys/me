/**
 * Factory functions for in-memory caching of async data.
 */

/** Cache that stores the Promise itself (deduplicates concurrent requests). */
export const createCache = <T>() => {
  const store = new Map<string, Promise<T>>();
  return (key: string, fetcher: () => Promise<T>): Promise<T> => {
    const cached = store.get(key);
    if (cached) return cached;
    const promise = fetcher();
    store.set(key, promise);
    return promise;
  };
};

/** Cache that stores resolved values (awaits before caching). */
export const createResolvedCache = <T>() => {
  const store = new Map<string, T>();
  return async (key: string, fetcher: () => Promise<T>): Promise<T> => {
    const cached = store.get(key);
    if (cached) return cached;
    const value = await fetcher();
    store.set(key, value);
    return value;
  };
};
