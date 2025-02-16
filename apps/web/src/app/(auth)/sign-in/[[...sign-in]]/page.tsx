import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { SignIn } from "#/app/(auth)/_ui";
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
        name: "Sign In",
        item: `${siteConfig.url}/sign-in`,
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
  title: "Sign In",
  description: "Sign in page of Keisuke Hayashi.",
  alternates: {
    canonical: "/sign-in",
  },
  openGraph: {
    url: "/sign-in",
  },
} satisfies Metadata;

const Page = () => (
  <>
    <JsonLd />
    <div className="flex justify-center *:font-sans">
      <SignIn />
    </div>
  </>
);

export default Page;
