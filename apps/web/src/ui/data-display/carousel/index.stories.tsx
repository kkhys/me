import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import type { CarouselApi } from '.';
import { Card, CardContent } from '#/ui/data-display';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '.';

const meta = {
  title: 'Data Display / Carousel',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    className: 'w-[250px]',
    children: (
      <>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-4xl font-medium'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
} satisfies Story;

export const Sizes = {
  args: {
    opts: {
      align: 'start',
    },
    className: 'w-[350px]',
    children: (
      <>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-3xl font-medium'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
} satisfies Story;

export const Spacing = {
  args: {
    className: 'w-[350px]',
    children: (
      <>
        <CarouselContent className='-ml-1'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-2xl font-medium'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
} satisfies Story;

export const Orientation = {
  args: {
    opts: {
      align: 'start',
    },
    orientation: 'vertical',
    className: 'w-[350px]',
    children: (
      <>
        <CarouselContent className='-mt-1 h-[200px]'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className='pt-1 md:basis-1/2'>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex items-center justify-center p-6'>
                    <span className='text-3xl font-medium'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
} satisfies Story;

const CountDemo = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} className='w-[250px]'>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  <span className='text-4xl font-medium'>{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className='text-muted-foreground py-2 text-center text-sm'>
        Slide {current} of {count}
      </div>
    </div>
  );
};

export const Count = {
  render: () => <CountDemo />,
} satisfies Story;

export const AutoPlay = {
  args: {
    plugins: [Autoplay({ delay: 2000 })],
    className: 'w-[250px]',
    children: (
      <>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className='p-1'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-4xl font-medium'>{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </>
    ),
  },
} satisfies Story;
