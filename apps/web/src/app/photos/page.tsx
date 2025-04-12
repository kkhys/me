import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { BreadcrumbList, WithContext } from "schema-dts";
import type { ImageObject } from "#/app/photos/_types";
import { siteConfig } from "#/config/site";
import { getPhotoTitle, getPublicPhotos } from "#/utils/photo";

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
        name: "Photo",
        item: `${siteConfig.url}/photos`,
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
  title: "Photo",
  description: "Photos of Keisuke Hayashi.",
  alternates: {
    canonical: "/photos",
  },
  openGraph: {
    url: "/photos",
  },
} satisfies Metadata;

const Page = () => (
  <FadeInStagger>
    <JsonLd />
    <FadeIn>
      <h1 className="font-sans font-medium">Photo</h1>
    </FadeIn>
    <FadeIn className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
      {getPublicPhotos().map(({ _id, slug, path, imageObject }) => {
        const { width, height, blurDataURL } = imageObject as ImageObject;
        return (
          <Link key={_id} href={`/photos/${slug}` as Route}>
            <div className="overflow-hidden">
              <Image
                src={path}
                width={width}
                height={height}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                alt={getPhotoTitle(slug)}
                placeholder="blur"
                blurDataURL={blurDataURL}
                quality={90}
                className="transition-all hover:scale-105"
              />
            </div>
          </Link>
        );
      })}
    </FadeIn>
  </FadeInStagger>
);

export default Page;
