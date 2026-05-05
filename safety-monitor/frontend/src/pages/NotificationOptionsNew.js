import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaEye, FaHardHat, FaSave } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./NotificationOptionsNew.css";

const defaultOptions = {
  dnd: false,
  summary: "Weekly Digest",
  maintenance: true,
  alerts: {
    hardHat: { inApp: true, email: false, sms: false },
    vest: { inApp: true, email: false, sms: false },
    goggles: { inApp: true, email: false, sms: false }
  }
};

export default function NotificationOptionsNew() {
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notificationOptionsV2");
      if (saved) {
        const parsed = JSON.parse(saved);
        setOptions(parsed);
      }
    } catch (error) {
      console.error("Failed to load notification options:", error);
    }
  }, []);

  const toggleAlert = (alert, key) => {
    setOptions((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [alert]: {
          ...prev.alerts[alert],
          [key]: !prev.alerts[alert][key]
        }
      }
    }));
  };

  const handleReset = () => {
    setOptions(defaultOptions);
    localStorage.removeItem("notificationOptionsV2");
    alert("🔄 Notification options reset.");
  };

  const handleSave = () => {
    localStorage.setItem("notificationOptionsV2", JSON.stringify(options));
    alert("✅ Notification options saved.");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="notif-opt-main">
        <header className="notif-opt-header">
          <div>
            <h1>Notification Options</h1>
            <p>Manage how and when you receive alerts.</p>
          </div>
          <div className="notif-opt-actions">
            <button type="button" onClick={handleReset}>Reset</button>
            <button type="button" className="save-opt-btn" onClick={handleSave}>
              <FaSave />
              <span>Save</span>
            </button>
          </div>
        </header>

        <section className="opt-card">
          <h3>Alert Types</h3>
          <small>Choose which notifications to receive for each type of safety alert.</small>

          <div className="alert-type-grid">
            {[
              { key: "hardHat", title: "Missing Hard Hat", icon: <FaHardHat />, cls: "red" },
              { key: "vest", title: "No Safety Vest", icon: <FaExclamationTriangle />, cls: "yellow" },
              { key: "goggles", title: "Missing Goggles", icon: <FaEye />, cls: "yellow" }
            ].map((item) => (
              <article key={item.key} className="alert-mini-card">
                <div className={`mini-title ${item.cls}`}>
                  {item.icon}
                  <strong>{item.title}</strong>
                </div>
                {["inApp", "email", "sms"].map((m) => (
                  <label key={m}>
                    <span>{m === "inApp" ? "In-App" : m.toUpperCase()}</span>
                    <input
                      type="checkbox"
                      checked={options.alerts[item.key][m]}
                      onChange={() => toggleAlert(item.key, m)}
                    />
                  </label>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="opt-card">
          <h3>General Options</h3>
          <small>Control overall notification behavior.</small>

          <div className="opt-row">
            <div>
              <strong>Do Not Disturb</strong>
              <p>Mute all notifications between 10 PM and 7 AM.</p>
            </div>
            <label className="switch-v3">
              <input
                type="checkbox"
                checked={options.dnd}
                onChange={() => setOptions((prev) => ({ ...prev, dnd: !prev.dnd }))}
              />
              <span />
            </label>
          </div>

          <div className="opt-row">
            <div>
              <strong>Summary Reports</strong>
              <p>Receive periodic summaries of non-critical events.</p>
            </div>
            <select
              value={options.summary}
              onChange={(e) => setOptions((prev) => ({ ...prev, summary: e.target.value }))}
            >
              <option>Daily Summary</option>
              <option>Weekly Digest</option>
              <option>Monthly Report</option>
            </select>
          </div>

          <div className="opt-row">
            <div>
              <strong>System &amp; Maintenance</strong>
              <p>Get alerts about scheduled downtime or issues.</p>
            </div>
            <label className="switch-v3">
              <input
                type="checkbox"
                checked={options.maintenance}
                onChange={() => setOptions((prev) => ({ ...prev, maintenance: !prev.maintenance }))}
              />
              <span />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
