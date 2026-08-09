import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import Header from "../Components/Header";
import "../Styles/Pickup.css";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const wasteCategories = [
  {
    id: "paper",
    label: "Paper",
    unitPrice: 10,
    icon: <i className="bi bi-file-earmark-text"></i>,
  },
  {
    id: "cans",
    label: "Cans",
    unitPrice: 25,
    icon: <i className="bi bi-cup-straw"></i>,
  },
  {
    id: "glass",
    label: "Glass",
    unitPrice: 20,
    icon: <i className="bi bi-cup-hot"></i>,
  },
  {
    id: "plastic",
    label: "Plastic",
    unitPrice: 15,
    icon: <i className="bi bi-droplet"></i>,
  },
  {
    id: "jugs",
    label: "Jugs",
    unitPrice: 30,
    icon: <i className="bi bi-bucket"></i>,
  },
  {
    id: "electronics",
    label: "Electronics",
    unitPrice: 50,
    icon: <i className="bi bi-laptop"></i>,
  },
];

const LocationPicker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error("Failed to fetch address from map:", error);
      }
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

const PickupRequest = () => {
  const [address, setAddress] = useState("");
  const [pickupType, setPickupType] = useState("home"); // 'home' or 'dropoff'

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [quantities, setQuantities] = useState({
    paper: 0,
    cans: 0,
    glass: 0,
    plastic: 0,
    jugs: 0,
    electronics: 0,
  });

  const [position, setPosition] = useState([30.0444, 31.2357]); // القاهرة افتراضياً
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  // حساب الإجمالي الحقيقي
  const totalEstimation = wasteCategories.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.unitPrice;
  }, 0);

  // إرسال الطلب للباك إند
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (pickupType === "home" && (!selectedDate || !selectedTime)) {
      setErrorMessage(
        "Please select both Pickup Date and Time for At-Home Pickup.",
      );
      return;
    }

    if (totalEstimation === 0) {
      setErrorMessage("Please select at least one item quantity.");
      return;
    }

    setIsLoading(true);

    // تجهيز كائن البيانات المرسلة للباك إند
    const pickupData = {
      address,
      latitude: position[0],
      longitude: position[1],
      pickupType, // "home" or "dropoff"
      schedule:
        pickupType === "home"
          ? { date: selectedDate, time: selectedTime }
          : null,
      items: quantities,
      totalEstimation,
    };

    try {
      const token = localStorage.getItem("authToken"); // التوكن إذا كان المستخدم مسجلاً
      const response = await fetch(
        "https://your-api-endpoint.com/api/pickups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(pickupData),
        },
      );

      if (response.ok) {
        alert("Pickup Request Submitted Successfully!");
        // إعادة تعيين الحقول بعد النجاح
        setQuantities({
          paper: 0,
          cans: 0,
          glass: 0,
          plastic: 0,
          jugs: 0,
          electronics: 0,
        });
        setSelectedDate("");
        setSelectedTime("");
        setAddress("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      // تجربة محاكاة النجاح في البيئة المحلية
      alert(
        `Simulated: Request Submitted Successfully! Total: $${totalEstimation}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pickup-page-container">
      <Header />

      <main className="pickup-content-wrapper">
        <h1 className="pickup-header">
          <span className="green-text">EcoCycle</span> PICKUP REQUEST
        </h1>

        <div className="pickup-content">
          {/* Left Side: Interactive Map */}
          <div className="map-section">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={true}
              className="interactive-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker
                position={position}
                setPosition={setPosition}
                setAddress={setAddress}
              />
            </MapContainer>
          </div>

          {/* Right Side: Form Section */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div
                  className="error-alert"
                  style={{
                    color: "#e11d48",
                    fontSize: "13px",
                    fontWeight: "bold",
                    marginBottom: "12px",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* Pickup Address */}
              <div className="form-group">
                <label className="form-label">
                  Pickup Address (Click on map to pick location)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Select on map or type your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Pickup Type */}
              <div className="form-group">
                <label className="form-label">Pickup Type</label>
                <div className="pickup-type-options">
                  <div
                    className={`type-card ${
                      pickupType === "home" ? "active" : ""
                    }`}
                    onClick={() => setPickupType("home")}
                  >
                    <div className="type-icon">
                      <i className="bi bi-truck"></i>
                    </div>
                    <span className="type-title">At-Home Pickup</span>
                  </div>

                  <div
                    className={`type-card ${
                      pickupType === "dropoff" ? "active" : ""
                    }`}
                    onClick={() => setPickupType("dropoff")}
                  >
                    <div className="type-icon">
                      <i className="bi bi-trash3"></i>
                    </div>
                    <span className="type-title">Community Bin Drop-off</span>
                  </div>
                </div>
              </div>

              {/* Schedule Date & Time */}
              {pickupType === "home" && (
                <div className="form-group">
                  <label className="form-label">
                    Select Pickup Date & Time
                  </label>
                  <div className="date-time-inputs">
                    <div className="input-with-icon">
                      <span className="icon">📅</span>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-with-icon">
                      <span className="icon">🕒</span>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Waste Types with Counter & Unit Price */}
              <div className="form-group">
                <label className="form-label">Waste Types & Quantities</label>
                <div className="waste-list-container">
                  {wasteCategories.map((item) => (
                    <div key={item.id} className="waste-item-row">
                      <div className="waste-item-info">
                        <span className="waste-icon">{item.icon}</span>
                        <span className="waste-label">{item.label}</span>
                        <span className="unit-price">
                          (${item.unitPrice}/unit)
                        </span>
                      </div>

                      <div className="quantity-counter">
                        <button
                          type="button"
                          className="counter-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <i className="bi bi-dash-circle"></i>
                        </button>
                        <span className="quantity-value">
                          {quantities[item.id] || 0}
                        </span>
                        <button
                          type="button"
                          className="counter-btn"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Point/Price Estimation */}
              <div className="form-group point-estimation-group">
                <label className="form-label">Point Estimation</label>
                <div className="estimation-row">
                  <span className="estimation-text">
                    Estimated total value based on your selection
                  </span>
                  <span className="estimation-value">~${totalEstimation}</span>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "SUBMITTING..." : "SUBMIT REQUEST"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PickupRequest;
