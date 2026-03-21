import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";

export type User = CollectionEntry<"users">;

const avatarModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,png,webp}",
  { eager: true },
);

const DEFAULT_AVATAR = "profile.jpg";

// Cached slug -> User map (built once per build)
let userMapPromise: Promise<Map<string, User>> | null = null;

const getUserMap = (): Promise<Map<string, User>> => {
  if (!userMapPromise) {
    userMapPromise = getCollection("users").then(
      (users) => new Map(users.map((user) => [user.data.slug, user])),
    );
  }
  return userMapPromise;
};

export const getAvatarImage = (filename: string): ImageMetadata => {
  const key = `../assets/${filename}`;
  const module = avatarModules[key];
  if (!module) {
    throw new Error(`Avatar not found: ${filename}`);
  }
  return module.default;
};

export const getAllUsers = async (): Promise<User[]> => {
  const userMap = await getUserMap();
  return Array.from(userMap.values());
};

export const getUserBySlug = async (
  slug: string,
): Promise<User | undefined> => {
  const userMap = await getUserMap();
  return userMap.get(slug);
};

export interface AuthorInfo {
  name: string;
  avatar: ImageMetadata;
  profileLink: string;
}

export const getAuthorInfo = async (
  authorSlug: string,
): Promise<AuthorInfo> => {
  const user = await getUserBySlug(authorSlug);
  return {
    name: user?.data.name ?? authorSlug,
    avatar: getAvatarImage(user?.data.avatar ?? DEFAULT_AVATAR),
    profileLink: `/@${authorSlug}`,
  };
};
