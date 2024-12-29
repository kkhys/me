import type { ImageProps } from "next/image";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";

const NextImage = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
}: {
  src: string;
  alt?: string;
  width: number;
  height: number;
  blurDataURL?: string;
}) => (
  <Image
    src={src}
    alt={alt ?? ""}
    width={width}
    height={height}
    sizes="(min-width: 768px) 42rem, 100vw"
    placeholder="blur"
    blurDataURL={blurDataURL}
    quality={90}
    className="w-full rounded-2xl border-[#474747] shadow dark:border dark:shadow-none"
  />
);

const ZoomImage = ({
  src,
  children,
}: {
  src: string;
  children: React.ReactNode;
}) => (
  <Zoom zoomImg={{ src }} zoomMargin={10}>
    {children}
  </Zoom>
);

export const ImageBlock = ({
  src,
  alt,
  blurDataURL,
  width,
  height,
  title,
}: Pick<ImageProps, "blurDataURL" | "title"> & {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}) => {
  if (!src) {
    return <p>Failed to load image. alt = {alt}</p>;
  }

  if (!title)
    return (
      <div className="select-none">
        <ZoomImage src={src}>
          <NextImage
            src={src}
            alt={alt}
            width={width as number}
            height={height as number}
            blurDataURL={blurDataURL}
          />
        </ZoomImage>
      </div>
    );

  return (
    <figure>
      <div className="select-none">
        <ZoomImage src={src}>
          <NextImage
            src={src}
            alt={alt}
            width={width as number}
            height={height as number}
            blurDataURL={blurDataURL}
          />
        </ZoomImage>
      </div>
      <figcaption className="text-center text-xs text-muted-foreground">
        {title}
      </figcaption>
    </figure>
  );
};
