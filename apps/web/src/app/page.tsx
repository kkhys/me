import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
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

const tags = fisherYatesShuffle(tagCloudItems);

const Page = () => (
  <FadeInStagger faster>
    <FadeIn>
      <h1 className="font-sans font-medium">Keisuke Hayashi</h1>
    </FadeIn>
    <Prose className="font-sans">
      <FadeIn>
        <p>
          Passion for hacking. Full-stack developer based in Tokyo. Love to make
          something and make people happy and surprised.
        </p>
      </FadeIn>
      <FadeIn>
        <p>
          I keep a blog to document my interests and my life. If you are
          interested, please take a look. Currently, only Japanese articles are
          available.
        </p>
      </FadeIn>
      <FadeIn>
        <Link href="/posts" className="inline-flex items-center">
          Read blog
          <MoveRightIcon className="ml-1 size-3.5" />
        </Link>
      </FadeIn>
    </Prose>
    <div className="mt-6 space-y-6">
      <FadeIn>
        <Separator />
      </FadeIn>
      <div className="space-y-6">
        <FadeIn>
          <h2 className="font-sans font-medium">Popular posts</h2>
        </FadeIn>
        <FadeIn>
          <Suspense fallback={<PopularPostsSkeleton />}>
            <PopularPosts />
          </Suspense>
        </FadeIn>
      </div>
      <FadeIn>
        <Separator />
      </FadeIn>
      <div className="space-y-6">
        <FadeIn>
          <h2 className="font-sans font-medium">Tag cloud</h2>
        </FadeIn>
        {/*<FadeIn>*/}
        <TagCloud tags={tags} />
        {/*</FadeIn>*/}
      </div>
    </div>
  </FadeInStagger>
);

export default Page;
