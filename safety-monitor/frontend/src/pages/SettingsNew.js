import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./SettingsNew.css";

export default function SettingsNew() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="settings-new-main">
        <section className="settings-new-header">
          <h1>Settings</h1>
          <p>Manage your application and notification preferences.</p>
        </section>

        <section className="settings-section">
          <h2>User Configuration</h2>
          <div className="settings-panel">
            <button type="button" className="settings-row">
              <div>
                <strong>Language</strong>
                <span>English</span>
              </div>
              <FaChevronRight />
            </button>
            <button type="button" className="settings-row">
              <div>
                <strong>Theme</strong>
                <span>Dark</span>
              </div>
              <FaChevronRight />
            </button>
            <button type="button" className="settings-row">
              <div>
                <strong>Account</strong>
                <span>Manage your account details</span>
              </div>
              <FaChevronRight />
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notification Preferences</h2>
          <div className="settings-panel">
            <div className="settings-row">
              <div>
                <strong>Push Notifications</strong>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => toggleNotification("push")}
                />
                <span />
              </label>
            </div>
            <div className="settings-row">
              <div>
                <strong>Email Notifications</strong>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => toggleNotification("email")}
                />
                <span />
              </label>
            </div>
            <div className="settings-row">
              <div>
                <strong>SMS Alerts</strong>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() => toggleNotification("sms")}
                />
                <span />
              </label>
            </div>
          </div>
        </section>

        <button type="button" className="settings-dashboard-btn" onClick={() => navigate("/")}>
          View Dashboard
        </button>
      </main>
    </div>
  );
}
