import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@kkhys/ui/description-list";
import Image from "next/image";
import { notFound } from "next/navigation";
import Zoom from "react-medium-image-zoom";
import type { Camera } from "#/config/photo/camera";
import type { Lens } from "#/config/photo/lens";
import { siteConfig } from "#/config/site";
import { getPhotoBySlug, getPhotoTitle, getPublicPhotos } from "#/utils/photo";
import "#/styles/react-medium-image-zoom.css";
import "../_styles/index.css";
import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Photo } from "contentlayer/generated";
import type { Metadata } from "next";
import React from "react";
import type { BreadcrumbList, WithContext } from "schema-dts";
import type { ImageObject } from "#/app/photos/_types";
import { ActionController } from "#/ui/action-controller";

const JsonLd = ({ photo: { slug } }: { photo: Photo }) => {
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
        name: getPhotoTitle(slug),
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

  const { publishedAt, updatedAt } = photo;
  const url = `/photos/${slug}`;

  return {
    title: getPhotoTitle(slug),
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
    twitter: {
      card: "summary_large_image",
    },
  } satisfies Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const photo = getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  const {
    path,
    fNumber,
    focalLength,
    shutterSpeed,
    iso,
    publishedAtFormattedUs,
    imageObject,
  } = photo;

  const cameraData = photo.cameraData as Camera;
  const lensData = photo.lensData as Lens;
  const { width, height, blurDataURL } = imageObject as ImageObject;

  const title = getPhotoTitle(slug);

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
        <FadeInStagger className="space-y-6">
          <FadeIn>
            <h1 className="font-sans font-medium text-sm">{title}</h1>
          </FadeIn>
          <FadeIn>
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
              <DescriptionTerm>Shooting date</DescriptionTerm>
              <DescriptionDetails>{publishedAtFormattedUs}</DescriptionDetails>
            </DescriptionList>
          </FadeIn>
          <FadeIn>
            <ActionController data={photo} title={title} className="mt-8" />
          </FadeIn>
        </FadeInStagger>
      </div>
    </>
  );
};

export default Page;
