import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { LgtmImage } from "#/components/lgtm-image";

type ImageFormat = "png" | "avif" | "webp";
type ImageSize = "400" | "1000" | "1200";

export const getStaticPaths = async () => {
  const lgtmEntries = await getCollection("lgtm");
  const formats: ImageFormat[] = ["png", "avif", "webp"];
  const sizes: ImageSize[] = ["400", "1000", "1200"];

  return lgtmEntries.flatMap((entry) =>
    formats.flatMap((format) =>
      sizes.map((size) => ({
        params: { id: entry.id, size, format },
      })),
    ),
  );
};

export const GET: APIRoute = async ({ params }) => {
  const { id, size, format } = params;

  const validFormats: ImageFormat[] = ["png", "avif", "webp"];
  const imageFormat = validFormats.includes(format as ImageFormat)
    ? (format as ImageFormat)
    : "png";

  const validSizes: ImageSize[] = ["400", "1000", "1200"];
  const imageSize = validSizes.includes(size as ImageSize)
    ? (size as ImageSize)
    : "400";

  const lgtmEntries = await getCollection("lgtm");
  const entry = lgtmEntries.find((e) => e.id === id);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const width = Number.parseInt(imageSize, 10);
  const image = await LgtmImage(entry, width, imageFormat);

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
