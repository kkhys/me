import { LinkIcon } from "lucide-react";
import Link from "next/link";

const Anchor = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <Link href={`#${id}`} className="group no-underline relative">
    <div className="absolute top-0.5 -left-8 hidden opacity-0 transition duration-300 group-hover:opacity-100 md:inline-block">
      <div className="group/anchor flex size-5 items-center justify-center rounded-lg bg-secondary ring-0.5 ring-inset ring-foreground transition">
        <LinkIcon className="size-3 stroke-primary/90 transition" />
      </div>
    </div>
    {children}
  </Link>
);

export const HeaderWithAnchor = <Level extends 2 | 3>({
  children,
  level,
  anchor = true,
  ...props
}: React.ComponentPropsWithoutRef<`h${Level}`> & {
  id?: string;
  level?: Level;
  anchor?: boolean;
}) => {
  level = level ?? (2 as Level);
  const Component = `h${level}` as "h2" | "h3";

  return (
    <Component className="scroll-mt-20" {...props}>
      {anchor && props.id ? (
        <Anchor id={props.id}>{children}</Anchor>
      ) : (
        children
      )}
    </Component>
  );
};
