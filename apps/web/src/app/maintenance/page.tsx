import { Prose } from "@kkhys/ui";
import type { Metadata } from "next";
import { Container } from "#/ui";

export const metadata = {
  robots: "noindex",
  title: "Maintenance",
  description:
    "It will be back up in a while, so please have a cup of coffee and relax.",
} satisfies Metadata;

const Page = () => (
  <Container>
    <h1 className="font-sans font-medium">The website under maintenance</h1>
    <Prose className="font-sans">
      <p>
        It will be back up in a while, so please have a cup of coffee and relax.
      </p>
    </Prose>
  </Container>
);

export default Page;
