import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { GithubMetrics, WakatimeMetrics } from "#/app/about/_ui";
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

const Page = () => (
  <>
    <JsonLd />
    <header>
      <h1 className="font-sans font-medium">About</h1>
    </header>
    <div className="mt-6 space-y-6">
      <h2 className="font-sans font-medium">This Week I Spent My Time On</h2>
      <WakatimeMetrics />
      <h2 className="font-sans font-medium">Commits Analysis</h2>
      <GithubMetrics />
    </div>
  </>
);

export default Page;
