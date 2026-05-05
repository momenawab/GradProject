import { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaExclamationTriangle, FaEye, FaHardHat, FaMoon, FaSave } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./NotificationPreferencesNew.css";

const defaultState = {
  all: false,
  dnd: false,
  emailReports: false,
  summary: "Weekly Digest",
  maintenanceInApp: false,
  maintenanceEmail: false,
  alerts: {
    hardHat: { inApp: true, email: true, sms: false },
    vest: { inApp: true, email: false, sms: false },
    goggles: { inApp: true, email: false, sms: false }
  }
};

export default function NotificationPreferencesNew() {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notificationPreferencesV2");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
    }
  }, []);

  const toggle = (key) => setState((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleAlert = (alert, method) => {
    setState((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [alert]: {
          ...prev.alerts[alert],
          [method]: !prev.alerts[alert][method]
        }
      }
    }));
  };

  const handleReset = () => {
    setState(defaultState);
    localStorage.removeItem("notificationPreferencesV2");
    alert("🔄 Preferences reset to default.");
  };

  const handleSave = () => {
    localStorage.setItem("notificationPreferencesV2", JSON.stringify(state));
    alert("✅ Notification preferences saved.");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="notif-v2-main">
        <header className="notif-v2-top">
          <div>
            <h1>Notification Preferences</h1>
          </div>
          <div className="notif-v2-actions">
            <button type="button" className="ghost-btn" onClick={handleReset}>Reset to Default</button>
            <button type="button" className="solid-btn" onClick={handleSave}>
              <FaSave />
              <span>Save Changes</span>
            </button>
          </div>
        </header>

        <section className="notif-card">
          <h3>General Settings</h3>
          <div className="line-item">
            <span><FaBell /> Enable All Notifications</span>
            <label className="switch-v2">
              <input type="checkbox" checked={state.all} onChange={() => toggle("all")} />
              <span />
            </label>
          </div>
          <div className="line-item">
            <span><FaMoon /> Do Not Disturb</span>
            <label className="switch-v2">
              <input type="checkbox" checked={state.dnd} onChange={() => toggle("dnd")} />
              <span />
            </label>
          </div>
          <small>Mute notifications from 10 PM to 7 AM</small>
        </section>

        <section className="notif-card">
          <h3>Real-time Safety Alerts</h3>
          <small>Receive immediate notifications for critical safety violations detected by the AI.</small>
          <div className="delivery-head">
            <span>Delivery Methods</span>
            <div>
              <span>In-app</span>
              <span>Email</span>
              <span>SMS</span>
            </div>
          </div>

          {[
            { key: "hardHat", icon: <FaHardHat />, label: "Missing Hard Hat", cls: "red" },
            { key: "vest", icon: <FaExclamationTriangle />, label: "No Safety Vest", cls: "yellow" },
            { key: "goggles", icon: <FaEye />, label: "Missing Goggles", cls: "yellow" }
          ].map((item) => (
            <div key={item.key} className="alert-row-v2">
              <div className={`alert-name ${item.cls}`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              <div className="alert-checks">
                {["inApp", "email", "sms"].map((method) => (
                  <input
                    key={method}
                    type="checkbox"
                    checked={state.alerts[item.key][method]}
                    onChange={() => toggleAlert(item.key, method)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="notif-card">
          <h3>Summary Reports</h3>
          <small>Receive periodic summaries of non-critical events and system performance.</small>
          <div className="line-item">
            <span><FaEnvelope /> Email Reports</span>
            <label className="switch-v2">
              <input type="checkbox" checked={state.emailReports} onChange={() => toggle("emailReports")} />
              <span />
            </label>
          </div>
          <div className="line-item">
            <span>Report Frequency</span>
            <select value={state.summary} onChange={(e) => setState((prev) => ({ ...prev, summary: e.target.value }))}>
              <option>Daily Summary</option>
              <option>Weekly Digest</option>
              <option>Monthly Report</option>
            </select>
          </div>
        </section>

        <section className="notif-card">
          <h3>System &amp; Maintenance Alerts</h3>
          <small>Stay informed about scheduled system maintenance or connectivity issues.</small>
          <div className="line-item">
            <span>In-app</span>
            <label className="switch-v2">
              <input
                type="checkbox"
                checked={state.maintenanceInApp}
                onChange={() => toggle("maintenanceInApp")}
              />
              <span />
            </label>
          </div>
          <div className="line-item">
            <span>Email</span>
            <label className="switch-v2">
              <input
                type="checkbox"
                checked={state.maintenanceEmail}
                onChange={() => toggle("maintenanceEmail")}
              />
              <span />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
