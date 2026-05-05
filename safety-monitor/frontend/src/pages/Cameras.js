import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Cameras.css";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api"; 

export default function Camera() {
  const [cameras, setCameras] = useState([]);

  
  useEffect(() => {
    async function fetchCameras() {
      try {
        const data = await apiGet("cameras"); 
        const mapped = data.slice(0, 4).map((item, i) => ({
          id: i + 1,
          name: `Camera 0${i + 1} - ${item.title.substring(0, 10)}`,
          ip: `192.168.1.10${i + 1}`,
          status: i % 2 === 0 ? "Online" : "Offline",
          thumbnail: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg"
        }));
        setCameras(mapped);
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    }
    fetchCameras();
  }, []);
  
  const handleAddCamera = async () => {
    const newCam = {
      name: "New Camera",
      ip: "192.168.1.200",
      status: "Online",
      thumbnail: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg"
    };
    const result = await apiPost("addCamera", newCam);
    setCameras([...cameras, { ...newCam, id: result.id }]);
    alert("✅ Camera added successfully!");
  };

  
  const handleDeleteCamera = async (id) => {
    await apiDelete(`/posts/${id}`);
    setCameras(cameras.filter(cam => cam.id !== id));
    alert(`🗑 Camera ${id} deleted!`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content">
          <div className="camera-header">
            <h3>Camera Management</h3>
            <button className="add-btn" onClick={handleAddCamera}>+ Add New Camera</button>
          </div>

          <div className="camera-list">
            {cameras.map(cam => (
              <div key={cam.id} className={`cameras-card ${cam.status.toLowerCase()}`}>
                <div className="camera-info">
                  <p>
                    <span className={cam.status.toLowerCase()}>
                      {cam.status === "Online" ? "🟢 Online" : "🔴 Offline"}
                    </span>
                  </p>
                  <h4>{cam.name}</h4>
                  <p>IP: {cam.ip}</p>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteCamera(cam.id)}>Delete</button>
                </div>
                <div className="thumbnail">
                  {cam.thumbnail ? (
                    <img src={cam.thumbnail} alt={cam.name} />
                  ) : (
                    <div className="offline-icon">📷❌</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
