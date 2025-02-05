import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { siteConfig } from "#/config";
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
  <>
    <JsonLd />
    <h1 className="font-sans font-medium">Photo</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
      {getPublicPhotos().map(
        ({ _id, slug, path, imageObject: { width, height, blurDataURL } }) => (
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
        ),
      )}
    </div>
  </>
);

export default Page;
