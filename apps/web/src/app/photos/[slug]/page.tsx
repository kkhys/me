import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@kkhys/ui";
import Image from "next/image";
import { notFound } from "next/navigation";
import Zoom from "react-medium-image-zoom";
import { type Camera, type Lens, siteConfig } from "#/config";
import { getPhotoBySlug, getPublicPhotos } from "#/utils/photo";
import "#/styles/react-medium-image-zoom.css";
import "../_styles/index.css";
import type { Photo } from "contentlayer/generated";
import * as React from "react";
import type { BreadcrumbList, WithContext } from "schema-dts";

const JsonLd = ({ photo: { title, slug } }: { photo: Photo }) => {
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
        name: "Photo",
        item: `${siteConfig.url}/photos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteConfig.url}/photos/${slug}`,
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

export const generateStaticParams = async () =>
  getPublicPhotos().map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);

  if (!photo) {
    return;
  }

  const { title, publishedAt, updatedAt } = photo;
  const url = `/photos/${slug}`;

  return {
    title,
    description: "The photo was taken by Keisuke Hayashi.",
    alternates: {
      canonical: `/photos/${slug}`,
    },
    openGraph: {
      type: "article",
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
    },
  };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const photo = getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  const {
    title,
    path,
    fNumber,
    focalLength,
    shutterSpeed,
    iso,
    publishedAtFormattedIso,
    imageObject: { width, height, blurDataURL },
  } = photo;

  const cameraData = photo.cameraData as Camera;
  const lensData = photo.lensData as Lens;

  return (
    <>
      <JsonLd photo={photo} />
      <div className="space-y-6">
        <Zoom zoomImg={{ src: path }}>
          <Image
            src={path}
            width={width}
            height={height}
            sizes="100vw"
            alt={title}
            placeholder="blur"
            blurDataURL={blurDataURL}
            quality={90}
          />
        </Zoom>
        <h1 className="font-sans font-medium">{title}</h1>
        <DescriptionList className="font-sans">
          <DescriptionTerm>Camera</DescriptionTerm>
          <DescriptionDetails>
            {cameraData.name} ({cameraData.manufacturer})
          </DescriptionDetails>
          <DescriptionTerm>Lens</DescriptionTerm>
          <DescriptionDetails>
            {lensData.name} ({lensData.manufacturer})
          </DescriptionDetails>
          <DescriptionTerm>F-number</DescriptionTerm>
          <DescriptionDetails>{fNumber}</DescriptionDetails>
          <DescriptionTerm>Focal length</DescriptionTerm>
          <DescriptionDetails>{focalLength}mm</DescriptionDetails>
          <DescriptionTerm>Shutter speed</DescriptionTerm>
          <DescriptionDetails>{shutterSpeed}s</DescriptionDetails>
          <DescriptionTerm>ISO</DescriptionTerm>
          <DescriptionDetails>{iso}</DescriptionDetails>
          <DescriptionTerm>Shot on</DescriptionTerm>
          <DescriptionDetails>{publishedAtFormattedIso}</DescriptionDetails>
        </DescriptionList>
      </div>
    </>
  );
};

export default Page;
