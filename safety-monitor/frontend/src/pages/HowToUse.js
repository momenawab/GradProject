import Sidebar from "../components/Sidebar";
import "./HowToUse.css";

// استيراد الصور من مجلد Images
import CameraSelection from "../Images/CameraSelection.png";
import AI from "../Images/AI.png";
import Monitor from "../Images/Monitor.png";
import Alert from "../Images/Alert.png";

export default function HowToUse() {
  const steps = [
    {
      id: 1,
      title: "Camera Setup",
      description: "Connect your IP camera to the network. In the Safe Eye app, navigate to 'Camera Settings' and select your camera from the dropdown list to see the live feed.",
      image: CameraSelection
    },
    {
      id: 2,
      title: "Start AI Analysis",
      description: "Once the camera feed is active, simply click the prominent 'Start Monitoring' button. Our AI will instantly begin analyzing the stream for safety compliance.",
      image: AI
    },
    {
      id: 3,
      title: "Monitor the Dashboard",
      description: "The main dashboard displays key metrics: worker count, compliance percentage, and a live event log. Keep an eye on these for a real-time overview of your facility's safety.",
      image: Monitor
    },
    {
      id: 4,
      title: "Interpret Alerts",
      description: "When a violation occurs (e.g., a missing hard hat), the AI triggers an alert. The worker is highlighted with a bounding box on the live feed for immediate identification.",
      image: Alert
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h3>How To Use</h3>
        <div className="howto-layout">
          {steps.map(step => (
            <div key={step.id} className="howto-card">
              <div className="howto-text">
                <h4>Step {step.id}: {step.title}</h4>
                <p>{step.description}</p>
              </div>
              <div className="howto-image">
                <img src={step.image} alt={step.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
