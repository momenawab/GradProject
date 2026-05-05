import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./NotificationPreferences.css";
import { useState, useEffect } from "react";
import { FaHardHat, FaExclamationTriangle, FaEye, FaBell, FaMoon, FaEnvelope, FaClock, FaMobileAlt } from "react-icons/fa";
import { getNotificationPreferences, saveNotificationPreferences } from "../api"; 

export default function NotificationPreferences() {
  const defaultSettings = {
    enableAll: true,
    doNotDisturb: true,
    alerts: {
      hardHat: { inApp: true, email: true, sms: true },
      vest: { inApp: true, email: true, sms: true },
      goggles: { inApp: true, email: true, sms: true }
    },
    emailReports: true,
    reportFrequency: "Weekly Digest",
    system: { inApp: true, email: true }
  };

  const [settings, setSettings] = useState(defaultSettings);

  
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getNotificationPreferences();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    }
    fetchSettings();
  }, []);

  
  const handleSave = async () => {
    try {
      const result = await saveNotificationPreferences(settings);
      console.log("Saved:", result);
      alert("✅ Settings saved successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      alert("❌ Failed to save settings");
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
        <div className="dashboard-content notification-preferences">
          <div className="header-actions">
            <h3>Notification Preferences</h3>
            <div className="buttons">
              <button className="reset-btn" onClick={handleReset}>Reset to Default</button>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </div>

        {/* General Settings */}
        <div className="section">
          <h4>General Settings</h4>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaBell /> Enable All Notifications</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.enableAll}
                  onChange={() => setSettings({ ...settings, enableAll: !settings.enableAll })}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaMoon /> Do Not Disturb</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.doNotDisturb}
                  onChange={() => setSettings({ ...settings, doNotDisturb: !settings.doNotDisturb })}
                />
                <span className="slider"></span>
              </label>
            </div>
            <small className="option-desc"><FaClock /> Mute notifications from 10 PM to 7 AM</small>
          </div>
        </div>

        {/* Real-time Safety Alerts */}
        <div className="section">
          <h4>Real-time Safety Alerts</h4>
          <p className="subtitle">Receive immediate notifications for critical safety violations detected by AI.</p>

          {["hardHat", "vest", "goggles"].map((alertKey, idx) => {
            const icons = [
              <FaHardHat className="rt-alert-icon hardhat" />,
              <FaExclamationTriangle className="rt-alert-icon vest" />,
              <FaEye className="rt-alert-icon goggles" />
            ];
            const labels = ["Missing Hard Hat", "No Safety Vest", "Missing Goggles"];
            return (
              <div className="rt-alert-row" key={alertKey}>
                <div className="rt-alert-label">
                  {icons[idx]} <span>{labels[idx]}</span>
                </div>
                <div className="rt-delivery-options">
                  {["inApp", "email", "sms"].map((method) => (
                    <label key={method}>
                      <span>{method === "inApp" ? "In-App" : method.charAt(0).toUpperCase() + method.slice(1)}</span>
                      <input
                        type="checkbox"
                        checked={settings.alerts[alertKey][method]}
                        onChange={() =>
                          setSettings({
                            ...settings,
                            alerts: {
                              ...settings.alerts,
                              [alertKey]: {
                                ...settings.alerts[alertKey],
                                [method]: !settings.alerts[alertKey][method]
                              }
                            }
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Reports */}
        <div className="section">
          <h4>Summary Reports</h4>
          <p className="subtitle">Receive periodic summaries of non-critical events and system performance.</p>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaEnvelope /> Email Reports</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.emailReports}
                  onChange={() => setSettings({ ...settings, emailReports: !settings.emailReports })}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaClock /> Report Frequency</span>
              <select
                value={settings.reportFrequency}
                onChange={(e) => setSettings({ ...settings, reportFrequency: e.target.value })}
              >
                <option>Daily Summary</option>
                <option>Weekly Digest</option>
                <option>Monthly Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* System & Maintenance Alerts */}
        <div className="section">
          <h4>System & Maintenance Alerts</h4>
          <p className="subtitle">Stay informed about scheduled system maintenance or connectivity issues.</p>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaMobileAlt /> In-App</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.system.inApp}
                  onChange={() => setSettings({ ...settings, system: { ...settings.system, inApp: !settings.system.inApp } })}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="general-option">
            <div className="option-header">
              <span className="label"><FaEnvelope /> Email</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.system.email}
                  onChange={() => setSettings({ ...settings, system: { ...settings.system, email: !settings.system.email } })}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
