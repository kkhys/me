import { describe, expect, it } from "vitest";
import { navItems } from "#/config/navigation";
import { sites } from "#/config/sites";

describe("sites", () => {
  it("uses unique https kkhys.me subdomains", () => {
    const hrefs = sites.map((site) => site.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.map((href) => new URL(href).protocol)).toEqual(hrefs.map(() => "https:"));
    expect(hrefs.every((href) => new URL(href).host.endsWith(".kkhys.me"))).toBe(true);
    expect(hrefs.map((href) => new URL(href).pathname)).toEqual(hrefs.map(() => "/"));
  });

  it("has a unique label and a description for every site", () => {
    const labels = sites.map((site) => site.label);
    expect(new Set(labels).size).toBe(labels.length);
    expect(sites.every((site) => site.description.length > 0)).toBe(true);
  });

  it("covers every kkhys.me subdomain linked from the navigation", () => {
    const siteHosts = sites.map((site) => new URL(site.href).host);
    const navHosts = navItems
      .map((item) => new URL(item.href, "https://kkhys.me").host)
      .filter((host) => host.endsWith(".kkhys.me"));
    expect(navHosts.length).toBeGreaterThan(0);
    expect(siteHosts).toEqual(expect.arrayContaining(navHosts));
  });
});
