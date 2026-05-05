import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./NotificationSettings.css";
import { useState, useEffect } from "react";
import { FaHardHat, FaExclamationTriangle, FaEye } from "react-icons/fa";
import { apiGet, apiPost } from "../api"; 

export default function NotificationSettings() {
  const defaultSettings = {
    alerts: {
      hardHat: { inApp: true, email: true, sms: true },
      vest: { inApp: true, email: true, sms: true },
      goggles: { inApp: true, email: true, sms: true }
    },
    general: {
      doNotDisturb: true,
      summaryReports: "Weekly Digest",
      systemMaintenance: true
    }
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await apiGet("settings");
        setSettings(defaultSettings); 
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const result = await apiPost("saveSettings", settings); 
      console.log("Saved:", result);
      alert("✅ Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    alert("🔄 Settings reset to default!");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content notification-settings">
          <div className="header-actions">
            <h3>Notification Settings</h3>
            <div className="buttons">
              <button className="reset-btn" onClick={handleReset}>Reset</button>
              <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
          </div>
          <p style={{ marginTop: "-15px" }}>
            Manage how and when you receive alert
          </p>

          {/* Alert Types */}
          <div className="section">
            <h4>Alert Types</h4>
            <p className="subtitle">Choose which notifications to receive for each type of safety alert.</p>

            {/* Missing Hard Hat */}
            <div className="Notfic-alert-card">
              <div className="alert-header">
                <FaHardHat className="alert-icon hardhat" />
                <span className="label">Missing Hard Hat</span>
              </div>
              <ul className="options-list">
                {["inApp", "email", "sms"].map((method) => (
                  <li key={method}>
                    <span>{method === "inApp" ? "In-App" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    <input
                      type="checkbox"
                      checked={settings.alerts.hardHat[method]}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          alerts: {
                            ...settings.alerts,
                            hardHat: {
                              ...settings.alerts.hardHat,
                              [method]: !settings.alerts.hardHat[method]
                            }
                          }
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* No Safety Vest */}
            <div className="Notfic-alert-card">
              <div className="alert-header">
                <FaExclamationTriangle className="alert-icon vest" />
                <span className="label">No Safety Vest</span>
              </div>
              <ul className="options-list">
                {["inApp", "email", "sms"].map((method) => (
                  <li key={method}>
                    <span>{method === "inApp" ? "In-App" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    <input
                      type="checkbox"
                      checked={settings.alerts.vest[method]}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          alerts: {
                            ...settings.alerts,
                            vest: {
                              ...settings.alerts.vest,
                              [method]: !settings.alerts.vest[method]
                            }
                          }
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Goggles */}
            <div className="Notfic-alert-card">
              <div className="alert-header">
                <FaEye className="alert-icon goggles" />
                <span className="label">Missing Goggles</span>
              </div>
              <ul className="options-list">
                {["inApp", "email", "sms"].map((method) => (
                  <li key={method}>
                    <span>{method === "inApp" ? "In-App" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    <input
                      type="checkbox"
                      checked={settings.alerts.goggles[method]}
                      onChange={() =>
                        setSettings({
                          ...settings,
                          alerts: {
                            ...settings.alerts,
                            goggles: {
                              ...settings.alerts.goggles,
                              [method]: !settings.alerts.goggles[method]
                            }
                          }
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* General Options */}
          <div className="section">
            <h4>General Options</h4>

            <div className="general-option">
              <div className="option-header">
                <span className="label">Do Not Disturb</span>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.general.doNotDisturb}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, doNotDisturb: !settings.general.doNotDisturb }
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <small className="option-desc">Mute all notifications between 10 PM and 7 AM</small>
            </div>

            <div className="general-option">
              <div className="option-header">
                <span className="label">Summary Reports</span>
                <select
                  value={settings.general.summaryReports}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, summaryReports: e.target.value }
                    })
                  }
                >
                  <option>Daily Summary</option>
                  <option>Weekly Digest</option>
                  <option>Monthly Report</option>
                </select>
              </div>
              <small className="option-desc">Receive summaries of non-critical events</small>
            </div>

            <div className="general-option">
              <div className="option-header">
                <span className="label">System & Maintenance</span>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.general.systemMaintenance}
                    onChange={() =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, systemMaintenance: !settings.general.systemMaintenance }
                      })
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <small className="option-desc">Get alerts about scheduled downtime or issues</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}