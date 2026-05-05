import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AddNewWorker.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api"; 

export default function AddNewWorker() {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    workerId: "",
    zone: "",
    department: "assembly",
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workerData = { ...formData, photo };
    try {
      const result = await apiPost("saveWorker", workerData); 
      console.log("Worker added:", result);
      alert("✅ Worker added successfully!");
      navigate("/workers"); 
    } catch (err) {
      console.error("Error adding worker:", err);
      alert("❌ Failed to add worker");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content">
          <h3 className="HeadANW">Add New Worker</h3>
          <div className="worker-container">
            <div className="photo-upload">
              <div className="upload-circle">
                {photo ? (
                  <img src={photo} alt="Worker" className="uploaded-photo" />
                ) : (
                  <span className="camera-icon">📷+</span>
                )}
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
              <button type="button" className="upload-btn" onClick={triggerFileInput}>
                {photo ? "Change Photo" : "Upload Photo"}
              </button>
              {photo && (
                <button type="button" className="remove-btn" onClick={() => setPhoto(null)}>
                  Remove Photo
                </button>
              )}
              <small>PNG or JPG, clear headshot recommended.</small>
            </div>

            <form className="worker-form" onSubmit={handleSubmit}>
              <div className="form-group full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Worker ID</label>
                  <input
                    type="text"
                    placeholder="Enter worker ID"
                    value={formData.workerId}
                    onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Assigned Area/Zone</label>
                  <input
                    type="text"
                    placeholder="Enter area/zone"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="assembly">Assembly</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="quality">Quality Control</option>
                  <option value="logistics">Logistics</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="add-btn">+ Add Worker to Database</button>
                <button type="button" className="cancel-btn" onClick={() => navigate("/workers")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
