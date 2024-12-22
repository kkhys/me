import { ImageResponse } from "next/og";
import { getPostBySlug } from "#/utils/post";

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
  const post = getPostBySlug(slug);

  if (!post) {
    return [];
  }

  return [
    {
      id: "default",
      contentType: "image/png",
      alt: post.title,
      size,
    },
  ];
};

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const firstEmoji = Array.from(post.emoji)[0];

  const notoEmojiSemiBold = await fetch(
    new URL(
      "../../../../../assets/fonts/NotoEmoji-SemiBold.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        fontSize: 250,
        background: "#0a0a0b",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Noto Emoji",
        color: "#e4e4e7",
      }}
    >
      {firstEmoji}
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Noto Emoji",
          data: notoEmojiSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
};

export default Image;
