import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { testApiConnection } from "../api";
import "./Help.css";

const faqs = [
  {
    q: "Why is a camera feed offline?",
    a: "Check camera power, network cable, and IP settings. Then open Camera Management and verify the stream URL."
  },
  {
    q: "How can I reduce false safety alerts?",
    a: "Use clear camera angles, stable lighting, and keep workers fully visible. Avoid backlight and crowded blind spots."
  },
  {
    q: "Where are notification rules configured?",
    a: "Go to Notification Preferences and Notification Options to control channels, quiet hours, and report frequency."
  },
  {
    q: "How do I add a new worker?",
    a: "Open Add New Worker from the sidebar, upload a headshot, then fill worker ID, department, and assigned zone."
  }
];

export default function Help() {
  const [apiStatus, setApiStatus] = useState("idle");
  const [apiMessage, setApiMessage] = useState("");

  const runApiTest = async () => {
    setApiStatus("loading");
    setApiMessage("Testing API connection...");
    try {
      await testApiConnection();
      setApiStatus("success");
      setApiMessage("API connection is working.");
    } catch (error) {
      setApiStatus("error");
      setApiMessage("API connection failed. Check endpoint URL or network.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="help-main">
        <section className="help-hero">
          <h1>Help Center</h1>
          <p>
            Find quick answers for setup, alerts, worker management, and notifications. If needed,
            contact your site administrator for system-level troubleshooting.
          </p>
        </section>

        <section className="help-grid">
          <article className="help-card">
            <h3>Quick Support Checklist</h3>
            <ul>
              <li>Confirm camera streams are online and stable.</li>
              <li>Verify worker profiles are assigned to correct zones.</li>
              <li>Review notification rules after every policy update.</li>
              <li>Check dashboard trends for recurring violation patterns.</li>
            </ul>
          </article>

          <article className="help-card">
            <h3>Best Practices</h3>
            <ul>
              <li>Use high-angle cameras to reduce occlusion.</li>
              <li>Keep PPE colors clear and visible in working areas.</li>
              <li>Run weekly report digests with safety supervisors.</li>
              <li>Update worker photos when role/location changes.</li>
            </ul>
          </article>
        </section>

        <section className="help-faq">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((item) => (
            <article key={item.q} className="faq-item">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </article>
          ))}
        </section>

        <section className="help-api-test">
          <h2>API Integration Test</h2>
          <p>Run a quick check to verify that your configured endpoint is reachable.</p>
          <button type="button" onClick={runApiTest} disabled={apiStatus === "loading"}>
            {apiStatus === "loading" ? "Testing..." : "Test API Connection"}
          </button>
          {apiMessage && (
            <p className={`api-status ${apiStatus === "error" ? "error" : apiStatus === "success" ? "success" : ""}`}>
              {apiMessage}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
