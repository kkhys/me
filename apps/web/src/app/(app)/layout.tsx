import { SiteFooter, SiteHeader } from "#/ui/global";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full border-border/40 dark:border-border max-w-6xl border-x flex-1 flex flex-col">
    <SiteHeader />
    <main className="w-full max-w-2xl mx-auto flex-1">{children}</main>
    <SiteFooter />
  </div>
);

export default AppLayout;
