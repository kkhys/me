import { Prose } from "@kkhys/ui/prose";
import { Separator } from "@kkhys/ui/separator";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Suspense } from "react";
import {
  PopularPosts,
  PopularPostsSkeleton,
} from "#/app/posts/_ui/popular-posts";
import { TagCloud } from "#/app/posts/_ui/tag-cloud";
import { tagCloudItems } from "#/share/tag-cloud-items";
import { fisherYatesShuffle } from "#/utils/post";

const Page = () => {
  const tags = fisherYatesShuffle(tagCloudItems);

  return (
    <>
      <h1 className="font-sans font-medium">Keisuke Hayashi</h1>
      <Prose className="font-sans">
        <p>
          Passion for hacking. Full-stack developer based in Tokyo. Love to make
          something and make people happy and surprised.
        </p>
        <p>
          I keep a blog to document my interests and my life. If you are
          interested, please take a look. Currently, only Japanese articles are
          available.
        </p>
        <Link href="/posts" className="inline-flex items-center">
          Read blog
          <MoveRightIcon className="ml-1 size-3.5" />
        </Link>
      </Prose>
      <div className="mt-6 space-y-6">
        <Separator />
        <div className="space-y-6">
          <h2 className="font-sans font-medium">Popular posts</h2>
          <Suspense fallback={<PopularPostsSkeleton />}>
            <PopularPosts />
          </Suspense>
        </div>
        <Separator />
        <div className="space-y-6">
          <h2 className="font-sans font-medium">Tag cloud</h2>
          <TagCloud tags={tags} />
        </div>
      </div>
    </>
  );
};

export default Page;
