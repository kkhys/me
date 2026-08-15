import { expect, test } from "@playwright/test";

/* .html paths: `astro preview` serves the format:"file" output verbatim and,
   unlike Cloudflare Pages, does not resolve extensionless URLs. */
const PAGES = [
  { path: "/", name: "index" },
  { path: "/colors.html", name: "colors" },
  { path: "/typography.html", name: "typography" },
  { path: "/layout.html", name: "layout" },
  { path: "/components.html", name: "components" },
];

for (const { path, name } of PAGES) {
  test(name, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
