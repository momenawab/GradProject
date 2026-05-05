import { useRef, useState } from "react";
import { FaCamera, FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "./AddNewWorkerNew.css";

export default function AddNewWorkerNew() {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState("");
  const [form, setForm] = useState({
    name: "",
    workerId: "",
    zone: "",
    department: "Assembly"
  });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="add-worker-v2-main">
        <h1>Add New Worker</h1>
        <section className="add-worker-v2-card">
          <div className="photo-col">
            <div className="photo-circle-v2">
              {photo ? <img src={photo} alt="Worker" /> : <FaCamera />}
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="upload-photo-v2-btn">
              Upload Photo
            </button>
            <input ref={fileRef} type="file" hidden accept="image/png, image/jpeg" onChange={handleUpload} />
            <p>PNG or JPG, clear headshot recommended.</p>
          </div>

          <div className="form-col">
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>
            <div className="row-two">
              <label>
                Worker ID
                <input
                  value={form.workerId}
                  onChange={(e) => setForm((prev) => ({ ...prev, workerId: e.target.value }))}
                />
              </label>
              <label>
                Assigned Area/Zone
                <input
                  value={form.zone}
                  onChange={(e) => setForm((prev) => ({ ...prev, zone: e.target.value }))}
                />
              </label>
            </div>
            <label>
              Department
              <select
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              >
                <option>Assembly</option>
                <option>Welding</option>
                <option>Logistics</option>
                <option>Maintenance</option>
              </select>
            </label>

            <div className="add-worker-actions-v2">
              <button type="button" className="cancel-v2-btn">Cancel</button>
              <button type="button" className="save-v2-btn">
                <FaPlus />
                <span>Add Worker to Database</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
