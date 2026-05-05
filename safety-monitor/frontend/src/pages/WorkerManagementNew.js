import { useMemo, useRef, useState } from "react";
import { FaExclamationTriangle, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./WorkerManagementNew.css";

const workersSeed = [
  {
    id: "WKR-001",
    name: "John Doe",
    department: "Welding",
    zone: "Zone B, Station 5",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    violations: 2
  },
  {
    id: "WKR-002",
    name: "Jane Smith",
    department: "Assembly",
    zone: "Zone A, Station 2",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    violations: 0
  },
  {
    id: "WKR-003",
    name: "David Chen",
    department: "Logistics",
    zone: "Zone C, Bay 1",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
    violations: 1
  },
  {
    id: "WKR-004",
    name: "Maria Garcia",
    department: "Assembly",
    zone: "Zone A, Station 9",
    photo: "https://randomuser.me/api/portraits/women/66.jpg",
    violations: 0
  }
];

export default function WorkerManagementNew() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState(workersSeed);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedId, setSelectedId] = useState("WKR-001");
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const fileRef = useRef(null);

  const selectedWorker = workers.find((w) => w.id === selectedId) ?? workers[0];
  const [formState, setFormState] = useState(selectedWorker);

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const matchesDept = department === "All" || w.department === department;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term || w.name.toLowerCase().includes(term) || w.id.toLowerCase().includes(term);
      return matchesDept && matchesSearch;
    });
  }, [workers, search, department]);

  const selectWorker = (worker) => {
    setSelectedId(worker.id);
    setFormState(worker);
    setUploadedPhoto("");
  };

  const handleSave = () => {
    const updatedWorker = {
      ...formState,
      photo: uploadedPhoto || formState.photo
    };

    setWorkers((prev) =>
      prev.map((w) => (w.id === selectedId ? updatedWorker : w))
    );
    setSelectedId(updatedWorker.id);
    setFormState(updatedWorker);
    setUploadedPhoto("");
    alert("✅ Worker changes saved.");
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Delete this worker permanently?");
    if (!confirmed) return;

    const targetId = selectedId;
    const updatedWorkers = workers.filter((w) => w.id !== targetId);
    setWorkers(updatedWorkers);

    const fallback = updatedWorkers[0];
    if (fallback) {
      setSelectedId(fallback.id);
      setFormState(fallback);
      setUploadedPhoto("");
    } else {
      const emptyWorker = {
        id: "",
        name: "",
        department: "Assembly",
        zone: "",
        photo: "",
        violations: 0
      };
      setSelectedId("");
      setFormState(emptyWorker);
      setUploadedPhoto("");
    }

    alert("🗑 Worker deleted.");
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="worker-new-main">
        <h1>Worker Management</h1>

        <div className="worker-new-layout">
          <section className="worker-list-panel">
            <button type="button" className="add-worker-btn" onClick={() => navigate("/add-worker-new")}>
              <FaPlus />
              <span>Add New Worker</span>
            </button>

            <div className="search-wrap">
              <FaSearch />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID..."
              />
            </div>

            <div className="dept-filters">
              {["All", "Assembly", "Welding", "Logistics"].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={department === d ? "active-dept" : ""}
                  onClick={() => setDepartment(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="worker-list-items">
              {filteredWorkers.map((worker) => (
                <button
                  type="button"
                  key={worker.id}
                  className={`worker-item ${selectedId === worker.id ? "selected" : ""}`}
                  onClick={() => selectWorker(worker)}
                >
                  <img src={worker.photo} alt={worker.name} />
                  <div>
                    <strong>{worker.name}</strong>
                    <span>ID: {worker.id}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="worker-details-panel">
            <h2>Edit {formState.name}</h2>

            <div className="photo-row">
              <img src={uploadedPhoto || formState.photo} alt={formState.name} />
              <div>
                <button type="button" className="upload-photo-btn" onClick={() => fileRef.current?.click()}>
                  Upload New Photo
                </button>
                <input ref={fileRef} type="file" hidden accept="image/png, image/jpeg" onChange={handleUpload} />
                <p>Image should be a clear headshot, PNG or JPG.</p>
              </div>
            </div>

            <div className="form-grid">
              <label>
                Full Name
                <input
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label>
                Worker ID
                <input
                  value={formState.id}
                  onChange={(e) => setFormState((prev) => ({ ...prev, id: e.target.value }))}
                />
              </label>
              <label>
                Department
                <select
                  value={formState.department}
                  onChange={(e) => setFormState((prev) => ({ ...prev, department: e.target.value }))}
                >
                  <option>Assembly</option>
                  <option>Welding</option>
                  <option>Logistics</option>
                </select>
              </label>
              <label>
                Assigned Area/Zone
                <input
                  value={formState.zone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, zone: e.target.value }))}
                />
              </label>
            </div>

            <div className="worker-alert-box">
              <FaExclamationTriangle />
              <div>
                <strong>Safety Alert</strong>
                <p>
                  This worker has {formState.violations} recorded safety violations in the last 30
                  days. Please review and consider additional training.
                </p>
              </div>
            </div>

            <div className="worker-actions">
              <button type="button" className="delete-worker-btn" onClick={handleDelete}>
                <FaTrash />
                <span>Delete Worker</span>
              </button>
              <div>
                <button
                  type="button"
                  className="cancel-worker-btn"
                  onClick={() => {
                    setFormState(selectedWorker);
                    setUploadedPhoto("");
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="save-worker-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
