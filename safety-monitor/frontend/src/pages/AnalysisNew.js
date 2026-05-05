import { useRef, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEllipsisH, FaFileUpload } from "react-icons/fa";
import "./AnalysisNew.css";
import { analyzeImage } from "../api";
import Sidebar from "../components/Sidebar";

function mapDetails(details = []) {
  return details.map((worker, index) => {
    const compliant = worker.status === "Compliant";
    const hardHatText = `Hard Hat: ${worker.hardHat ? "Detected" : "MISSING"}`;
    const vestText = `Safety Vest: ${worker.vest ? "Detected" : "MISSING"}`;
    const gloveText = `Gloves: ${worker.gloves ? "Detected" : "MISSING"}`;
    return {
      id: worker.id ?? index + 1,
      name: `Worker #${worker.id ?? index + 1} - ${worker.status}`,
      text: `${hardHatText}, ${vestText}, ${gloveText}`,
      compliant
    };
  });
}

export default function AnalysisNew() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const setPreview = (file) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setImage(objectUrl);
  };

  const runAnalysis = async (file) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await analyzeImage(file);
      setResults({
        workers: response.workers ?? 0,
        compliant: response.compliant ?? 0,
        nonCompliant: response.nonCompliant ?? 0,
        details: mapDetails(response.details ?? [])
      });
    } catch (err) {
      setError("Analysis failed. Please try another image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(file);
    setError("");
    await runAnalysis(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please drop a valid image file.");
      return;
    }
    await handleFileSelect(file);
  };

  const clearCurrent = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
    setSelectedFile(null);
    setResults(null);
    setError("");
  };

  return (
    <div className="analysis-page">
      <Sidebar />

      <main className="analysis-main">
        <div className="analysis-container">
          <h1>Image Upload for Detection</h1>
          <p className="subtitle">Upload an image to detect worker equipment compliance instantly.</p>

          <div className="analysis-grid">
            <section
              className={`upload-panel ${isDragOver ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="upload-inner">
                <FaFileUpload className="upload-icon" />
                <h3>Drag a drop your file here</h3>
                <p>Supported file types: JPG, PNG. Max size: 10MB.</p>
                {selectedFile && <span className="selected-file">Selected: {selectedFile.name}</span>}
                <label className="browse-button">
                  Browse Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      await handleFileSelect(file);
                    }}
                  />
                </label>
                <button type="button" className="clear-button" onClick={clearCurrent}>
                  Clear
                </button>
                {error && <p className="error-text">{error}</p>}
              </div>
            </section>

            <section className="result-column">
              <div className="result-placeholder">
                <div className="dots-wrap">
                  <FaEllipsisH />
                </div>
                <h3>{isLoading ? "Analyzing image..." : "Analysis results will appear here"}</h3>
                <p>
                  {isLoading
                    ? "Running detection model on uploaded file."
                    : "Upload an image to start analysis automatically."}
                </p>
              </div>

              {results && (
                <>
                  <h2 className="result-title">Detection Results</h2>
                  <div className="result-stats">
                    <div className="stat-card workers">
                      <span>Workers Detected</span>
                      <strong>{results.workers}</strong>
                    </div>
                    <div className="stat-card compliant">
                      <span>Compliant</span>
                      <strong>{results.compliant}</strong>
                    </div>
                    <div className="stat-card non-compliant">
                      <span>Non-Compliant</span>
                      <strong>{results.nonCompliant}</strong>
                    </div>
                  </div>

                  <div className="preview-image-wrap">
                    <img src={image} alt="Detection" />
                    <div className="overlay-box" />
                  </div>

                  <h3 className="details-title">Details</h3>
                  <div className="details-list">
                    {results.details.map((worker) => (
                      <div key={worker.id} className={`detail-card ${worker.compliant ? "ok-card" : "bad-card"}`}>
                        {worker.compliant ? (
                          <FaCheckCircle className="detail-icon ok-icon" />
                        ) : (
                          <FaTimesCircle className="detail-icon bad-icon" />
                        )}
                        <div>
                          <h4>{worker.name}</h4>
                          <p>{worker.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
