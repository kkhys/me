import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { GithubMetrics } from "#/app/about/_ui/metrics/github-metrics";
import { WakatimeMetrics } from "#/app/about/_ui/metrics/wakatime-metrics";
import { siteConfig } from "#/config/site";

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
    <FadeInStagger>
      <FadeIn>
        <header>
          <h1 className="font-sans font-medium">About</h1>
        </header>
      </FadeIn>
      <FadeIn className="mt-6 space-y-6">
        <h2 className="font-sans font-medium">This Week I Spent My Time On</h2>
        <WakatimeMetrics />
        <h2 className="font-sans font-medium">Commits Analysis</h2>
        <GithubMetrics />
      </FadeIn>
    </FadeInStagger>
  </>
);

export default Page;
