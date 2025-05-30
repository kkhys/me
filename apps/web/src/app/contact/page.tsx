import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { ContactForm } from "#/app/contact/_ui/contact-form";
import { siteConfig } from "#/config/site";

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
        __html: JSON.stringify(jsonLdBreadcrumbList),
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
    <FadeInStagger>
      <FadeIn>
        <header>
          <h1 className="font-sans font-medium">Contact</h1>
        </header>
      </FadeIn>
      <FadeIn>
        <ContactForm className="mt-6" />
      </FadeIn>
    </FadeInStagger>
  </>
);

export default Page;
