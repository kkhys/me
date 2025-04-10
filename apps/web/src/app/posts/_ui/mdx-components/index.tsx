import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkhys/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kkhys/ui/tabs";
import { cn } from "@kkhys/ui/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import type { Route } from "next";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";
import type React from "react";
import { AlertBlock } from "#/app/posts/_ui/blocks/alert-block";
import { CarouselBlock } from "#/app/posts/_ui/blocks/carousel-block";
import { CodeBlock } from "#/app/posts/_ui/blocks/code-block";
import { DetailsBlock } from "#/app/posts/_ui/blocks/details-block";
import { FootnotesBlock } from "#/app/posts/_ui/blocks/footnotes-block";
import { GoogleMapsBlock } from "#/app/posts/_ui/blocks/google-maps-block";
import { ImageBlock } from "#/app/posts/_ui/blocks/image-block";
import { LinkCardBlock } from "#/app/posts/_ui/blocks/link-card-block";
import { MermaidBlock } from "#/app/posts/_ui/blocks/mermaid-block";
import { StepBlock, StepsBlock } from "#/app/posts/_ui/blocks/step-block";
import { TweetBlock } from "#/app/posts/_ui/blocks/tweet-block";
import { YouTubeBlock } from "#/app/posts/_ui/blocks/youtube-block";
import { HeaderWithAnchor } from "#/app/posts/_ui/header-with-anchor";

const components = {
  h2: ({
    children,
    ...props
  }: Omit<
    React.ComponentPropsWithoutRef<typeof HeaderWithAnchor>,
    "level"
  >) => (
    <HeaderWithAnchor level={2} {...props}>
      {children}
    </HeaderWithAnchor>
  ),
  h3: ({
    children,
    ...props
  }: Omit<
    React.ComponentPropsWithoutRef<typeof HeaderWithAnchor>,
    "level"
  >) => (
    <HeaderWithAnchor level={3} {...props}>
      {children}
    </HeaderWithAnchor>
  ),
  a: ({
    children,
    href = "",
    ...props
  }: React.ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center"
          {...props}
        >
          {children}
          <SquareArrowOutUpRightIcon className="ml-1 mt-0.5 size-3" />
        </a>
      );
    }

    return (
      <Link href={href as Route} {...props}>
        {children}
      </Link>
    );
  },
  figure: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & {
    "data-rehype-pretty-code-figure"?: string;
  }) => {
    if (typeof props?.["data-rehype-pretty-code-figure"] === "undefined") {
      return <figure {...props}>{children}</figure>;
    }

    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
  img: (props: React.ComponentPropsWithoutRef<typeof ImageBlock>) => (
    <ImageBlock {...props} />
  ),
  svg: ({ children, ...props }) => {
    if (!props.id?.includes("mermaid")) {
      return <svg {...props} />;
    }
    return <MermaidBlock {...props}>{children}</MermaidBlock>;
  },
  "link-card": (
    props: React.ComponentPropsWithoutRef<typeof LinkCardBlock>,
  ) => <LinkCardBlock {...props} />,
  "youtube-embed": (
    props: React.ComponentPropsWithoutRef<typeof YouTubeBlock>,
  ) => <YouTubeBlock {...props} />,
  "tweet-embed": (props: React.ComponentPropsWithoutRef<typeof TweetBlock>) => (
    <TweetBlock {...props} />
  ),
  GoogleMaps: (
    props: React.ComponentPropsWithoutRef<typeof GoogleMapsBlock>,
  ) => <GoogleMapsBlock {...props} />,
  Tabs,
  TabsList: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsList>) => (
    <TabsList
      className={cn(
        "w-full justify-start rounded-none border-b bg-transparent p-0",
        className,
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        "relative h-9 rounded-none border-b border-b-transparent bg-transparent px-4 pb-3 pt-2 text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:bg-background-lighter data-[state=active]:text-foreground data-[state=active]:shadow-none",
        className,
      )}
      {...props}
    />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TabsContent>) => (
    <TabsContent
      className={cn("mt-4 first:[&>*]:mt-0 last:[&>*]:mb-0", className)}
      {...props}
    />
  ),
  Accordion: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Accordion>) => (
    <Accordion className={cn("border-t", className)} {...props} />
  ),
  AccordionContent: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionContent>) => (
    <AccordionContent
      className={cn("first:[&>p]:mt-0 last:[&>div>*]:mb-0", className)}
      {...props}
    />
  ),
  AccordionItem: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionItem>) => (
    <AccordionItem className={cn("[&>h3]:m-0", className)} {...props} />
  ),
  AccordionTrigger: ({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof AccordionTrigger>) => (
    <AccordionTrigger className={cn("[&>p]:m-0", className)} {...props} />
  ),
  Details: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof DetailsBlock>) => (
    <DetailsBlock {...props}>{children}</DetailsBlock>
  ),
  Alert: (props: React.ComponentPropsWithoutRef<typeof AlertBlock>) => (
    <AlertBlock {...props} />
  ),
  Step: (props: React.ComponentPropsWithoutRef<typeof StepBlock>) => (
    <StepBlock {...props} />
  ),
  Steps: (props: React.ComponentPropsWithoutRef<typeof StepsBlock>) => (
    <StepsBlock {...props} />
  ),
  section: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"section"> & {
    "data-footnotes"?: boolean;
  }) => {
    if (typeof props["data-footnotes"] === "undefined")
      return <section {...props} />;
    return <FootnotesBlock>{children}</FootnotesBlock>;
  },
  Carousel: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof CarouselBlock>) => (
    <CarouselBlock {...props}>{children}</CarouselBlock>
  ),
} satisfies MDXComponents;

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
};
