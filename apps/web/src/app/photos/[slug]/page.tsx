import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@kkhys/ui";
import Image from "next/image";
import { notFound } from "next/navigation";
import Zoom from "react-medium-image-zoom";
import type { Camera, Lens } from "#/config";
import { getPhotoBySlug, getPublicPhotos } from "#/utils/photo";
import "#/styles/react-medium-image-zoom.css";
import "../_styles/index.css";

export const generateStaticParams = async () =>
  getPublicPhotos().map(({ slug }) => ({ slug }));

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
  );
};

export default Page;
