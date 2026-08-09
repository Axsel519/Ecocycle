import { useState, useRef } from "react";
import Header from "../Components/Header";
import "../Styles/Scan.css";

const MOCK_AI_RESULTS = [
  {
    type: "Plastic Bottle (PET)",
    confidence: "98%",
    points: 50,
    category: "Plastic",
  },
  { type: "Aluminum Can", confidence: "95%", points: 40, category: "Metal" },
  { type: "Cardboard Box", confidence: "92%", points: 30, category: "Paper" },
  { type: "Glass Bottle", confidence: "96%", points: 60, category: "Glass" },
];

const Scan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScanResult(null);
    }
  };

  const handleStartScan = () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const randomResult =
        MOCK_AI_RESULTS[Math.floor(Math.random() * MOCK_AI_RESULTS.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 2500);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setScanResult(null);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="scan-page-container">
      <Header />

      <main className="scan-content-wrapper">
        <div className="scan-header-text">
          <h1 className="scan-title">
            <span className="green-text">AI</span> WASTE SCANNER
          </h1>
          <p className="scan-subtitle">
            Upload or take a photo of your recyclable item. Our AI will classify
            it instantly and reward you with EcoPoints!
          </p>
        </div>

        <div className="scan-main-grid">
          {/* Left Side: Upload & Camera Area */}
          <div className="scan-card upload-section">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="file-upload-input"
            />

            {!selectedImage ? (
              <label htmlFor="file-upload-input" className="upload-dropzone">
                <div className="upload-icon-wrapper">
                  <i className="bi bi-camera-fill"></i>
                </div>
                <h3>Upload or Capture Item</h3>
                <p>Click here to select an image from your device</p>
                <span className="supported-formats">
                  PNG, JPG, WEBP supported
                </span>
              </label>
            ) : (
              <div className="preview-container">
                <img
                  src={selectedImage}
                  alt="Uploaded item"
                  className="preview-image"
                />
                {isScanning && (
                  <div className="scan-overlay">
                    <div className="scanner-line"></div>
                    <p className="scanning-text">AI Analyzing Waste...</p>
                  </div>
                )}
              </div>
            )}

            {/* Upload Action Buttons */}
            {selectedImage && (
              <div className="scan-actions">
                {!scanResult && !isScanning && (
                  <button
                    className="btn btn-success scan-btn"
                    onClick={handleStartScan}
                  >
                    <i className="bi bi-cpu"></i> CLASSIFY WITH AI
                  </button>
                )}

                <button
                  className="btn btn-outline-secondary reset-btn"
                  onClick={handleReset}
                  disabled={isScanning}
                >
                  Choose Different Photo
                </button>
              </div>
            )}
          </div>

          {/* Right Side: AI Results & Details */}
          <div className="scan-card result-section">
            <h2 className="result-card-title">Classification Results</h2>

            {!selectedImage && !scanResult && (
              <div className="empty-state">
                <i className="bi bi-qr-code-scan empty-icon"></i>
                <p>
                  Upload a photo on the left to see AI classification details
                  and earned points.
                </p>
              </div>
            )}

            {isScanning && (
              <div className="loading-state">
                <div
                  className="spinner-border text-success"
                  role="status"
                ></div>
                <p>Identifying material type and calculating rewards...</p>
              </div>
            )}

            {scanResult && !isScanning && (
              <div className="result-details">
                <div className="result-badge-row">
                  <span className="category-badge">{scanResult.category}</span>
                  <span className="confidence-text">
                    Confidence: <strong>{scanResult.confidence}</strong>
                  </span>
                </div>

                <h3 className="detected-item-name">{scanResult.type}</h3>

                <div className="points-reward-box">
                  <div className="reward-icon">🎁</div>
                  <div>
                    <span className="reward-label">Reward Earned</span>
                    <h4 className="reward-points">
                      +{scanResult.points} EcoPoints
                    </h4>
                  </div>
                </div>

                <p className="guidance-text">
                  <i className="bi bi-info-circle-fill"></i> Please make sure
                  this item is clean and dry before submitting it for pickup.
                </p>

                <button
                  className="btn btn-success claim-btn"
                  onClick={() =>
                    alert("Points claimed and added to your wallet!")
                  }
                >
                  CLAIM REWARD & SAVE
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scan;
