import type { CollectionEntry } from "astro:content";

export const mockMemos: CollectionEntry<"memo">[] = [
  {
    id: "memo-1.md",
    body: "This is memo 1",
    collection: "memo",
    data: {
      id: "memo-1",
      isDraft: false,
      createdAt: new Date("2025-01-01T00:00:00Z"),
      author: "Keisuke Hayashi",
      hideLinkCard: false,
      tag: "tech",
    },
  },
  {
    id: "memo-2.md",
    body: "This is memo 2",
    collection: "memo",
    data: {
      id: "memo-2",
      isDraft: false,
      createdAt: new Date("2025-11-20T00:00:00Z"),
      author: "Keisuke Hayashi",
      hideLinkCard: false,
      tag: "life",
    },
  },
  {
    id: "memo-3.md",
    body: "This is memo 3",
    collection: "memo",
    data: {
      id: "memo-3",
      isDraft: true,
      createdAt: new Date("2025-11-22T00:00:00Z"),
      author: "Keisuke Hayashi",
      hideLinkCard: false,
      tag: "tech",
    },
  },
  {
    id: "memo-4.md",
    body: "This is memo 4",
    collection: "memo",
    data: {
      id: "memo-4",
      isDraft: false,
      createdAt: new Date("2025-11-24T00:00:00Z"),
      author: "Keisuke Hayashi",
      hideLinkCard: false,
      tag: "work",
    },
  },
  {
    id: "memo-5.md",
    body: "",
    collection: "memo",
    data: {
      id: "memo-5",
      isDraft: false,
      createdAt: new Date("2025-11-25T00:00:00Z"),
      author: "Keisuke Hayashi",
      hideLinkCard: false,
    },
  },
];
