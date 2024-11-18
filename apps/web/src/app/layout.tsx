const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header>
          <h1>test</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
