import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { LgtmImage } from "#/components/lgtm/lgtm-image";

type ImageFormat = "png" | "avif" | "webp";

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");
  const formats: ImageFormat[] = ["png", "avif", "webp"];

  return lgtmEntries.flatMap((entry) =>
    formats.map((format) => ({
      params: { id: entry.id, format },
    })),
  );
};

export const GET: APIRoute = async ({ params }) => {
  const { id, format } = params;

  const validFormats: ImageFormat[] = ["png", "avif", "webp"];
  const imageFormat = validFormats.includes(format as ImageFormat)
    ? (format as ImageFormat)
    : "png";

  const lgtmEntries = await getCollection("lgtm");
  const entry = lgtmEntries.find((e) => e.id === id);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const image = await LgtmImage(entry, 400, imageFormat);

  const contentTypes = {
    png: "image/png",
    avif: "image/avif",
    webp: "image/webp",
  };

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": contentTypes[imageFormat],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
