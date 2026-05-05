import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <h2>AI Safety Monitor</h2>
      <div className="header-actions">
        <button
          className="icon-btn"
          type="button"
          aria-label="Notifications"
          onClick={() => navigate("/notification-preferences-new")}
        >
          <FaBell size={14} />
        </button>
        <button
          className="icon-btn profile-btn"
          type="button"
          aria-label="Profile"
          onClick={() => navigate("/settings-new")}
        >
          <FaUserCircle size={16} />
        </button>
      </div>
    </header>
  );
}
