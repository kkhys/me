import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { ContactForm } from "#/app/contact/_ui";
import { siteConfig } from "#/config";

const JsonLd = () => {
  const jsonLdBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${siteConfig.url}/contact`,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([jsonLdBreadcrumbList]),
      }}
    />
  );
};

export const metadata = {
  title: "Contact",
  description: "Contact page of Keisuke Hayashi.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "/contact",
  },
} satisfies Metadata;

const Page = () => (
  <>
    <JsonLd />
    <header>
      <h1 className="font-sans font-medium">Contact</h1>
    </header>
    <ContactForm className="mt-6" />
  </>
);

export default Page;
