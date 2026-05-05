import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./WorkerManagement.css";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers, saveWorker, deleteWorker } from "../api"; 

export default function WorkerManagement() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const defaultWorker = {
    name: "John Doe",
    id: "WKR-001",
    department: "Welding",
    zone: "Zone B, Station 5",
  };

  const [workerDetails, setWorkerDetails] = useState(defaultWorker);

  useEffect(() => {
    async function fetchWorkers() {
      const data = await getWorkers();
      setWorkers(data);
    }
    fetchWorkers();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSave = async () => {
    const result = await saveWorker(workerDetails);
    console.log("Saved:", result);
    alert("✅ Worker details saved successfully!");
  };

  const handleReset = () => {
    setWorkerDetails(defaultWorker);
    setPhoto(null);
    alert("🔄 Worker details reset to default!");
  };


  const handleDelete = async (id) => {
    await deleteWorker(id);
    setWorkers(workers.filter(w => w.id !== id));
    alert(`🗑 Worker ${id} deleted!`);
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesDept = filter === "All" || worker.department === filter;
    const matchesSearch =
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.id.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content worker-management">

          <div className="worker-list">
            <div className="list-header">
              <button className="add-btn" onClick={() => navigate("/add-worker")}>
                + Add New Worker
              </button>
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filters">
              <span className={`filter ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>Department</span>
              <span className={`filter ${filter === "Assembly" ? "active" : ""}`} onClick={() => setFilter("Assembly")}>Assembly</span>
              <span className={`filter ${filter === "Welding" ? "active" : ""}`} onClick={() => setFilter("Welding")}>Welding</span>
              <span className={`filter ${filter === "Logistics" ? "active" : ""}`} onClick={() => setFilter("Logistics")}>Logistics</span>
            </div>
            <ul>
              {filteredWorkers.map(worker => (
                <li key={worker.id}>
                  <div className="worker-card">
                    <div className="worker-photo">👤</div>
                    <div>
                      <strong>{worker.name}</strong>
                      <p>{worker.id}</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(worker.id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="worker-details">
            <h3>Edit Worker Profile</h3>
            <div className="photo-section">
              <div className="worker-photo-large">
                {photo ? <img src={photo} alt="Worker" className="uploaded-photo" /> : "👤"}
              </div>
              <div className="photo-actions">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
                <button className="change-btn" onClick={triggerFileInput}>
                  {photo ? "Change Photo" : "Upload Photo"}
                </button>
                <small>PNG or JPG, clear headshot recommended.</small>
              </div>
            </div>

            <form className="details-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={workerDetails.name}
                    onChange={(e) => setWorkerDetails({ ...workerDetails, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Worker ID</label>
                  <input
                    type="text"
                    value={workerDetails.id}
                    onChange={(e) => setWorkerDetails({ ...workerDetails, id: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={workerDetails.department}
                    onChange={(e) => setWorkerDetails({ ...workerDetails, department: e.target.value })}
                  >
                    <option>Assembly</option>
                    <option>Welding</option>
                    <option>Logistics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Area/Zone</label>
                  <input
                    type="text"
                    value={workerDetails.zone}
                    onChange={(e) => setWorkerDetails({ ...workerDetails, zone: e.target.value })}
                  />
                </div>
              </div>
            </form>

            <div className="alert-box">
              <FaExclamationTriangle className="warning-icon" />
              <div>
                <strong>Safety Alert:</strong>
                <p>This worker has 2 recorded safety violations in the last 30 days. Please review their record and consider additional training.</p>
              </div>
            </div>

            <div className="form-actions">
              <div className="right-actions">
                <button className="cancel-btn" onClick={handleReset}>Reset</button>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
