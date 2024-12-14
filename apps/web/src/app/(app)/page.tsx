import { Prose } from "@kkhys/ui";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const Page = () => {
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
          <MoveRight className="ml-1 size-3.5" />
        </Link>
      </Prose>
    </>
  );
};

export default Page;
