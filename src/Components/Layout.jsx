import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Styles/Layout.css";

function MainLayout() {
  return (
    <div className="layout-wrapper">
      <div className="layout-body">
        {/* Dynamic Page Content */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar-container">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}

export default MainLayout;
