/* One entry per live demo on the Components page. Each also gets a
   standalone /preview/<kind> page that the stage loads in a phone-width
   iframe, since the shared components respond to viewport media queries. */
export const DEMO_KINDS = [
  "button",
  "spinner",
  "budoux",
  "link-card",
  "site-header",
  "site-footer",
  "focus-ring",
  "scrollbar",
  "blur-image",
  "search-dialog",
  "infinite-scroll",
] as const;

export type DemoKind = (typeof DEMO_KINDS)[number];

export const isDemoKind = (value: string | undefined): value is DemoKind =>
  DEMO_KINDS.some((kind) => kind === value);

export const previewPath = (kind: DemoKind) => `/preview/${kind}`;
