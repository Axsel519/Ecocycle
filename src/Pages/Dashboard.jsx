import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Components/Header";
import "../Styles/Dashboard.css";

const recentActivities = [
  {
    id: 1,
    type: "Plastic & Cans",
    date: "Aug 5, 2026",
    points: "+150 EcoPoints",
    status: "Completed",
  },
  {
    id: 2,
    type: "Paper & Cardboard",
    date: "Aug 2, 2026",
    points: "+80 EcoPoints",
    status: "Completed",
  },
  {
    id: 3,
    type: "Redeemed Amazon Voucher",
    date: "Jul 28, 2026",
    points: "-1500 EcoPoints",
    status: "Redeemed",
  },
  {
    id: 4,
    type: "Glass Bottles",
    date: "Jul 20, 2026",
    points: "+120 EcoPoints",
    status: "Completed",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState("Alex");
  const [userPoints] = useState(2450);
  const [recycledCount] = useState(38);
  const [pendingPickups] = useState(1);

  const handleScanClick = () => {
    navigate("/scan");
  };

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content-wrapper">
        {/* Welcome Section */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>
              Welcome back, <span className="green-text">{userName}</span>! 👋
            </h1>
            <p>
              Track your recycling impact, manage pickups, and check your earned
              rewards.
            </p>
          </div>
          <button className="quick-action-btn" onClick={handleScanClick}>
            Scan New Waste 📸
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-tree"></i>
            </div>
            <div className="stat-info">
              <h3>Total EcoPoints</h3>
              <p className="stat-value">{userPoints}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-recycle"></i>
            </div>
            <div className="stat-info">
              <h3>Items Recycled</h3>
              <p className="stat-value">{recycledCount} kg</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-truck"></i>
            </div>
            <div className="stat-info">
              <h3>Pending Pickups</h3>
              <p className="stat-value">{pendingPickups}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="dashboard-main-grid">
          {/* Left Column: Recent Activity */}
          <div className="dashboard-card recent-activity">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="table-responsive">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Type / Action</th>
                    <th>Date</th>
                    <th>Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.type}</td>
                      <td className="text-muted">{item.date}</td>
                      <td
                        className={
                          item.points.startsWith("+")
                            ? "points-plus"
                            : "points-minus"
                        }
                      >
                        {item.points}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="dashboard-sidebar">
            {/* Goal Card */}
            <div className="dashboard-card goal-card">
              <h2>Next Reward Goal 🎯</h2>
              <p className="goal-desc">
                3000 EcoPoints for $20 Discount Voucher
              </p>

              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(userPoints / 3000) * 100}%` }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>{userPoints} pts</span>
                <span>3000 pts</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card quick-links-card">
              <h2>Quick Actions</h2>
              <div className="quick-buttons-group">
                <Link to="/pickup" className="quick-link-item">
                  <span>🚚 Schedule At-Home Pickup</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/rewards" className="quick-link-item">
                  <span>🎁 Browse Reward Store</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
