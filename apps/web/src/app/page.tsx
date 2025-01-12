import { Prose, Separator } from "@kkhys/ui";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { TagCloud } from "#/app/posts/_ui";

const Page = () => (
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
    <Separator className="my-6" />
    <h2 className="font-sans font-medium">Tag cloud</h2>
    <TagCloud className="mt-6" />
  </>
);

export default Page;
