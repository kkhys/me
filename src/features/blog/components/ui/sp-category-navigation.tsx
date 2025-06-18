import { navigate } from "astro:transitions/client";
import { ChevronDownIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { Button } from "#/components/ui/button/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "#/components/ui/drawer";
import { categories, getCategoryBySlug } from "#/features/blog/config/category";
import { cn } from "#/lib/ui";

export const SpCategoryNavigation = ({
  pathname,
  className,
}: {
  pathname: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  /**
   * /blog/categories/tech のようなパスからカテゴリー部分を抽出
   * 抽出できない場合は 'all' を返す
   *
   * @param pathname パス名
   * @return カテゴリー名または 'all'
   */
  const extractCategoryFromPath = (pathname: string): string => {
    const match = pathname.match(/\/blog\/categories\/([^/]+)/);
    return match?.[1] ?? "all";
  };

  const handleTransition = async (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setOpen(false);
    await navigate(href);
  };

  const category = getCategoryBySlug(extractCategoryFromPath(pathname)) || {
    label: "すべて",
  };

  const linkClass = "block px-1 py-2";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          className={cn(
            "rounded-full inset-ring-2 ring-offset-1 inset-ring-background",
            className,
          )}
        >
          {category.label}
          <ChevronDownIcon
            className={cn(
              "size-4 ml-1 transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">カテゴリー</DrawerTitle>
        <DrawerDescription className="sr-only">
          カテゴリーを選択してください。
        </DrawerDescription>
        <ul className="flex flex-col gap-2 p-4">
          <li>
            <a
              href="/blog"
              className={linkClass}
              onClick={(e) => handleTransition(e, "/blog")}
            >
              すべて
            </a>
          </li>
          {categories.map(({ slug, label }) => (
            <li key={slug}>
              <a
                href={`/blog/categories/${slug}`}
                className={linkClass}
                onClick={(e) => handleTransition(e, `/blog/categories/${slug}`)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
