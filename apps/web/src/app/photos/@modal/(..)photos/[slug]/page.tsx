import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@kkhys/ui/dialog";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ImageObject } from "#/app/photos/_types";
import { PhotoModal } from "#/app/photos/_ui/photo-modal";
import type { Camera } from "#/config/photo/camera";
import { getPhotoBySlug, getPhotoTitle, getPublicPhotos } from "#/utils/photo";

export const generateStaticParams = async () =>
  getPublicPhotos().map(({ slug }) => ({ slug }));

const Page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  const cameraData = photo.cameraData as Camera;

  const { path, focalLength, fNumber, shutterSpeed, iso, imageObject } = photo;

  const title = getPhotoTitle(slug);
  const { width, height, blurDataURL } = imageObject as ImageObject;

  return (
    <PhotoModal>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">Photo by</DialogDescription>
      <DialogContent className="max-w-6xl cursor-zoom-out [&>button]:hidden">
        <Image
          src={path}
          width={width}
          height={height}
          sizes="100vw"
          alt="my photo"
          placeholder="blur"
          blurDataURL={blurDataURL}
          quality={100}
        />
        <DialogFooter className="!flex-col items-center text-muted-foreground text-sm font-sans">
          <p>
            Shot on <span className="font-semibold">{cameraData.name}</span>{" "}
            {cameraData.manufacturer}
          </p>
          <p>
            {focalLength}mm f/{fNumber} {shutterSpeed}s ISO{iso}
          </p>
        </DialogFooter>
      </DialogContent>
    </PhotoModal>
  );
};

export default Page;
