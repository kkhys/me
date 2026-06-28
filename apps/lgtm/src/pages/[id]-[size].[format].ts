import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { formatForEntry, LgtmImage } from "#/components/lgtm-image";

const CONTENT_TYPES = {
  avif: "image/avif",
  webp: "image/webp",
} as const;

const SIZES = ["400", "1000", "1200"] as const;
type ImageSize = (typeof SIZES)[number];

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.flatMap((entry) =>
    SIZES.map((size) => ({
      params: { id: entry.id, size, format: formatForEntry(entry) },
      props: { entry, size },
    })),
  );
};

export const GET: APIRoute = async ({ props }) => {
  const { entry, size } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]["props"];

  const width = Math.trunc(Number(size as ImageSize));
  const image = await LgtmImage(entry, width);

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": CONTENT_TYPES[formatForEntry(entry)],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
