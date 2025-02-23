import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { getMastodonDate, getWakaTimeData } from "#/app/about/_lib";
import { siteConfig } from "#/config";

const JsonLd = () => {
  const jsonLdBreadcrumb = {
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
        name: "About",
        item: `${siteConfig.url}/about`,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdBreadcrumb),
      }}
    />
  );
};

export const metadata = {
  title: "About",
  description: "About me.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    url: "/about",
  },
} satisfies Metadata;

const Page = async () => {
  await Promise.all([getWakaTimeData(), getMastodonDate()]).then(
    ([wakaTimeData, mastodonData]) => {
      console.dir(wakaTimeData);
      console.dir(mastodonData);
    },
  );

  return (
    <>
      <JsonLd />
      <header>
        <h1 className="font-sans font-medium">About</h1>
      </header>
      <div className="mt-6">
        <p>WIP</p>
      </div>
    </>
  );
};

export default Page;
