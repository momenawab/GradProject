import { useEffect, useState } from "react";
import { getSummary, getAlerts } from "../api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState({ workers: 87, compliance: 92, alerts: 4 });
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("All Feeds");

  useEffect(() => {
    getSummary().then(setSummary);
    getAlerts().then(setAlerts);
  }, []);

  const allCameras = [
    {
      name: "Assembly Line 3",
      time: "14:32:10 PM",
      img: "https://www.augmentir.com/wp-content/uploads/2025/04/smart-factory-digital-manufacturing.webp",
      type: "Assembly Line",
      status: "ok"
    },
    {
      name: "Warehouse Section A",
      time: "14:32:15 PM",
      img: "https://d26e3f10zvrezp.cloudfront.net/Gallery/fc290be7-4553-4c6d-842c-1ee6df907952-400x400.webp",
      type: "Warehouse",
      status: "alert"
    },
    {
      name: "Loading Bay 2",
      time: "14:32:08 PM",
      img: "https://www.arabcont.com/Images/ProjectImage/RoxyParking-05.jpg",
      type: "Loading Bay",
      status: "warning"
    },
    {
      name: "Perimeter Fence East",
      time: "14:32:11 PM",
      img: "https://image.chukouplus.com/upload/C_3509/file/20230825/624d0ccc4ece84aabc9f37934ece268d.jpg",
      type: "Perimeter",
      status: "ok"
    }
  ];

  const filteredCameras =
    filter === "All Feeds"
      ? allCameras
      : allCameras.filter(c => c.type === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <div className="main-section-dash">
          <div className="content-area">
            <div className="section-header">
              <h3>Live Camera Feeds</h3>
              <button className="manage-btn">Manage Layout</button>
            </div>
            <div className="summary-cards">
              <div className="summary-card">
                <h4>Total Workers Detected</h4>
                <p>{summary.workers}</p>
                <span className="trend up">+2% This Hour</span>
              </div>
              <div className="summary-card">
                <h4>Compliance Rate</h4>
                <p>{summary.compliance}%</p>
                <span className="trend down">~-1.5% Today</span>
              </div>
              <div className="summary-card">
                <h4>Active Alerts</h4>
                <p>{summary.alerts}</p>
                <span className="trend up">+1 Last 15 Mins</span>
              </div>
            </div>

            <div className="camera-section">
              <div className="camera-filters">
                {["All Feeds","Assembly Line","Warehouse","Loading Bay","Perimeter"].map(f => (
                  <button
                    key={f}
                    className={`filter ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="camera-grid">
                {filteredCameras.map((cam, i) => (
                  <div key={i} className={`camera-card ${cam.status}`}>
                    <div className="camera-header-info">
                      <strong>{cam.name}</strong>
                      <span className="timestamp">{cam.time}</span>
                    </div>
                    <div className="camera-image-wrap">
                      <img src={cam.img} alt={cam.name} />
                      <div className="detection-box" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="alerts-area">
            <h3>Recent Alerts</h3>
            <ul className="alerts-list">
              {alerts.map((alert, index) => (
                <li key={alert.id} className={`alert-card ${index === 0 ? "critical" : index === 1 ? "warning" : "normal"}`}>
                  <img src="https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" alt={alert.type} />
                  <div className="alert-info">
                    <strong>{index === 0 ? "Missing Hard Hat" : index === 1 ? "Missing Safety Vest" : index === 2 ? "Incorrect Vest Type" : "No Gloves Detected"}</strong>
                    <div>{index === 2 ? "Assembly Line 1" : index === 3 ? "Warehouse Section B" : "Warehouse Section A"}</div>
                    <span className="timestamp">{alert.time} ({5 - index} mins ago)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div> 
      </div>  
    </div>     
  );
}
