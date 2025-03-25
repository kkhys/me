import { Prose } from "@kkhys/ui/prose";
import type { Metadata } from "next";

export const metadata = {
  robots: "noindex",
  title: "Maintenance",
  description:
    "It will be back up in a while, so please have a cup of coffee and relax.",
} satisfies Metadata;

const Page = () => (
  <>
    <h1 className="font-sans font-medium">The website under maintenance</h1>
    <Prose className="font-sans">
      <p>
        It will be back up in a while, so please have a cup of coffee and relax.
      </p>
    </Prose>
  </>
);

export default Page;
