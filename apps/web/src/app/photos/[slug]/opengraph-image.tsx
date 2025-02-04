import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPhotoBySlug } from "#/utils/photo";

export const size = {
  width: 1200,
  height: 630,
};

export const generateImageMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);

  if (!photo) {
    return [];
  }

  return [
    {
      id: "default",
      contentType: "image/png",
      alt: photo.title,
      size,
    },
  ];
};

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);

  if (!photo) {
    return new Response("Not found", { status: 404 });
  }

  const { title, path } = photo;

  const imageData = await readFile(join(process.cwd(), "public", path));
  const imageSrc = Uint8Array.from(imageData).buffer;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* @ts-expect-error */}
      <img src={imageSrc} alt={title} />
    </div>,
  );
};

export default Image;
