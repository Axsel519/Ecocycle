import React, { useState } from "react";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/DeliveryDashboard.css";

// إصلاح أيقونات Leaflet القياسية
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// مكون لإعادة نقل مركز الخريطة عند تغيير الطلب المكتشف
function MapRecenter({ lat, lng }) {
  const map = useMap();
  React.useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

const initialOrders = [
  {
    id: "ORD-8801",
    customerName: "Ahmed Youssef",
    phone: "+201001234567",
    address: "Street 9, Building 14, Maadi, Cairo",
    items: "Plastic Bottles (12kg), Aluminum Cans (4kg)",
    payout: "EGP 240",
    status: "Pending",
    lat: 29.9602,
    lng: 31.2569,
  },
  {
    id: "ORD-8802",
    customerName: "Sara Hassan",
    phone: "+201119876543",
    address: "El-Tahrir St, Block 4, Dokki, Giza",
    items: "Paper & Cardboard (25kg)",
    payout: "EGP 150",
    status: "Pending",
    lat: 30.0371,
    lng: 31.2118,
  },
  {
    id: "ORD-8803",
    customerName: "Mohamed Ali",
    phone: "+201223334444",
    address: "Al-Ahram St, Near Giza Square",
    items: "Glass Bottles (18kg), E-Waste (2 units)",
    payout: "EGP 310",
    status: "In Progress",
    lat: 30.0131,
    lng: 31.2089,
  },
];

function DeliveryDashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);
  const [filterStatus, setFilterStatus] = useState("All");

  const handleStatusUpdate = (orderId, newStatus) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updated);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const inProgressCount = orders.filter(
    (o) => o.status === "In Progress",
  ).length;

  return (
    <div className="delivery-page-wrapper">
      <Header />

      <main className="delivery-container">
        {/* Banner Section */}
        <div className="delivery-banner">
          <div className="banner-text">
            <span className="courier-badge">
              <i className="bi bi-truck"></i> Courier Logistics Portal
            </span>
            <h1>Pickup Operations & Logistics</h1>
            <p>
              View assigned waste collection requests, navigate directly to
              clients, and manage collection lifecycle.
            </p>
          </div>

          <div className="driver-stats">
            <div className="d-stat-box">
              <span className="d-stat-title">Active Orders</span>
              <span className="d-stat-num">{inProgressCount}</span>
            </div>
            <div className="d-stat-box success">
              <span className="d-stat-title">Completed Today</span>
              <span className="d-stat-num">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="delivery-grid">
          {/* Left Side: Orders List Panel */}
          <div className="orders-list-card">
            <div className="card-header-flex">
              <h2 className="card-title">
                <i className="bi bi-box-seam-fill"></i> Assigned Tasks (
                {filteredOrders.length})
              </h2>

              {/* Filter Tabs */}
              <div className="filter-tabs">
                {["All", "Pending", "In Progress", "Completed"].map(
                  (status) => (
                    <button
                      key={status}
                      className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="orders-scroll-list">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`order-item ${
                      selectedOrder?.id === order.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-item-header">
                      <span className="order-id">{order.id}</span>
                      <span
                        className={`status-badge ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <h3 className="customer-name">{order.customerName}</h3>
                    <p className="order-address">
                      <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                      {order.address}
                    </p>

                    <div className="order-item-footer">
                      <span className="order-items-summary">{order.items}</span>
                      <span className="payout-tag">{order.payout}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders-found">
                  <i className="bi bi-inbox"></i>
                  <p>No orders found for this filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Detailed View & Interactive Map */}
          <div className="map-details-card">
            {selectedOrder ? (
              <>
                <div className="selected-details-box">
                  <div className="details-header">
                    <div>
                      <h2>{selectedOrder.customerName}</h2>
                      <span className="order-id-sub">{selectedOrder.id}</span>
                    </div>
                    <div className="action-buttons-head">
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="call-btn"
                      >
                        <i className="bi bi-telephone-fill"></i> Call Client
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedOrder.lat},${selectedOrder.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="google-maps-btn"
                      >
                        <i className="bi bi-compass-fill"></i> Open Navigation
                      </a>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-block">
                      <label>Pickup Location</label>
                      <p>{selectedOrder.address}</p>
                    </div>
                    <div className="info-block">
                      <label>Waste Items</label>
                      <p>{selectedOrder.items}</p>
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="status-actions-bar">
                    <label>Pickup Status:</label>
                    <div className="btn-group">
                      {selectedOrder.status === "Pending" && (
                        <button
                          className="status-btn start-btn"
                          onClick={() =>
                            handleStatusUpdate(selectedOrder.id, "In Progress")
                          }
                        >
                          <i className="bi bi-play-circle-fill"></i> Start
                          Pickup Request
                        </button>
                      )}

                      {selectedOrder.status === "In Progress" && (
                        <button
                          className="status-btn complete-btn"
                          onClick={() =>
                            handleStatusUpdate(selectedOrder.id, "Completed")
                          }
                        >
                          <i className="bi bi-check-circle-fill"></i> Mark as
                          Collected
                        </button>
                      )}

                      {selectedOrder.status === "Completed" && (
                        <div className="completed-tag">
                          <i className="bi bi-patch-check-fill"></i> Order
                          Collected Successfully
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Leaflet Map Section */}
                <div className="map-wrapper">
                  <MapContainer
                    center={[selectedOrder.lat, selectedOrder.lng]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="leaflet-map-container"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapRecenter
                      lat={selectedOrder.lat}
                      lng={selectedOrder.lng}
                    />
                    <Marker position={[selectedOrder.lat, selectedOrder.lng]}>
                      <Popup>
                        <strong>{selectedOrder.customerName}</strong>
                        <br />
                        {selectedOrder.address}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </>
            ) : (
              <div className="no-order-selected">
                <i className="bi bi-cursor-fill"></i>
                <p>Select an order from the list to view route & details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DeliveryDashboard;
