import { AstroIcon } from "#/components/ui/icons/astro.tsx";
import { DockerIcon } from "#/components/ui/icons/docker.tsx";
import { GatsbyIcon } from "#/components/ui/icons/gatsby.tsx";
import { JavaIcon } from "#/components/ui/icons/java.tsx";
import { NextJsIcon } from "#/components/ui/icons/next-js.tsx";
import { PlayFrameworkIcon } from "#/components/ui/icons/play-framework.tsx";
import { ReactIcon } from "#/components/ui/icons/react.tsx";
import { RubyOnRailsIcon } from "#/components/ui/icons/ruby-on-rails.tsx";
import { RubyIcon } from "#/components/ui/icons/ruby.tsx";
import { ScalaIcon } from "#/components/ui/icons/scala.tsx";
import { TailwindCssIcon } from "#/components/ui/icons/tailwind-css.tsx";
import { TypeScriptIcon } from "#/components/ui/icons/type-script.tsx";
import { InfiniteSlider } from "#/components/ui/infinite-slider.tsx";
import { ProgressiveBlurReact } from "#/components/ui/progressive-blur";

export const TechBlogSlider = () => (
  <div className="relative size-full overflow-hidden">
    <InfiniteSlider className="flex size-full items-center" speed={50}>
      <TypeScriptIcon className="size-10 w-12" />
      <ReactIcon className="size-10 w-12" />
      <AstroIcon className="size-10 w-12" />
      <div className="grid place-items-center w-12">
        <NextJsIcon className="size-9" />
      </div>
      <GatsbyIcon className="size-10 w-12" />
      <TailwindCssIcon className="size-10 w-12" />
      <DockerIcon className="size-10 w-12" />
      <JavaIcon className="size-10 w-12" />
      <ScalaIcon className="size-10 w-12" />
      <div className="grid place-items-center w-12">
        <PlayFrameworkIcon className="size-9" />
      </div>
      <div className="grid place-items-center w-12">
        <RubyIcon className="size-8" />
      </div>
      <div className="grid place-items-center w-12">
        <RubyOnRailsIcon className="size-8" />
      </div>
    </InfiniteSlider>
    {/* NOTE: SP 表示だと Blur でスライダーが固定されてしまう不具合があるため、SP では非表示にしている。 */}
    <ProgressiveBlurReact
      className="hidden pointer-events-none absolute top-0 left-0 h-full w-[50px] md:block"
      direction="left"
      blurIntensity={1}
    />
    <ProgressiveBlurReact
      className="hidden pointer-events-none absolute top-0 right-0 h-full w-[50px] md:block"
      direction="right"
      blurIntensity={1}
    />
  </div>
);
