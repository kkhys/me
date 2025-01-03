const Dots = () => (
  <div className="flex justify-center gap-x-5 py-8">
    <span className="size-0.5 rounded-full bg-primary" />
    <span className="size-0.5 rounded-full bg-primary" />
    <span className="size-0.5 rounded-full bg-primary" />
  </div>
);

export const FootnotesBlock = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div id="footnotes" className={className}>
    <Dots />
    {children}
  </div>
);
