import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Dashboard.css";

// بيانات افتراضية شاملة للنظام
const initialUsers = [
  {
    id: 1,
    name: "Ahmed Youssef",
    email: "ahmed@example.com",
    role: "admin",
    points: 2450,
    status: "Active",
  },
  {
    id: 2,
    name: "Sara Hassan",
    email: "sara@example.com",
    role: "user",
    points: 820,
    status: "Active",
  },
  {
    id: 3,
    name: "Mohamed Ali",
    email: "m.ali@example.com",
    role: "courier",
    points: 0,
    status: "Active",
  },
];

const initialPickups = [
  {
    id: "REQ-101",
    user: "Sara Hassan",
    address: "Maadi, Cairo",
    type: "Plastic & Cans",
    date: "2026-10-18",
    status: "Pending",
  },
  {
    id: "REQ-102",
    user: "Ahmed Youssef",
    address: "Dokki, Giza",
    type: "Paper & Cardboard",
    date: "2026-10-17",
    status: "In Progress",
  },
  {
    id: "REQ-103",
    user: "Khaled Omar",
    address: "Nasr City, Cairo",
    type: "E-Waste",
    date: "2026-10-15",
    status: "Completed",
  },
];

const initialRewards = [
  {
    id: 1,
    title: "$10 Amazon Gift Card",
    points: 1500,
    stock: 25,
    active: true,
  },
  {
    id: 2,
    title: "20% Uber Discount Voucher",
    points: 800,
    stock: 50,
    active: true,
  },
  {
    id: 3,
    title: "Eco-friendly Water Bottle",
    points: 1200,
    stock: 10,
    active: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // Options: overview, users, pickups, rewards

  // States للبيانات التفاعلية
  const [usersList, setUsersList] = useState(initialUsers);
  const [pickupsList, setPickupsList] = useState(initialPickups);
  const [rewardsList, setRewardsList] = useState(initialRewards);

  // حماية الصفحة والتأكد من الصلاحيات
  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (!storedUserStr) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUserStr);
      if (user.role !== "admin") {
        navigate("/");
        return;
      }
      setAdminUser(user);
    } catch (error) {
      console.error("Error reading user data", error);
      navigate("/login");
    }
  }, [navigate]);

  // إدارة حالات الطلبات
  const handleUpdatePickupStatus = (id, newStatus) => {
    setPickupsList((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
    );
  };

  // تعديل نقاط المستخدمين
  const handleAddPoints = (userId, amount) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, points: u.points + amount } : u,
      ),
    );
  };

  // تبديل حالة تفعيل الجوائز
  const handleToggleReward = (id) => {
    setRewardsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  };

  if (!adminUser) return null;

  return (
    <div className="dashboard-page-container">
      <Header />

      <main className="dashboard-content-wrapper">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>
              System Control Center,{" "}
              <span className="green-text">{adminUser.name || "Admin"}</span>
            </h1>
            <p>
              Full administrative access to manage users, monitor pickups, and
              configure platform settings.
            </p>
          </div>
          <button
            className="quick-action-btn"
            onClick={() => navigate("/scan")}
          >
            Scan Waste Camera 📸
          </button>
        </div>

        {/* Global Control Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="bi bi-grid-fill"></i> Overview
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "pickups" ? "active" : ""}`}
            onClick={() => setActiveTab("pickups")}
          >
            <i className="bi bi-truck"></i> Pickups (
            {pickupsList.filter((p) => p.status === "Pending").length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="bi bi-people-fill"></i> Manage Users (
            {usersList.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "rewards" ? "active" : ""}`}
            onClick={() => setActiveTab("rewards")}
          >
            <i className="bi bi-gift-fill"></i> Rewards Store
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="stat-info">
                  <h3>Total Platform Users</h3>
                  <p className="stat-value">{usersList.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-truck"></i>
                </div>
                <div className="stat-info">
                  <h3>Pending Requests</h3>
                  <p className="stat-value">
                    {pickupsList.filter((p) => p.status === "Pending").length}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-recycle"></i>
                </div>
                <div className="stat-info">
                  <h3>Total Recycled Weight</h3>
                  <p className="stat-value">1,420 kg</p>
                </div>
              </div>
            </div>

            <div className="dashboard-main-grid">
              <div className="dashboard-card">
                <h2>Recent Pickups Activity</h2>
                <div className="table-responsive">
                  <table className="activity-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickupsList.slice(0, 5).map((p) => (
                        <tr key={p.id}>
                          <td className="fw-bold">{p.id}</td>
                          <td>{p.user}</td>
                          <td>{p.type}</td>
                          <td>
                            <span
                              className={`status-badge ${p.status.toLowerCase().replace(" ", "-")}`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-sidebar">
                <div className="dashboard-card">
                  <h2>System Health & Quick Links</h2>
                  <div className="quick-buttons-group">
                    <button
                      className="quick-link-btn"
                      onClick={() => navigate("/corporate")}
                    >
                      <span>🏢 Corporate ESG Portal</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                    <button
                      className="quick-link-btn"
                      onClick={() => navigate("/delivery")}
                    >
                      <span>🚚 Courier Logistics View</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Manage Pickups */}
        {activeTab === "pickups" && (
          <div className="dashboard-card full-width">
            <h2>Manage All Pickup Requests</h2>
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>User Name</th>
                    <th>Address</th>
                    <th>Waste Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pickupsList.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.id}</td>
                      <td>{p.user}</td>
                      <td>{p.address}</td>
                      <td>{p.type}</td>
                      <td>{p.date}</td>
                      <td>
                        <span
                          className={`status-badge ${p.status.toLowerCase().replace(" ", "-")}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="table-action-select"
                          value={p.status}
                          onChange={(e) =>
                            handleUpdatePickupStatus(p.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Manage Users */}
        {activeTab === "users" && (
          <div className="dashboard-card full-width">
            <h2>Registered Users & EcoPoints Control</h2>
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>EcoPoints</th>
                    <th>Status</th>
                    <th>Grant Points</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-bold">#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="fw-bold text-green">{u.points} pts</td>
                      <td>
                        <span className="status-badge completed">
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="points-action-group">
                          <button
                            className="small-btn add-pts"
                            onClick={() => handleAddPoints(u.id, 100)}
                          >
                            +100
                          </button>
                          <button
                            className="small-btn add-pts"
                            onClick={() => handleAddPoints(u.id, 500)}
                          >
                            +500
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Manage Rewards */}
        {activeTab === "rewards" && (
          <div className="dashboard-card full-width">
            <h2>Rewards Store Configuration</h2>
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Reward Title</th>
                    <th>Points Required</th>
                    <th>Stock Available</th>
                    <th>Status</th>
                    <th>Toggle Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardsList.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-bold">{r.title}</td>
                      <td>{r.points} EcoPoints</td>
                      <td>{r.stock} items</td>
                      <td>
                        <span
                          className={`status-badge ${r.active ? "completed" : "redeemed"}`}
                        >
                          {r.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`small-btn ${r.active ? "disable-btn" : "enable-btn"}`}
                          onClick={() => handleToggleReward(r.id)}
                        >
                          {r.active ? "Disable Reward" : "Enable Reward"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
