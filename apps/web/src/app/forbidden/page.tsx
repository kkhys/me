import { Prose } from "@kkhys/ui";
import type { Metadata } from "next";
import { Container } from "#/ui";

export const metadata = {
  robots: "noindex",
  title: "Forbidden",
  description: "You have been denied access for some reason.",
} satisfies Metadata;

const Page = () => (
  <Container>
    <h1 className="font-sans font-medium">403 - Forbidden</h1>
    <Prose className="font-sans">
      <p>You have been denied access for some reason.</p>
    </Prose>
  </Container>
);

export default Page;
