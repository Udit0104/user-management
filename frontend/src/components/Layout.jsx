import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

export default Layout;
