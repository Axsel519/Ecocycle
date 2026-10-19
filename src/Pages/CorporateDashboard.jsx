import React, { useState, useEffect, useMemo } from "react";
import Header from "../Components/Header";
import "../Styles/CorporateDashboard.css";

const wasteCategories = [
  {
    id: "plastic",
    name: "Plastic Waste",
    icon: "bi bi-droplet",
    co2Factor: 2.5,
  },
  {
    id: "paper",
    name: "Paper & Cardboard",
    icon: "bi bi-file-earmark-text",
    co2Factor: 1.8,
  },
  {
    id: "glass",
    name: "Glass Bottles",
    icon: "bi bi-cup-straw",
    co2Factor: 0.8,
  },
  { id: "cans", name: "Metal & Cans", icon: "bi bi-box-seam", co2Factor: 3.2 },
];

function CorporateDashboard() {
  const [companyName, setCompanyName] = useState("");

  // البداية بقيم صفرية لكافة المواد
  const [selectedMaterials, setSelectedMaterials] = useState({
    plastic: 0,
    paper: 0,
    glass: 0,
    cans: 0,
    electronics: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // جلب اسم الشركة أو المستخدم تلقائياً من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const name = parsed.companyName || parsed.name || "GreenTech Solutions";
        setCompanyName(name);
      } catch (e) {
        console.error("Error reading company name from local storage:", e);
        setCompanyName("GreenTech Solutions");
      }
    } else {
      setCompanyName("GreenTech Solutions");
    }
  }, []);

  // حساب إجمالي الوزن المحسوب بذكاء (Calculated Mass)
  const totalWeight = useMemo(() => {
    return Object.values(selectedMaterials).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0,
    );
  }, [selectedMaterials]);

  // حساب الانبعاثات الكربونية الكلية (CO₂ Offset)
  const totalCo2Saved = useMemo(() => {
    return wasteCategories.reduce((acc, cat) => {
      const quantity = Number(selectedMaterials[cat.id]) || 0;
      return acc + quantity * cat.co2Factor;
    }, 0);
  }, [selectedMaterials]);

  // التحكم في تعديل كميات المواد
  const handleQuantityChange = (id, value) => {
    const val = value === "" ? "" : Math.max(0, Number(value));
    setSelectedMaterials((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (totalWeight === 0) {
      alert("Please select at least one material quantity greater than zero.");
      return;
    }

    setIsSubmitting(true);

    // محاكاة إرسال الطلب للسيرفر
    setTimeout(() => {
      setIsSubmitting(false);
      setRequestSubmitted(true);
    }, 1200);
  };

  return (
    <div className="corporate-page-wrapper">
      <Header />

      <main className="corporate-container">
        {/* Banner Section */}
        <div className="corporate-banner">
          <div>
            <span className="corporate-badge">B2B Sustainability Portal</span>
            <h1>Corporate Recycling & ESG Impact</h1>
            <p>
              Select materials for recycling, schedule bulk pickups, and receive
              official certified CO₂ offset report for WHO & Sustainability
              Compliance awards.
            </p>
          </div>
          <div className="banner-stats-box">
            <div className="b-stat">
              <span className="b-label">Total Selected Mass</span>
              <span className="b-val">{totalWeight.toLocaleString()} Kg</span>
            </div>
            <div className="b-stat highlight">
              <span className="b-label">Est. CO₂ Offset</span>
              <span className="b-val">
                {(totalCo2Saved / 1000).toFixed(2)} Tons
              </span>
            </div>
          </div>
        </div>

        {/* Company Name Input Section */}
        <div className="company-info-card">
          <div className="company-input-group">
            <label htmlFor="companyNameInput" className="company-label">
              Organization / Company Name
            </label>
            <input
              id="companyNameInput"
              type="text"
              className="company-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="corporate-grid">
          {/* Left Panel: Materials Selector */}
          <div className="form-card">
            <h2 className="section-title">
              <i className="bi bi-list-check"></i> Select Materials for
              Recycling
            </h2>
            <form onSubmit={handleCreateRequest}>
              <div className="materials-list">
                {wasteCategories.map((cat) => (
                  <div key={cat.id} className="material-item">
                    <div className="material-info">
                      <div className="material-icon">
                        <i className={cat.icon}></i>
                      </div>
                      <div>
                        <h4>{cat.name}</h4>
                        <span className="co2-factor">
                          Saves ~{cat.co2Factor}kg CO₂/kg
                        </span>
                      </div>
                    </div>

                    <div className="quantity-control">
                      <input
                        type="number"
                        min="0"
                        value={selectedMaterials[cat.id]}
                        onChange={(e) =>
                          handleQuantityChange(cat.id, e.target.value)
                        }
                        placeholder="0"
                      />
                      <span className="unit">Kg</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="submit-request-btn"
                disabled={isSubmitting}
              >
                <i className="bi bi-truck"></i>
                {isSubmitting
                  ? "Processing Request..."
                  : "Schedule Bulk Pickup Request"}
              </button>
            </form>
          </div>

          {/* Right Panel: ESG Impact & Certificate */}
          <div className="impact-card">
            <h2 className="section-title">
              <i className="bi bi-award-fill"></i> Environmental Impact &
              Certificate
            </h2>

            <div className="impact-metrics">
              <div className="metric-box">
                <i className="bi bi-cloud-arrow-down-fill text-green"></i>
                <div>
                  <h3>{totalCo2Saved.toFixed(1)} Kg</h3>
                  <p>CO₂ Emissions Avoided</p>
                </div>
              </div>

              <div className="metric-box">
                <i className="bi bi-tree-fill text-green"></i>
                <div>
                  <h3>{Math.round(totalCo2Saved / 20)} Trees</h3>
                  <p>Equivalent Trees Planted / Year</p>
                </div>
              </div>
            </div>

            {/* Certificate Unlock Box */}
            <div className="certificate-box">
              {requestSubmitted ? (
                <div className="cert-ready-alert">
                  <div className="cert-header">
                    <i className="bi bi-patch-check-fill cert-icon"></i>
                    <div>
                      <h4>Recycling Request Completed!</h4>
                      <p>Your CO₂ Offset Certificate is now generated.</p>
                    </div>
                  </div>

                  <button
                    className="view-cert-btn"
                    onClick={() => setShowCertificate(true)}
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i> View &
                    Download Official Certificate
                  </button>
                </div>
              ) : (
                <div className="cert-locked-alert">
                  <i className="bi bi-lock-fill"></i>
                  <p>
                    Submit a recycling request above to generate your company's
                    official{" "}
                    <strong>WHO & Environmental Compliance Certificate</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Certificate Document View */}
      {showCertificate && (
        <div
          className="modal-overlay"
          onClick={() => setShowCertificate(false)}
        >
          <div
            className="certificate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setShowCertificate(false)}
            >
              &times;
            </button>

            <div className="official-certificate">
              <div className="cert-border">
                <div className="cert-logo-section">
                  <img
                    src="/images/Ecocycle.png"
                    alt="EcoCycle Logo"
                    className="cert-logo"
                  />
                  <h2>EcoCycle Sustainability Badge</h2>
                </div>

                <div className="cert-body">
                  <span className="cert-subtitle">
                    CERTIFICATE OF ENVIRONMENTAL IMPACT
                  </span>
                  <p className="cert-presented">
                    This official certificate is proudly presented to:
                  </p>
                  <h1 className="company-cert-name">{companyName}</h1>

                  <p className="cert-text">
                    In recognition of your exceptional commitment to
                    environmental sustainability and responsible waste
                    management. Through EcoCycle's industrial recycling program,
                    your organization successfully diverted:
                  </p>

                  <div className="cert-highlight-stats">
                    <div className="c-stat">
                      <span>Total Waste Recycled</span>
                      <strong>{totalWeight.toLocaleString()} Kg</strong>
                    </div>
                    <div className="c-stat">
                      <span>CO₂ Emissions Prevented</span>
                      <strong>{totalCo2Saved.toFixed(1)} Kg CO₂e</strong>
                    </div>
                  </div>

                  <p className="cert-footer-text">
                    This contribution significantly supports Global Health
                    Standards & Climate Goals, verifying your active role in
                    reducing industrial carbon footprint.
                  </p>
                </div>

                <div className="cert-signatures">
                  <div className="sig-block">
                    <div className="signature-line">
                      EcoCycle Official Stamp
                    </div>
                    <span>Environmental Board</span>
                  </div>
                  <div className="sig-block">
                    <div className="stamp-badge">
                      <i className="bi bi-shield-check"></i> Verified ESG
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="download-btn" onClick={() => window.print()}>
                <i className="bi bi-printer-fill"></i> Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CorporateDashboard;
