import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { LgtmImage } from "#/components/lgtm-image";

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");

  return lgtmEntries.map((entry) => ({
    params: { id: entry.id },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  const lgtmEntries = await getCollection("lgtm");
  const entry = lgtmEntries.find((e) => e.id === id);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const lgtmImageBuffer = await LgtmImage(entry, 1200, "png");

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
