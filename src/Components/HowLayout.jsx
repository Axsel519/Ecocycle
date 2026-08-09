// HowLayout.jsx
import { Outlet } from "react-router-dom";
import HowSidebar from "../Components/HowSidebar";

function HowLayout() {
  return (
    <div className="layout-wrapper">
      <div className="layout-body">
        <main className="main-content">
          <Outlet />
        </main>

        <aside className="sidebar-container">
          <HowSidebar />
        </aside>
      </div>
    </div>
  );
}

export default HowLayout;
