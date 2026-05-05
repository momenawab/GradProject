import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./InstructionsNew.css";
import CameraSelection from "../Images/CameraSelection.png";
import AI from "../Images/AI.png";
import Monitor from "../Images/Monitor.png";
import Alert from "../Images/Alert.png";
import Reports from "../Images/Reports.png";

const steps = [
  {
    id: 1,
    title: "Camera Setup",
    description:
      "Connect your IP camera to the network. In the FactoryGuard app, open Camera Settings and choose your camera to start viewing the live feed.",
    image: CameraSelection
  },
  {
    id: 2,
    title: "Start AI Analysis",
    description:
      "When the feed is active, click Start Monitoring. The AI immediately begins analyzing stream events for PPE and safety compliance.",
    image: AI
  },
  {
    id: 3,
    title: "Monitor the Dashboard",
    description:
      "Use the dashboard to track worker count, compliance rate, and recent alerts in real-time for your facility zones.",
    image: Monitor
  },
  {
    id: 4,
    title: "Interpret Alerts",
    description:
      "When a violation happens (for example missing hard hat), the system raises an alert and highlights the target in the frame.",
    image: Alert
  },
  {
    id: 5,
    title: "Review Reports",
    description:
      "Access historical reports to filter by date, area, and violation type. Use insights to improve compliance over time.",
    image: Reports
  }
];

export default function InstructionsNew() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="instructions-main">
        <section className="instructions-hero">
          <h1>How to Use FactoryGuard</h1>
          <p>
            Follow these simple steps to set up your system and start ensuring workplace safety
            with AI-powered monitoring.
          </p>
        </section>

        <section className="instructions-grid">
          {steps.map((step) => (
            <article key={step.id} className={`instruction-card ${step.id === 5 ? "wide-card" : ""}`}>
              <div className="instruction-head">
                <span>{step.id}</span>
                <h3>{step.title}</h3>
              </div>
              <p>{step.description}</p>
              <div className="instruction-image-wrap">
                <img src={step.image} alt={step.title} />
              </div>
            </article>
          ))}
        </section>

        <section className="instructions-cta">
          <h2>Ready to Improve Workplace Safety?</h2>
          <p>
            You are now equipped to use FactoryGuard effectively. Continue to your dashboard to
            begin monitoring your facility and enhancing worker safety.
          </p>
          <button type="button" onClick={() => navigate("/")}>
            Go to Dashboard
          </button>
        </section>
      </main>
    </div>
  );
}
