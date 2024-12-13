const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container py-12">
      <section>{children}</section>
    </div>
  );
};

export default LegalLayout;
