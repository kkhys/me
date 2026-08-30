import { getCollection } from "astro:content";
import { createOgResponse } from "@kkhys/og/handlers";
import type { InferGetStaticPropsType } from "astro";
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

export const GET = createOgResponse<Props>(async ({ props }) => {
  const lgtmImageBuffer = await LgtmImage(props.entry, 1200);

  return sharp(lgtmImageBuffer)
    .resize(1200, 630, {
      fit: "cover",
      position: "center",
    })
    .png()
    .toBuffer();
});
