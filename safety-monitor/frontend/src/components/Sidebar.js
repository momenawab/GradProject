import React from "react";
import { NavLink } from "react-router-dom";
import { FaThLarge, FaVideo, FaCog, FaQuestionCircle, FaChartBar, FaBookOpen, FaUsers, FaBell, FaUserPlus } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: <FaThLarge /> },
    { to: "/analysis-new", label: "Analysis", icon: <FaChartBar /> },
    { to: "/instructions-new", label: "Instructions", icon: <FaBookOpen /> },
    { to: "/camera-management-new", label: "Camera Management", icon: <FaVideo /> },
    { to: "/worker-management-new", label: "Worker Management", icon: <FaUsers /> },
    { to: "/add-worker-new", label: "Add New Worker", icon: <FaUserPlus /> },
    { to: "/settings-new", label: "Settings", icon: <FaCog /> },
    { to: "/notification-preferences-new", label: "Notification Preferences", icon: <FaBell /> },
    { to: "/notification-options-new", label: "Notification Options", icon: <FaBell /> }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <h2>FactoryGuard</h2>
          <p>Industrial AI Solutions</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <NavLink to="/help" className="sidebar-help">
          <FaQuestionCircle />
          <span>Help Center</span>
        </NavLink>
        <NavLink to="/logout" className="sidebar-help">
          <span>⎋</span>
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
