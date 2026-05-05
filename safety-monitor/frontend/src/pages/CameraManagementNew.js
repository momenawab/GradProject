import { useMemo, useState } from "react";
import { FaCircle, FaVideoSlash, FaPlus, FaPen, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./CameraManagementNew.css";

const initialCameras = [
  {
    id: 1,
    name: "Camera 01 - Entrance",
    ip: "192.168.78.101",
    status: "Online",
    thumbnail:
      "https://images.pexels.com/photos/2664150/pexels-photo-2664150.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 2,
    name: "Camera 02 - Assembly Line",
    ip: "192.168.78.102",
    status: "Online",
    thumbnail:
      "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: 3,
    name: "Camera 03 - Warehouse",
    ip: "192.168.78.103",
    status: "Offline",
    thumbnail: ""
  },
  {
    id: 4,
    name: "Camera 04 - Loading Bay",
    ip: "192.168.78.104",
    status: "Online",
    thumbnail:
      "https://images.pexels.com/photos/4481321/pexels-photo-4481321.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
];

export default function CameraManagementNew() {
  const [cameras, setCameras] = useState(initialCameras);
  const navigate = useNavigate();

  const onlineCount = useMemo(
    () => cameras.filter((camera) => camera.status === "Online").length,
    [cameras]
  );

  const handleAddCamera = () => {
    const id = cameras.length + 1;
    const nextCamera = {
      id,
      name: `Camera 0${id} - New Zone`,
      ip: `192.168.78.10${id}`,
      status: "Online",
      thumbnail:
        "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600"
    };
    setCameras((prev) => [...prev, nextCamera]);
  };

  const handleEditCamera = (id) => {
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, status: camera.status === "Online" ? "Offline" : "Online" }
          : camera
      )
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="camera-new-main">
        <div className="camera-new-header">
          <div>
            <h1>Camera Management</h1>
            <p>Add, edit, and manage all camera feeds for AI monitoring.</p>
          </div>
          <button type="button" className="camera-add-btn" onClick={handleAddCamera}>
            <FaPlus />
            <span>Add New Camera</span>
          </button>
        </div>

        <div className="camera-summary-chip">
          <FaCircle />
          <span>{onlineCount} Cameras Online</span>
        </div>

        <section className="camera-new-grid">
          {cameras.map((camera) => (
            <article key={camera.id} className={`camera-new-card ${camera.status.toLowerCase()}`}>
              <div className="camera-new-info">
                <div className={`camera-status ${camera.status.toLowerCase()}`}>
                  <FaCircle />
                  <span>{camera.status}</span>
                </div>
                <h3>{camera.name}</h3>
                <p>IP: {camera.ip}</p>
                <button type="button" className="camera-edit-btn" onClick={() => handleEditCamera(camera.id)}>
                  <FaPen />
                  <span>Edit</span>
                </button>
              </div>

              <div className="camera-new-thumb">
                {camera.thumbnail ? (
                  <img src={camera.thumbnail} alt={camera.name} />
                ) : (
                  <div className="camera-offline-box">
                    <FaVideoSlash />
                  </div>
                )}
                <FaVideo className="camera-badge-icon" />
              </div>
            </article>
          ))}
        </section>

        <button type="button" className="view-dashboard-btn" onClick={() => navigate("/")}>
          View Dashboard
        </button>
      </main>
    </div>
  );
}
