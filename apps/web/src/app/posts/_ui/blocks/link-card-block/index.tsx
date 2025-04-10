import { GlobeIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@kkhys/ui/utils";

export const LinkCardBlock = ({
  className,
  ...props
}: {
  url: string;
  title: string;
  description: string;
  ogSrc?: string;
  ogWidth?: number;
  ogHeight?: number;
  ogBlurDataURL?: string;
  iconSrc?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconBlurDataURL?: string;
} & React.ComponentPropsWithoutRef<"div">) => {
  const {
    url,
    title,
    description,
    ogSrc,
    ogWidth,
    ogHeight,
    ogBlurDataURL,
    iconSrc,
    iconWidth,
    iconHeight,
    iconBlurDataURL,
  } = props;
  return (
    <div
      className={cn("select-none overflow-hidden rounded-md border", className)}
    >
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-[120px] w-full items-center text-card-foreground no-underline shadow transition-colors hover:bg-accent/50"
      >
        <div className="min-w-0 flex-1 px-4 py-2">
          <span className="block max-h-12 break-words font-medium leading-relaxed">
            <span className="line-clamp-2">{title}</span>
          </span>
          <span className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap break-words text-xs text-muted-foreground">
            {description}
          </span>
          <div className="mt-2 flex items-center">
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt={`the icon of ${title}`}
                width={Number(iconWidth)}
                height={Number(iconHeight)}
                blurDataURL={iconBlurDataURL}
                unoptimized
                className="size-3 shrink-0"
              />
            ) : (
              <GlobeIcon className="size-3 shrink-0" />
            )}
            <span className="ml-1 font-sans text-xs">
              {new URL(url).hostname}
            </span>
          </div>
        </div>
        <div className="h-[120px] w-[120px] max-w-[230px] sm:w-auto">
          {ogSrc && (
            <Image
              src={ogSrc}
              alt={`the cover of ${title}`}
              width={Number(ogWidth)}
              height={Number(ogHeight)}
              blurDataURL={ogBlurDataURL}
              unoptimized
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </a>
    </div>
  );
};
