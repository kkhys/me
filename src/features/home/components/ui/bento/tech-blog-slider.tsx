import { AstroIcon } from "#/components/ui/icons/astro";
import { DockerIcon } from "#/components/ui/icons/docker";
import { GatsbyIcon } from "#/components/ui/icons/gatsby";
import { JavaIcon } from "#/components/ui/icons/java";
import { NextJsIcon } from "#/components/ui/icons/next-js";
import { PlayFrameworkIcon } from "#/components/ui/icons/play-framework";
import { ReactIcon } from "#/components/ui/icons/react";
import { RubyIcon } from "#/components/ui/icons/ruby";
import { RubyOnRailsIcon } from "#/components/ui/icons/ruby-on-rails";
import { ScalaIcon } from "#/components/ui/icons/scala";
import { TailwindCssIcon } from "#/components/ui/icons/tailwind-css";
import { TypeScriptIcon } from "#/components/ui/icons/type-script";
import { InfiniteSlider } from "#/components/ui/infinite-slider";
import { ProgressiveBlur } from "#/components/ui/progressive-blur";

export const TechBlogSlider = () => (
  <div className="relative size-full overflow-hidden">
    <InfiniteSlider className="flex size-full items-center" speed={50}>
      <TypeScriptIcon className="size-10" />
      <ReactIcon className="size-10" />
      <AstroIcon className="size-10" />
      <div className="grid place-items-center">
        <NextJsIcon className="size-9" />
      </div>
      <GatsbyIcon className="size-10" />
      <TailwindCssIcon className="size-10" />
      <DockerIcon className="size-10" />
      <JavaIcon className="size-10" />
      <ScalaIcon className="size-10" />
      <div className="grid place-items-center">
        <PlayFrameworkIcon className="size-9" />
      </div>
      <div className="grid place-items-center">
        <RubyIcon className="size-8" />
      </div>
      <div className="grid place-items-center">
        <RubyOnRailsIcon className="size-8" />
      </div>
    </InfiniteSlider>
    <ProgressiveBlur
      className="pointer-events-none absolute top-0 left-0 h-full w-[50px]"
      direction="left"
      blurIntensity={1}
    />
    <ProgressiveBlur
      className="pointer-events-none absolute top-0 right-0 h-full w-[50px]"
      direction="right"
      blurIntensity={1}
    />
  </div>
);
