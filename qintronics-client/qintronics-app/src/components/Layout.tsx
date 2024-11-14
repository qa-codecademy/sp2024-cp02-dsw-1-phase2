// Layout.js
import { useLocation, matchPath } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }: any) => {
  const location = useLocation();

  const sidebarPaths = [
    // "/",
    "/products/*",
    "/category/*",
    "/brand/*",
    "/sales",
    "favorites",
  ];

  const showSidebar = sidebarPaths.some((path) =>
    matchPath({ path, end: path === "/" }, location.pathname)
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ display: "flex", flex: 1 }}>
        {showSidebar && <Sidebar />}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
