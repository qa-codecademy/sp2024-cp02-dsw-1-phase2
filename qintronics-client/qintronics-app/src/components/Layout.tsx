// Layout.js
import { useLocation, matchPath } from "react-router-dom";
import Sidebar from "./Sidebar";

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
    <div style={{ display: "flex" }}>
      {showSidebar && <Sidebar />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

export default Layout;
