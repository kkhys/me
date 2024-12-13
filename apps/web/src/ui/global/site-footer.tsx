import { SquareArrowOutUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { siteConfig } from "#/config";

type FooterLink = {
  href: Route;
  title: string;
  external?: boolean;
};

const footerLinks = [
  { href: "/terms", title: "Legal" },
  { href: "/privacy-policy", title: "Privacy" },
  { href: siteConfig.roadmap, title: "Roadmap", external: true },
  { href: siteConfig.storybook, title: "Storybook", external: true },
  { href: siteConfig.github, title: "Source", external: true },
] satisfies FooterLink[];

export const SiteFooter = () => (
  <footer className="border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row font-sans text-xs text-muted-foreground">
      <nav className="flex divide-x">
        {footerLinks.map(({ href, title, external }) => (
          <Link
            href={href}
            key={title}
            className="flex items-center gap-0.5 px-2 hover:text-foreground"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            {title}
            {external && <SquareArrowOutUpRight className="size-2.5" />}
          </Link>
        ))}
      </nav>
      <p>CC BY-NC-SA 4.0 2023-PRESENT &copy; Keisuke Hayashi</p>
    </div>
  </footer>
);
