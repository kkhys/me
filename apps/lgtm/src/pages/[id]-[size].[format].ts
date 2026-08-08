import { getCollection } from "astro:content";
import type { APIRoute, InferGetStaticPropsType } from "astro";
import { CONTENT_TYPES, formatForEntry, LgtmImage } from "#/components/lgtm-image";

const SIZES = [400, 1000, 1200] as const;

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.flatMap((entry) =>
    SIZES.map((size) => ({
      params: { id: entry.id, size: String(size), format: formatForEntry(entry) },
      props: { entry, size },
    })),
  );
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const { entry, size } = props;

  const image = await LgtmImage(entry, size);

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": CONTENT_TYPES[formatForEntry(entry)],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
