import type { CollectionEntry } from "astro:content";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const mockUsers: CollectionEntry<"users">[] = [
  {
    id: "kkhys",
    collection: "users",
    data: {
      slug: "kkhys",
      name: "Keisuke Hayashi",
      bio: "",
      avatar: "profile.jpg",
      links: [],
    },
  },
  {
    id: "testuser",
    collection: "users",
    data: {
      slug: "testuser",
      name: "Test User",
      bio: "Hello",
      avatar: "profile.jpg",
      links: [],
    },
  },
];

describe("getAllUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/user");
  });

  test("should return all users", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAllUsers } = await import("#/utils/user");
    const result = await getAllUsers();

    expect(result).toHaveLength(2);
  });

  test("should handle empty collection", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue([]);

    const { getAllUsers } = await import("#/utils/user");
    const result = await getAllUsers();

    expect(result).toHaveLength(0);
  });
});

describe("getUserBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/user");
  });

  test("should return user by slug", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getUserBySlug } = await import("#/utils/user");
    const result = await getUserBySlug("kkhys");

    expect(result).toBeDefined();
    expect(result?.data.name).toBe("Keisuke Hayashi");
    expect(result?.data.slug).toBe("kkhys");
  });

  test("should return undefined for unknown slug", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getUserBySlug } = await import("#/utils/user");
    const result = await getUserBySlug("nonexistent");

    expect(result).toBeUndefined();
  });

  test("should cache getCollection call across multiple lookups", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getUserBySlug } = await import("#/utils/user");
    await getUserBySlug("kkhys");
    await getUserBySlug("testuser");
    await getUserBySlug("nonexistent");

    expect(getCollection).toHaveBeenCalledTimes(1);
  });
});

describe("getAuthorInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doUnmock("#/utils/user");
  });

  test("should return display name and profile link for known user", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAuthorInfo } = await import("#/utils/user");
    const result = await getAuthorInfo("kkhys");

    expect(result.name).toBe("Keisuke Hayashi");
    expect(result.profileLink).toBe("/@kkhys");
    expect(result.avatar).toBeTruthy();
  });

  test("should fallback to slug as name for unknown user", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAuthorInfo } = await import("#/utils/user");
    const result = await getAuthorInfo("unknown");

    expect(result.name).toBe("unknown");
    expect(result.profileLink).toBe("/@unknown");
    // Falls back to default avatar (profile.jpg)
    expect(result.avatar).toBeTruthy();
  });

  test("should return correct info for different users", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAuthorInfo } = await import("#/utils/user");
    const kkhys = await getAuthorInfo("kkhys");
    const testuser = await getAuthorInfo("testuser");

    expect(kkhys.name).toBe("Keisuke Hayashi");
    expect(testuser.name).toBe("Test User");
    expect(kkhys.profileLink).toBe("/@kkhys");
    expect(testuser.profileLink).toBe("/@testuser");
  });
});

describe("getAvatarImage", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock("#/utils/user");
  });

  test("should return avatar for existing file", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAvatarImage } = await import("#/utils/user");
    const result = getAvatarImage("profile.jpg");

    expect(result).toBeTruthy();
  });

  test("should throw for missing avatar file", async () => {
    const { getCollection } = await import("astro:content");
    vi.mocked(getCollection).mockResolvedValue(mockUsers);

    const { getAvatarImage } = await import("#/utils/user");

    expect(() => getAvatarImage("nonexistent.jpg")).toThrow(
      "Avatar not found: nonexistent.jpg",
    );
  });
});
