import { beforeEach, describe, expect, it, vi } from "vitest";

type Entry = {
  id: string;
  collection: "blog";
  digest?: string;
  data: {
    title: string;
    emoji: string;
    category: string;
    tags?: string[];
    status: "published" | "draft";
    publishedAt: Date;
  };
};

const createEntry = (
  id: string,
  overrides: Partial<Entry["data"]> & { digest?: string | undefined } = {},
): Entry => {
  const { digest, ...data } = overrides;
  return {
    id,
    collection: "blog",
    ...(digest !== undefined && { digest }),
    data: {
      title: `title-${id}`,
      emoji: "📝",
      category: "Tech",
      status: "published",
      publishedAt: new Date("2025-01-01"),
      ...data,
    },
  };
};

const loadModule = () => {
  vi.doMock("astro:env/client", () => ({ NODE_ENV: "production" }));
  vi.doMock("astro:content", () => ({ getCollection: vi.fn<() => Promise<never[]>>() }));
  return import("#/features/blog/utils/cache-key");
};

// The helpers take `CollectionEntry<"blog">`; the mock entries cover every
// field they read, so the cast only bridges the generated content types.
const asEntries = (entries: Entry[]) =>
  entries as unknown as Parameters<Awaited<ReturnType<typeof loadModule>>["getPostCacheKey"]>[0];

describe("toCacheKey", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("is stable for equal input and distinct for different input", async () => {
    const { toCacheKey } = await loadModule();

    expect(toCacheKey({ a: 1, b: [new Date("2025-01-01")] })).toBe(
      toCacheKey({ a: 1, b: [new Date("2025-01-01")] }),
    );
    expect(toCacheKey({ a: 1 })).not.toBe(toCacheKey({ a: 2 }));
    expect(toCacheKey({ a: 1 })).toMatch(/^[0-9a-f]{16}$/u);
  });
});

describe("withCacheKey", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("keys each path on its props and keeps params and props intact", async () => {
    const { toCacheKey, withCacheKey } = await loadModule();
    const paths = [
      { params: { page: undefined }, props: { page: { data: ["a"], currentPage: 1 } } },
      { params: { page: "2" }, props: { page: { data: ["b"], currentPage: 2 } } },
    ];

    const keyed = withCacheKey(paths);

    expect(keyed).toHaveLength(2);
    expect(keyed[0]).toEqual({ ...paths[0], cacheKey: toCacheKey(paths[0]?.props) });
    expect(keyed[1]).toEqual({ ...paths[1], cacheKey: toCacheKey(paths[1]?.props) });
    expect(keyed[0]?.cacheKey).not.toBe(keyed[1]?.cacheKey);
  });
});

describe("getPostCacheKey", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const target = createEntry("target", { digest: "d-target", tags: ["React"] });
  const sibling = createEntry("sibling", { digest: "d-sibling", tags: ["React"] });
  const unrelated = createEntry("unrelated", { digest: "d-unrelated", category: "Life" });
  const nav = { id: "sibling", title: "title-sibling", emoji: "📝" };

  it("returns undefined when the entry has no digest", async () => {
    const { getPostCacheKey } = await loadModule();
    const noDigest = createEntry("no-digest");

    expect(
      getPostCacheKey(asEntries([noDigest]), asEntries([noDigest])[0]!, undefined, undefined),
    ).toBeUndefined();
  });

  it("is deterministic across calls", async () => {
    const { getPostCacheKey } = await loadModule();
    const entries = asEntries([target, sibling, unrelated]);

    expect(getPostCacheKey(entries, entries[0]!, nav, undefined)).toBe(
      getPostCacheKey(entries, entries[0]!, nav, undefined),
    );
  });

  it("changes when the entry body, a nav item, or a related post's displayed data changes", async () => {
    const { getPostCacheKey } = await loadModule();
    const entries = asEntries([target, sibling, unrelated]);
    const base = getPostCacheKey(entries, entries[0]!, nav, undefined);

    const edited = asEntries([
      createEntry("target", { digest: "d-target-2", tags: ["React"] }),
      sibling,
      unrelated,
    ]);
    expect(getPostCacheKey(edited, edited[0]!, nav, undefined)).not.toBe(base);

    expect(getPostCacheKey(entries, entries[0]!, { ...nav, title: "renamed" }, undefined)).not.toBe(
      base,
    );

    const renamedSibling = asEntries([
      target,
      createEntry("sibling", { digest: "d-sibling", tags: ["React"], title: "renamed" }),
      unrelated,
    ]);
    expect(getPostCacheKey(renamedSibling, renamedSibling[0]!, nav, undefined)).not.toBe(base);
  });

  it("changes when a new related post appears but not when an unrelated post changes", async () => {
    const { getPostCacheKey } = await loadModule();
    const entries = asEntries([target, sibling, unrelated]);
    const base = getPostCacheKey(entries, entries[0]!, nav, undefined);

    const withNewRelated = asEntries([
      target,
      sibling,
      unrelated,
      createEntry("newcomer", { digest: "d-new", tags: ["React"] }),
    ]);
    expect(getPostCacheKey(withNewRelated, withNewRelated[0]!, nav, undefined)).not.toBe(base);

    const unrelatedEdited = asEntries([
      target,
      sibling,
      createEntry("unrelated", { digest: "d-unrelated-2", category: "Life", title: "renamed" }),
    ]);
    expect(getPostCacheKey(unrelatedEdited, unrelatedEdited[0]!, nav, undefined)).toBe(base);
  });

  it("ignores body-only edits of a related post", async () => {
    const { getPostCacheKey } = await loadModule();
    const entries = asEntries([target, sibling]);
    const base = getPostCacheKey(entries, entries[0]!, nav, undefined);

    const siblingBodyEdited = asEntries([
      target,
      createEntry("sibling", { digest: "d-sibling-2", tags: ["React"] }),
    ]);
    expect(getPostCacheKey(siblingBodyEdited, siblingBodyEdited[0]!, nav, undefined)).toBe(base);
  });
});
