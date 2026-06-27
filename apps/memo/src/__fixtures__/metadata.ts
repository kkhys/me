import type { Metadata } from "fetch-site-metadata";

export const mockMetadata: Metadata = {
  title: "Example Site",
  description: "This is an example",
  image: {
    src: "https://example.com/image.jpg",
    width: undefined,
    height: undefined,
    alt: undefined,
  },
  icon: "https://example.com/favicon.ico",
};

export const mockMetadataMinimal: Metadata = {
  title: "Site Title",
  description: "Site Description",
  image: undefined,
  icon: undefined,
};

export const fallbackMetadata: Metadata = {
  title: "Link",
  description: "External link",
  image: undefined,
  icon: undefined,
};

export const errorFallbackMetadata: Metadata = {
  title: "Not Found",
  description: "Page not found",
  image: undefined,
  icon: undefined,
};
