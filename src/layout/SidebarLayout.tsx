import { Outlet, NavLink } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaUserMd, FaListAlt } from "react-icons/fa";
import "./sidebar.css";

export default function SidebarLayout() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Elite8 Hospital Management System</h2>

        <nav className="nav">

          {/* Dashboard */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaHome />
            <span>Dashboard</span>
          </NavLink>

          {/* Appointments */}
          <NavLink
            to="/appointments"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </NavLink>

          {/* Manage Doctors */}
          <NavLink
            to="/manage-doctors"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaUserMd />
            <span>Doctors</span>
          </NavLink>

          {/* Departments */}
          <NavLink
            to="/departments"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <FaListAlt />
            <span>Departments</span>
          </NavLink>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
