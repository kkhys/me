import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { formatForEntry, LgtmImage } from "#/components/lgtm-image";

const CONTENT_TYPES = {
  avif: "image/avif",
  webp: "image/webp",
} as const;

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.map((entry) => ({
    params: { id: entry.id, format: formatForEntry(entry) },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as Awaited<
    ReturnType<typeof getStaticPaths>
  >[number]["props"];

  const image = await LgtmImage(entry, 800);

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": CONTENT_TYPES[formatForEntry(entry)],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
