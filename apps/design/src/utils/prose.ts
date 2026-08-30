import { getBudouxParser } from "@kkhys/ui/budoux";
import { parseHTML } from "linkedom";

export interface Section {
  id: string;
  label: string;
}

export interface EnhancedProse {
  html: string;
  sections: Section[];
}

/* Block-level text containers that get BudouX phrase breaks. BudouX itself
   skips <pre>, <code>, <button> and <input>, so highlighted snippets and
   form controls inside these containers are left untouched. */
const PROSE_SELECTOR = "p, li, h1, h2, h3, h4, dt, dd, figcaption, summary, td, th";

/* Opt-out hook for demos that must show un-processed Japanese text. */
const OPT_OUT_SELECTOR = '[data-budoux="off"]';

/**
 * Post-processes a rendered page body: inserts BudouX `<wbr>` breaks into
 * every prose block and collects the `h2[id]` headings as sidebar sections.
 * Done once per page in the layout so pages never wrap text by hand.
 */
export const enhanceProse = (html: string): EnhancedProse => {
  const { document } = parseHTML(`<!doctype html><html lang="ja"><body>${html}</body></html>`);
  const parser = getBudouxParser();

  for (const element of document.querySelectorAll<HTMLElement>(PROSE_SELECTOR)) {
    if (element.closest(OPT_OUT_SELECTOR)) continue;
    parser.applyToElement(element);
  }

  const sections: Section[] = [];
  for (const heading of document.querySelectorAll("h2[id]")) {
    /* <small> carries the item count badge, not part of the section name:
       drop it from the sidebar label and from the Pagefind anchor title. */
    for (const badge of heading.querySelectorAll("small")) {
      badge.dataset["pagefindIgnore"] = "";
    }
    const label = [...heading.childNodes]
      .filter((node) => node.nodeName !== "SMALL")
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
    if (label === "") continue;
    sections.push({ id: heading.id, label });
  }

  return { html: document.body.innerHTML, sections };
};
