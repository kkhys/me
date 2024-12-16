import { Prose } from "@kkhys/ui";
import type { Metadata } from "next";

export const metadata = {
  robots: "noindex",
  title: "Forbidden",
  description: "You have been denied access for some reason.",
} satisfies Metadata;

const Page = async () => (
  <>
    <h1 className="font-sans font-medium">403 - Forbidden</h1>
    <Prose className="font-sans">
      <p>You have been denied access for some reason.</p>
    </Prose>
  </>
);

export default Page;
