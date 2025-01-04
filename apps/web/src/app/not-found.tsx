import type { Metadata } from "next";
import Link from "next/link";

import { Button, Prose } from "@kkhys/ui";

export const metadata = {
  robots: "noindex",
  title: "Not Found",
  description: "Sorry, but the page you were trying to view does not exist.",
} satisfies Metadata;

const NotFound = () => (
  <>
    <h1 className="font-sans font-medium">404 - Page Not Found</h1>
    <Prose className="font-sans">
      <p>Sorry, but the page you were trying to view does not exist.</p>
    </Prose>
    <Button variant="outline" className="font-sans" asChild>
      <Link href="/">Go back home</Link>
    </Button>
  </>
);

export default NotFound;
