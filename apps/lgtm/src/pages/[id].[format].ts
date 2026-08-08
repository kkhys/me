import { getCollection } from "astro:content";
import type { APIRoute, InferGetStaticPropsType } from "astro";
import { CONTENT_TYPES, formatForEntry, LgtmImage } from "#/components/lgtm-image";

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.map((entry) => ({
    params: { id: entry.id, format: formatForEntry(entry) },
    props: { entry },
  }));
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const { entry } = props;

  const image = await LgtmImage(entry, 800);

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": CONTENT_TYPES[formatForEntry(entry)],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
