import { pickActiveId } from "./toc-active";

export interface ActiveHeadingOptions {
  /** The table-of-contents links; each hash names a heading id. */
  links: readonly HTMLAnchorElement[];
  /** Selector for the headings to track, e.g. `.prose :is(h2, h3)[id]`. */
  headingSelector: string;
  /** Called whenever the active heading changes (`null` when none). */
  onChange: (id: string | null, link: HTMLAnchorElement | undefined) => void;
  /**
   * Detection band. The default treats the top 20% of the viewport as the
   * "current section" band.
   */
  rootMargin?: string | undefined;
}

/**
 * Highlights the table-of-contents entry for the heading currently in view
 * and keeps it scrolled into the list. Returns a disposer.
 */
export const observeActiveHeading = ({
  links,
  headingSelector,
  onChange,
  rootMargin = "0px 0px -80% 0px",
}: ActiveHeadingOptions): (() => void) => {
  const linkById = new Map(links.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));
  const headings = [...document.querySelectorAll<HTMLElement>(headingSelector)].filter((heading) =>
    linkById.has(heading.id),
  );
  const orderedIds = headings.map((heading) => heading.id);
  const visibleIds = new Set<string>();
  let activeId: string | null = null;

  const setActive = (id: string | null) => {
    if (id === activeId) return;
    activeId = id;
    const activeLink = id === null ? undefined : linkById.get(id);
    onChange(id, activeLink);
    activeLink?.scrollIntoView({ block: "nearest" });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleIds.add(entry.target.id);
        else visibleIds.delete(entry.target.id);
      }
      setActive(pickActiveId(orderedIds, visibleIds, activeId));
    },
    { rootMargin },
  );

  for (const heading of headings) observer.observe(heading);
  return () => observer.disconnect();
};
