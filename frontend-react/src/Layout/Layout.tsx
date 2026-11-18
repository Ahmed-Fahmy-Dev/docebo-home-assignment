import Header from './Header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
  return (
    <div className="workspace">
      <Header />

      <main className="page">{children}</main>
    </div>
  );
};

export default Layout;
