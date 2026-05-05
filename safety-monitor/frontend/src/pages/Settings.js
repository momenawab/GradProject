import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; 
import "./Settings.css";
import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../api";

export default function Settings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const result = await saveSettings(settings);
      console.log("Saved:", result);
      alert("✅ Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("❌ Failed to save settings");
    }
  };

  if (!settings) return <p>Loading...</p>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content">
          <h3>Settings</h3>
          <p>Manage your application and notifications preferences</p>

          <div className="settings-layout">
            {/* User Configuration */}
            <h4>User Configuration</h4>
            <div className="settings-box">
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">Language</span>
                  <span className="value">{settings.language}</span>
                </div>
                <span className="arrow">›</span>
              </div>
              <hr />
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">Theme</span>
                  <span className="value">{settings.theme}</span>
                </div>
                <span className="arrow">›</span>
              </div>
              <hr />
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">Account</span>
                  <span className="value">{settings.account}</span>
                </div>
                <span className="arrow">›</span>
              </div>
            </div>

            {/* Notification Preferences */}
            <h4>Notification Preferences</h4>
            <div className="settings-box">
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">Push Notifications</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: !settings.notifications.push
                        }
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <hr />
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">Email Notifications</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: !settings.notifications.email
                        }
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <hr />
              <div className="setting-item">
                <div className="setting-text">
                  <span className="label">SMS Alerts</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          sms: !settings.notifications.sms
                        }
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="save-section">
            <button className="save-btn" onClick={handleSave}>Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
