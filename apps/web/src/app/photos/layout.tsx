const Layout = ({
  children,
  modal,
}: { children: React.ReactNode; modal: React.ReactNode }) => (
  <>
    {children}
    {modal}
  </>
);

export default Layout;
