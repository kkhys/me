import { allPhotos } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { env } from "#/env";
import { photoMetadata } from "#/share/photo-metadata";

export const getPublicPhotos = () =>
  allPhotos
    .filter(
      ({ status }) => env.NODE_ENV === "development" || status === "published",
    )
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    );

export const getPhotoBySlug = (slug: string) =>
  allPhotos.find(
    (photo) =>
      (env.NODE_ENV === "development" || photo.status === "published") &&
      photo.slug === slug,
  );

export const getPhotoTitle = (slug: string) =>
  photoMetadata.find((photo) => photo.slug === slug)?.title || "No title";
