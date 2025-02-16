import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { Waitlist } from "#/app/(auth)/_ui";
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
        name: "Waitlist",
        item: `${siteConfig.url}/waitlist`,
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
  title: "Waitlist",
  description: "Waitlist page of Keisuke Hayashi.",
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    url: "/waitlist",
  },
} satisfies Metadata;

const Page = () => (
  <>
    <JsonLd />
    <div className="flex justify-center *:font-sans">
      <Waitlist />
    </div>
  </>
);

export default Page;
