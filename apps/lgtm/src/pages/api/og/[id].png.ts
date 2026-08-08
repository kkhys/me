import { getCollection } from "astro:content";
import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { LgtmImage } from "#/components/lgtm-image";

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props }) => {
  const { entry } = props;

  const lgtmImageBuffer = await LgtmImage(entry, 1200);

  const image = await sharp(lgtmImageBuffer)
    .resize(1200, 630, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
