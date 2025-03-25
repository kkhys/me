"use client";

import ClassNames from "embla-carousel-class-names";
import React from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kkhys/ui/carousel";

export const CarouselBlock = ({
  children,
  ...props
}: React.ComponentProps<typeof Carousel>) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <figure>
      <Carousel
        setApi={setApi}
        plugins={[ClassNames()]}
        opts={{ duration: 20 }}
        className="mx-auto mb-0 w-full max-w-xl select-none"
        {...props}
      >
        <CarouselContent>
          {(children as React.ReactNode[])?.map((child, index) => (
            <CarouselItem
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="basis-full transition-opacity duration-300 sm:basis-[86%] [&:not(.is-snapped)]:opacity-15"
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <figcaption className="text-center font-sans text-xs text-muted-foreground">
        {current} / {count}
      </figcaption>
    </figure>
  );
};
