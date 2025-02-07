import { ImageResponse } from "next/og";
import { env } from "#/env";
import { getPhotoBySlug, getPhotoTitle } from "#/utils/photo";

export const runtime = "edge";

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
      alt: getPhotoTitle(slug),
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

  const { path } = photo;

  const baseUrl =
    env.VERCEL_ENV === "production"
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

  const url = `${baseUrl}${path}`;

  const response = await fetch(url);

  if (!response.ok) {
    return new Response("Not found", { status: 404 });
  }

  const arrayBuffer = await response.arrayBuffer();
  const imageSrc = new Uint8Array(arrayBuffer).buffer;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* @ts-expect-error */}
      <img src={imageSrc} alt={getPhotoTitle(slug)} />
    </div>,
  );
};

export default Image;
