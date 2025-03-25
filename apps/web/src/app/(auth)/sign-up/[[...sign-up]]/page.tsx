import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { SignUp } from "#/app/(auth)/_ui/sign-up";
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
        name: "Sign Up",
        item: `${siteConfig.url}/sign-up`,
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
  title: "Sign Up",
  description: "Sign up page of Keisuke Hayashi.",
  alternates: {
    canonical: "/sign-up",
  },
  openGraph: {
    url: "/sign-up",
  },
} satisfies Metadata;

const Page = () => (
  <>
    <JsonLd />
    <div className="flex justify-center *:font-sans">
      <SignUp />
    </div>
  </>
);

export default Page;
