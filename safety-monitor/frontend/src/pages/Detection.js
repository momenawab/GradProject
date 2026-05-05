import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Detection.css";
import { analyzeImage } from "../api"; 

export default function Detection() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      try {
        const analysis = await analyzeImage(file); 
        setResults(analysis);
      } catch (err) {
        console.error("Error analyzing image:", err);
        alert("❌ Failed to analyze image");
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="dashboard-content">
          <h3>Image Upload for Detection</h3>
          <p>Upload an image to detect worker equipment compliance.</p>

          <div className="detection-layout">
            {/* رفع الصورة */}
            <div className="upload-section">
              <div className="upload-box">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#11D542" viewBox="0 0 24 24">
                    <path d="M6 2h7l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm7 1.5V8h4.5L13 3.5zM12 12l-4 4h3v4h2v-4h3l-4-4z"/>
                  </svg>
                </div>
                <p className="upload-text">Drag & drop your file here</p>
                <p className="hint">Supported file types: JPG, PNG. Max size: 10MB.</p>
                <label className="browse-btn">
                  Browse Files
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
              </div>
            </div>

            <div className="results-section">
              {!results && (
                <div className="placeholder">
                  <div className="placeholder-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6B7280" viewBox="0 0 24 24">
                      <path d="M12 3C6.48 3 2 7.03 2 12c0 2.39 1.05 4.55 2.77 6.16L4 21l3.09-1.64C8.07 20.45 10 21 12 21c5.52 0 10-4.03 10-9s-4.48-9-10-9zm-4 10c-.83 0-1.5-.67-1.5-1.5S7.17 10 8 10s1.5.67 1.5 1.5S8.83 13 8 13zm4 0c-.83 0-1.5-.67-1.5-1.5S11.17 10 12 10s1.5.67 1.5 1.5S12.83 13 12 13zm4 0c-.83 0-1.5-.67-1.5-1.5S15.17 10 16 10s1.5.67 1.5 1.5S16.83 13 16 13z"/>
                    </svg>
                  </div>
                  <p className="placeholder-text">Analysis results will appear here</p>
                  <p className="placeholder-hint">Upload an image and click "Analyze" to begin.</p>
                </div>
              )}

              {results && (
                <div className="results">
                  <h3>Detection Results</h3>
                  <div className="summary-panels">
                    <div className="panel detected">
                      <h4>Workers Detected</h4>
                      <p>{results.workers}</p>
                    </div>
                    <div className="panel compliant">
                      <h4>Compliant</h4>
                      <p>{results.compliant}</p>
                    </div>
                    <div className="panel non-compliant">
                      <h4>Non-Compliant</h4>
                      <p>{results.nonCompliant}</p>
                    </div>
                  </div>

                  <div className="workers-list">
                    {results.details.map(worker => (
                      <div key={worker.id} className={`detect-worker-card ${worker.status.toLowerCase()}`}>
                        <h4>
                          {worker.status === "Compliant" ? (
                            <span className="icon success">✔</span>
                          ) : (
                            <span className="icon error">✖</span>
                          )}
                          Worker #{worker.id} – {worker.status}
                        </h4>
                        <p className={worker.hardHat ? "detected" : "missing"}>
                          Hard Hat: {worker.hardHat ? "Detected ✅" : "Missing ❌"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {image && (
                    <div className="uploaded-image">
                      <h3>Uploaded Image</h3>
                      <img src={image} alt="Uploaded" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
