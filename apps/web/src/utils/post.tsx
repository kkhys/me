import * as fs from "node:fs";
import * as path from "node:path";
import type { Post } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import * as React from "react";
import satori from "satori";
import { env } from "#/env";

export const getPublicPosts = (posts: Post[]): Post[] =>
  posts
    .filter(
      (post) => env.NODE_ENV === "development" || post.status === "published",
    )
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    );

export const generateEmojiSvg = async ({
  emoji,
}: {
  emoji: string;
}) => {
  const firstEmoji = Array.from(emoji)[0];

  const notoEmojiRegular = fs.readFileSync(
    path.resolve(process.cwd(), "assets/fonts/NotoEmoji-Regular.ttf"),
  );

  return await satori(
    <div
      style={{
        fontSize: 21,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Noto Emoji",
        fontSmooth: "antialiased",
      }}
    >
      {firstEmoji}
    </div>,
    {
      width: 24,
      height: 24,
      fonts: [
        {
          name: "Noto Emoji",
          data: notoEmojiRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
};
